# Plan: SQLite Backup System + Admin CRUD

## Context

SQLite is staying as the production database. The current admin panel is read-only (can only view registrations). We need:
1. **Automated backups** with easy download for local inspection (DBeaver)
2. **Admin CRUD for federation types and supplements** (the reference data that drives the registration form)
3. **CSV export** of registrations

Registrations remain read-only in admin — the admin does not create, edit, or delete registrations.

---

## Phase A: Backup System + DB Access

### A1. Move and enhance backup script

**Move** `backup-db.sh` (root) → `scripts/backup-db.sh`

Enhance:
- Configurable `RETENTION_DAYS` env var (default 7)
- Timestamp with hours in filename: `vertikal-YYYY-MM-DD_HH-MM.db`
- Log file size after backup
- Non-zero exit on integrity failure

### A2. Add backup service to Docker Compose

**Modify:** `docker-compose.yml`

```yaml
backup:
  build: { context: ., dockerfile: Dockerfile.backup }
  volumes:
    - sqlite-data:/app/data:ro
    - ./backups:/backups          # bind mount = accessible from host via SCP
  environment:
    - DB_PATH=/app/data/vertikal.db
    - BACKUP_DIR=/backups
    - RETENTION_DAYS=7
  profiles: ["backup"]           # only runs when explicitly invoked
```

**New:** `Dockerfile.backup` — Alpine + sqlite3 + the backup script (~5 LOC)

**Modify:** `.gitignore` and `.dockerignore` — add `backups/`

### A3. Cron + download instructions

**Modify:** `DEPLOY.md` — add sections:

- **Cron:** `0 3 * * * cd /opt/vertikal && docker compose --profile backup run --rm backup`
- **Download to local:** `scp deploy@VPS_IP:/opt/vertikal/backups/LATEST_FILE ./vertikal-backup.db` → open with DBeaver
- **Restore procedure:** stop app → copy backup into volume → restart

### Files (Phase A)

| Action | File |
|--------|------|
| Move + enhance | `backup-db.sh` → `scripts/backup-db.sh` |
| New | `Dockerfile.backup` |
| Modify | `docker-compose.yml` |
| Modify | `.gitignore`, `.dockerignore` |
| Modify | `DEPLOY.md` |

---

## Phase B: Federation Types CRUD

### B1. Shared nav items

**New:** `src/components/admin/nav-items.ts` — shared `ADMIN_NAV_ITEMS` array to avoid duplicating links.

**Modify:** `src/components/admin/admin-sidebar.tsx` — use `ADMIN_NAV_ITEMS`
**Modify:** `src/components/admin/mobile-sidebar.tsx` — use `ADMIN_NAV_ITEMS`

### B2. Validation schema

**New:** `src/validations/federation-type.ts`

Fields: `name` (min 2), `description` (min 5), `price` (int > 0, in cents). Follow pattern from `src/validations/registration.ts`.

### B3. Server actions

**New:** `src/app/admin/(dashboard)/tipos-federacion/actions.ts`

- `createFederationType(prevState, formData)` → Zod parse, `prisma.federationType.create()`, `revalidatePath`
- `updateFederationType(id, prevState, formData)` → same with `update()`, bind id client-side
- `toggleFederationTypeActive(id, isActive)` → toggle `active` boolean

All actions: auth check first, return `{ success: boolean; error?: string }`.

### B4. List page + components

**New:** `src/app/admin/(dashboard)/tipos-federacion/page.tsx` — server component, fetches all federation types with `_count` of supplements and registrations

**New:** `src/components/admin/federation-types-table.tsx` — table with: Name, Description, Price, Active (badge), #Supplements, #Registrations, Actions (edit, toggle active)

**New:** `src/components/admin/federation-type-form-dialog.tsx` — **dialog** for create/edit. Uses react-hook-form + zodResolver + shadcn Form. Price input shows EUR, converts to cents on submit. Reused for both modes via optional `defaultValues` + `federationTypeId` props.

**New:** `src/components/admin/create-federation-type-button.tsx` — button controlling dialog open state

**New:** `loading.tsx` + `error.tsx` in tipos-federacion/

### B5. Tests

**New:** `src/validations/__tests__/federation-type.test.ts`
**New:** `src/app/admin/(dashboard)/tipos-federacion/__tests__/actions.test.ts`

---

## Phase C: Supplements CRUD

Same pattern as Phase B. Key differences:

- Extra field: `federationTypeId` (Select dropdown of active federation types)
- Table shows parent federation type name
- Form dialog receives `federationTypes` list as prop

### Files (Phase C)

| Action | File |
|--------|------|
| New | `src/validations/supplement.ts` |
| New | `src/app/admin/(dashboard)/suplementos/page.tsx` |
| New | `src/app/admin/(dashboard)/suplementos/actions.ts` |
| New | `src/app/admin/(dashboard)/suplementos/loading.tsx` + `error.tsx` |
| New | `src/components/admin/supplements-table.tsx` |
| New | `src/components/admin/supplement-form-dialog.tsx` |
| New | `src/components/admin/create-supplement-button.tsx` |
| New | Tests for validation + actions |

---

## Phase D: Registration CSV Export

### D1. Extract shared filter logic

**New:** `src/helpers/registration-filters.ts` — extract `buildWhere()` from `src/app/admin/(dashboard)/page.tsx:59-82`

**Modify:** `src/app/admin/(dashboard)/page.tsx` — import shared `buildRegistrationWhere`

### D2. CSV export API route

**New:** `src/app/api/admin/registrations/export/route.ts` — GET handler with inline auth check. Reads same filter params as list page. Returns CSV with `Content-Disposition` header.

**New:** `src/helpers/csv-export.ts` — `buildCsvContent()`. Semicolon delimiter (Spanish locale). UTF-8 BOM for Excel. All registration fields + federation type + supplements.

### D3. Export button

**New:** `src/components/admin/export-registrations-button.tsx` — triggers fetch, downloads via blob URL

**Modify:** `src/app/admin/(dashboard)/page.tsx` — add export button next to title

### D4. Tests

**New:** `src/helpers/__tests__/csv-export.test.ts`
**New:** `src/helpers/__tests__/registration-filters.test.ts`

---

## Implementation Order

1. **Phase A** (Backups) — infrastructure, independent, gives peace of mind
2. **Phase B** (Federation Types) — establishes CRUD patterns (nav, dialogs, tables, actions)
3. **Phase C** (Supplements) — reuses all patterns from Phase B
4. **Phase D** (Export) — clean refactor of shared filters + export route

Each phase is independently deployable.

---

## Verification

### Phase A
- `docker compose --profile backup run --rm backup` creates file in `./backups/`
- Backup file opens correctly in DBeaver
- Cron entry documented in DEPLOY.md

### Phases B + C
- Navigate to `/admin/tipos-federacion` and `/admin/suplementos`
- Create, edit, toggle active — changes reflected immediately
- Sidebar links visible on desktop and mobile
- `npm test` passes (validation + action tests)

### Phase D
- Click "Exportar CSV" on registrations page → file downloads
- CSV opens correctly in Excel (Spanish locale, semicolons)
- Filters applied on page are reflected in export

### Global
- `npm run lint` passes
- `npm test` passes
- All components under 150 LOC, all files under 200 LOC
