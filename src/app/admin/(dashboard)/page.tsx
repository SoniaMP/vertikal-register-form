import { prisma } from "@/lib/prisma";
import { MembershipFilters } from "@/components/admin/membership-filters";
import { MembershipsTable } from "@/components/admin/memberships-table";
import { Pagination } from "@/components/admin/pagination";
import { CreateMemberButton } from "@/components/admin/create-member-button";
import { fetchLicenseCatalog } from "@/lib/license-catalog";

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  search?: string;
  type?: string;
  membershipStatus?: string;
  page?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dni?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  address?: string;
  dateOfBirth?: string;
  federated?: string;
}>;

const MEMBER_TEXT_KEYS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "dni",
  "city",
  "province",
  "postalCode",
  "address",
  "dateOfBirth",
] as const;

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const [{ memberships, total, licenseTypes }, catalog] = await Promise.all([
    fetchData(params, page),
    fetchLicenseCatalog(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Miembros</h1>
        <CreateMemberButton licenseCatalog={catalog} />
      </div>
      <MembershipFilters licenseTypes={licenseTypes} />
      <MembershipsTable memberships={memberships} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}

async function fetchData(params: Awaited<SearchParams>, page: number) {
  const where = buildWhere(params);

  const [memberships, total, licenseTypes] = await Promise.all([
    prisma.membership.findMany({
      where,
      include: {
        member: true,
        type: true,
        subtype: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.membership.count({ where }),
    prisma.licenseType.findMany({
      where: { active: true },
      select: { id: true, name: true },
    }),
  ]);

  return { memberships, total, licenseTypes };
}

function buildWhere(params: Awaited<SearchParams>) {
  const conditions: Record<string, unknown>[] = [];
  const hasAdvancedTextFilter = MEMBER_TEXT_KEYS.some((k) => params[k]);

  if (params.search && !hasAdvancedTextFilter) {
    const search = params.search;
    conditions.push({
      member: {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
        ],
      },
    });
  }

  for (const key of MEMBER_TEXT_KEYS) {
    if (params[key]) {
      conditions.push({ member: { [key]: { contains: params[key] } } });
    }
  }

  if (params.type) {
    conditions.push({ typeId: params.type });
  }

  if (params.federated === "true" || params.federated === "false") {
    conditions.push({ isFederated: params.federated === "true" });
  }

  if (params.membershipStatus) {
    conditions.push({ status: params.membershipStatus });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
