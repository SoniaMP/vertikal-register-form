# Migration Plan: Registration → Member + Membership

## 1. Design Decisions & Justifications

### Model separation

| Concern | Model | Rationale |
|---------|-------|-----------|
| **Identity** | `Member` | DNI unique. Personal data lives here ("live", always up to date). |
| **Annual instance** | `Membership` | One per member per year. Holds federation choice, category, payment, status. |
| **Season catalog** | *Not needed* | `year Int` on Membership is enough. A `Season` table adds joins without value — you don't need year-level metadata. |
| **Payment** | *Fields on Membership* | One membership = one payment. No installments, no retries model. If that changes, extract later. |

### Field placement

| Field | Lives in | Why |
|-------|----------|-----|
| `firstName, lastName, email, phone, address, city, postalCode, province, dateOfBirth` | **Member** | "Live" data, updated on each renewal. No snapshot in Membership — for a club this size, the current data is sufficient. If you need invoice traceability, Stripe already stores that. |
| `federationTypeId, federationSubtypeId, categoryId` | **Membership** | Changes year to year. Historical record per season. |
| `isFederated` | **Membership** | Federation status can change each year. |
| `active` (Boolean) | **Replaced** by `MembershipStatus` enum on Membership | A boolean can't express PENDING_PAYMENT vs EXPIRED vs CANCELLED. The enum is self-documenting. |
| `totalAmount, paymentStatus, stripeSessionId, stripePaymentId` | **Membership** | Payment is per annual membership. |
| `confirmationSent` | **Membership** | Confirmation email is sent per membership cycle. |
| `consentedAt` | **Membership** | Re-captured each year at renewal (GDPR best practice). |

### Why no personal data snapshot in Membership

For a club with <1000 members, the complexity of maintaining snapshot copies isn't justified. The `Member` record is the source of truth. If a member changes their address, the old address is gone — and that's fine because:

- Stripe keeps the billing snapshot on the PaymentIntent.
- If you later need full audit trail, add an `AddressHistory` model then — don't pre-build it.

---

## 2. New Prisma Schema

> SQLite doesn't support native enums in Prisma, so status fields remain `String` with TypeScript-level validation (same pattern already used for `paymentStatus`).

### New models

```prisma
// ──────────────────────────────────────────────
// Member: person identity (DNI unique)
// ──────────────────────────────────────────────
model Member {
  id          String   @id @default(cuid())
  dni         String   @unique
  firstName   String
  lastName    String
  email       String
  phone       String
  dateOfBirth String
  address     String
  city        String
  postalCode  String
  province    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  memberships Membership[]

  @@index([email])
  @@index([lastName, firstName])
}

// ──────────────────────────────────────────────
// Membership: annual instance per member
// Status: PENDING_PAYMENT | ACTIVE | EXPIRED | CANCELLED
// PaymentStatus: PENDING | COMPLETED | FAILED | REFUNDED
// ──────────────────────────────────────────────
model Membership {
  id                  String   @id @default(cuid())
  memberId            String
  year                Int
  status              String   @default("PENDING_PAYMENT")
  federationTypeId    String
  federationSubtypeId String
  categoryId          String
  isFederated         Boolean  @default(false)
  totalAmount         Int      // cents
  paymentStatus       String   @default("PENDING")
  stripeSessionId     String?
  stripePaymentId     String?
  confirmationSent    Boolean  @default(false)
  consentedAt         DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  member            Member                 @relation(fields: [memberId], references: [id], onDelete: Cascade)
  federationType    FederationType         @relation(fields: [federationTypeId], references: [id])
  federationSubtype FederationSubtype      @relation(fields: [federationSubtypeId], references: [id])
  category          Category               @relation(fields: [categoryId], references: [id])
  supplements       MembershipSupplement[]

  @@unique([memberId, year])
  @@index([year, status])
  @@index([year, paymentStatus])
  @@index([stripeSessionId])
}

// ──────────────────────────────────────────────
// MembershipSupplement: junction with price snapshot
// ──────────────────────────────────────────────
model MembershipSupplement {
  membershipId String
  supplementId String
  priceAtTime  Int

  membership Membership @relation(fields: [membershipId], references: [id], onDelete: Cascade)
  supplement Supplement @relation(fields: [supplementId], references: [id])

  @@id([membershipId, supplementId])
}
```

### Changes to existing models

The catalog models (`FederationType`, `FederationSubtype`, `Category`, `CategoryPrice`, `Supplement`, `SupplementGroup`, `AdminUser`, `AppSetting`) **stay the same** except for updating relation names:

```prisma
// In FederationType: replace  registrations Registration[]
//                    with     memberships  Membership[]

// In FederationSubtype: replace  registrations Registration[]
//                       with     memberships  Membership[]

// In Category: replace  registrations Registration[]
//              with     memberships  Membership[]

// In Supplement: replace  registrationSupplements RegistrationSupplement[]
//                with     membershipSupplements   MembershipSupplement[]
```

**Delete** the old `Registration` and `RegistrationSupplement` models.

### TypeScript enums (`src/types/index.ts`)

```typescript
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const MEMBERSHIP_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type MembershipStatus =
  (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];
```

### Index rationale

| Index | Purpose |
|-------|---------|
| `Member.dni` (unique) | Primary lookup for registration/renewal flows |
| `Member.email` | Admin search, email dedup checks |
| `Member.lastName, firstName` | Admin text search |
| `Membership.[memberId, year]` (unique) | Prevents duplicate memberships, fast lookup by member+year |
| `Membership.[year, status]` | "All active members for 2026" — the most common admin query |
| `Membership.[year, paymentStatus]` | "All pending payments for 2026" |
| `Membership.stripeSessionId` | Stripe webhook handler needs to find membership by session ID |

---

## 3. Migration Plan

### Step 1: Infer `year` from `createdAt`

```sql
-- Rule: Dec 15-31 → next year; otherwise → same year
CASE
  WHEN strftime('%m', createdAt) = '12'
   AND CAST(strftime('%d', createdAt) AS INTEGER) >= 15
  THEN CAST(strftime('%Y', createdAt) AS INTEGER) + 1
  ELSE CAST(strftime('%Y', createdAt) AS INTEGER)
END AS season_year
```

This matches the user flow: registration from ~Dec 15 is for the next season. If you want a safer cutoff, Dec 1 also works — but Dec 15 matches the "last two weeks of the year" description.

### Step 2: Create `Member` records (deduplicate by DNI)

```typescript
// Migration script (TypeScript, runs once)
const registrations = await prisma.registration.findMany({
  orderBy: { createdAt: "desc" },
});

// Group by normalized DNI, take most recent for personal data
const memberMap = new Map<string, typeof registrations[0]>();
for (const reg of registrations) {
  const normalizedDni = reg.dni.toUpperCase().trim();
  if (!memberMap.has(normalizedDni)) {
    memberMap.set(normalizedDni, reg);
  }
}

for (const [dni, reg] of memberMap) {
  await prisma.member.create({
    data: {
      dni,
      firstName: reg.firstName,
      lastName: reg.lastName,
      email: reg.email,
      phone: reg.phone,
      dateOfBirth: reg.dateOfBirth,
      address: reg.address,
      city: reg.city,
      postalCode: reg.postalCode,
      province: reg.province,
    },
  });
}
```

### Step 3: Create `Membership` records from each `Registration`

```typescript
function inferYear(createdAt: Date): number {
  const month = createdAt.getMonth(); // 0-indexed (11 = December)
  const day = createdAt.getDate();
  const year = createdAt.getFullYear();
  return month === 11 && day >= 15 ? year + 1 : year;
}

function inferStatus(reg: Registration): string {
  if (!reg.active) return "CANCELLED";
  if (reg.paymentStatus === "COMPLETED") return "ACTIVE";
  if (reg.paymentStatus === "REFUNDED") return "CANCELLED";
  if (reg.paymentStatus === "FAILED") return "CANCELLED";
  return "PENDING_PAYMENT";
}

for (const reg of registrations) {
  const normalizedDni = reg.dni.toUpperCase().trim();
  const member = await prisma.member.findUnique({
    where: { dni: normalizedDni },
  });
  const year = inferYear(reg.createdAt);

  // Handle potential (memberId, year) conflicts:
  // If two registrations for the same DNI resolve to the same year,
  // keep the one with COMPLETED payment, or the most recent.
  const existing = await prisma.membership.findUnique({
    where: { memberId_year: { memberId: member!.id, year } },
  });

  if (existing) {
    // Keep COMPLETED over non-COMPLETED; keep newer over older
    const existingIsCompleted = existing.paymentStatus === "COMPLETED";
    const newIsCompleted = reg.paymentStatus === "COMPLETED";
    if (existingIsCompleted && !newIsCompleted) continue; // keep existing
    if (!existingIsCompleted && !newIsCompleted) continue; // keep first one
    // newIsCompleted wins → delete existing and recreate
    await prisma.membership.delete({
      where: { id: existing.id },
    });
  }

  await prisma.membership.create({
    data: {
      memberId: member!.id,
      year,
      status: inferStatus(reg),
      federationTypeId: reg.federationTypeId,
      federationSubtypeId: reg.federationSubtypeId,
      categoryId: reg.categoryId,
      isFederated: reg.isFederated,
      totalAmount: reg.totalAmount,
      paymentStatus: reg.paymentStatus,
      stripeSessionId: reg.stripeSessionId,
      stripePaymentId: reg.stripePaymentId,
      confirmationSent: reg.confirmationSent,
      consentedAt: reg.consentedAt,
      createdAt: reg.createdAt,
      // Migrate supplements
      supplements: {
        create: await getSupplements(reg.id),
      },
    },
  });
}

async function getSupplements(registrationId: string) {
  const supplements = await prisma.registrationSupplement.findMany({
    where: { registrationId },
  });
  return supplements.map((s) => ({
    supplementId: s.supplementId,
    priceAtTime: s.priceAtTime,
  }));
}
```

### Step 4: Validate and drop old tables

1. Count members vs distinct DNIs in registrations → must match.
2. Count memberships vs registrations → may differ (conflicts collapsed).
3. Spot-check 10 random members: personal data matches most recent registration.
4. Verify no orphan memberships (every memberId exists in Member).
5. Once validated: drop Registration and RegistrationSupplement.

### Prisma migration sequence

```bash
# 1. Add new models alongside old ones (non-breaking)
npx prisma migrate dev --name add_member_and_membership

# 2. Run the TypeScript migration script above
npx tsx prisma/migrations/seed-members.ts

# 3. Validate data integrity

# 4. Remove old Registration model from schema
npx prisma migrate dev --name drop_registration
```

---

## 4. Five Typical Queries

### Q1: Get member by DNI with memberships (ordered by year desc)

```typescript
async function getMemberByDni(dni: string) {
  return prisma.member.findUnique({
    where: { dni: dni.toUpperCase().trim() },
    include: {
      memberships: {
        orderBy: { year: "desc" },
        include: {
          federationType: true,
          federationSubtype: true,
          category: true,
          supplements: { include: { supplement: true } },
        },
      },
    },
  });
}
```

### Q2: List active members for a given year

```typescript
async function getActiveMembersByYear(year: number) {
  return prisma.membership.findMany({
    where: { year, status: "ACTIVE" },
    include: {
      member: true,
      federationType: true,
      federationSubtype: true,
      category: true,
    },
    orderBy: { member: { lastName: "asc" } },
  });
}
```

### Q3: Create or renew membership (idempotent via upsert)

```typescript
async function renewMembership(params: {
  dni: string;
  year: number;
  federationTypeId: string;
  federationSubtypeId: string;
  categoryId: string;
  totalAmount: number;
  supplementIds: { supplementId: string; priceAtTime: number }[];
  consentedAt: Date;
}) {
  const { dni, year, supplementIds, ...data } = params;

  // Find or create member
  const member = await prisma.member.findUnique({
    where: { dni: dni.toUpperCase().trim() },
  });

  if (!member) {
    throw new Error(`Member with DNI ${dni} not found`);
  }

  return prisma.membership.upsert({
    where: {
      memberId_year: { memberId: member.id, year },
    },
    create: {
      memberId: member.id,
      year,
      ...data,
      supplements: {
        create: supplementIds,
      },
    },
    update: {
      // Update federation choice if re-submitting before payment
      federationTypeId: data.federationTypeId,
      federationSubtypeId: data.federationSubtypeId,
      categoryId: data.categoryId,
      totalAmount: data.totalAmount,
      // Re-create supplements on update
      supplements: {
        deleteMany: {},
        create: supplementIds,
      },
    },
  });
}
```

### Q4: Mark payment completed and attach Stripe IDs

```typescript
async function completePayment(
  stripeSessionId: string,
  stripePaymentId: string,
) {
  // Find by Stripe session (webhook handler pattern)
  const membership = await prisma.membership.findFirst({
    where: { stripeSessionId },
  });

  if (!membership) {
    throw new Error(`No membership found for session ${stripeSessionId}`);
  }

  return prisma.membership.update({
    where: { id: membership.id },
    data: {
      paymentStatus: "COMPLETED",
      status: "ACTIVE",
      stripePaymentId,
    },
  });
}
```

### Q5: Detect non-renewed members (active last year, missing this year)

```typescript
async function getNonRenewedMembers(currentYear: number) {
  return prisma.member.findMany({
    where: {
      memberships: {
        some: {
          year: currentYear - 1,
          status: "ACTIVE",
        },
        none: {
          year: currentYear,
        },
      },
    },
    include: {
      memberships: {
        where: { year: currentYear - 1 },
        include: { federationType: true, category: true },
      },
    },
    orderBy: { lastName: "asc" },
  });
}
```

---

## 5. Summary Diagram

```
Member (1) ←──── (N) Membership (1) ←──── (N) MembershipSupplement
  │                      │   │   │                        │
  │ dni UNIQUE           │   │   │                        │
  │ personal data        │   │   └── Category             └── Supplement
  │                      │   └────── FederationSubtype
  │                      └────────── FederationType
  │
  │  @@unique([memberId, year])
  │  status: PENDING_PAYMENT | ACTIVE | EXPIRED | CANCELLED
  │  paymentStatus: PENDING | COMPLETED | FAILED | REFUNDED
```

---

## 6. Open Recommendations

1. **Batch expiration job**: At the start of each year, run a cron/script that sets all previous-year ACTIVE memberships to EXPIRED. This keeps `status` accurate without manual intervention.

2. **PostgreSQL migration**: If the club grows, consider migrating from SQLite to PostgreSQL. Then you can use native `enum` types in Prisma and get proper constraint enforcement at DB level.

3. **`AppSetting` for current season**: Add a `CURRENT_SEASON_YEAR` setting to `AppSetting` so the app knows which year is "active" without date math. Update it once per year.

4. **Email as potential unique on Member**: Consider adding `@@unique` on `email` if you want to prevent two members sharing the same email. Depends on business rules (families might share).
