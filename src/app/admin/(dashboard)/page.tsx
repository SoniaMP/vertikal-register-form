import { prisma } from "@/lib/prisma";
import { RegistrationFilters } from "@/components/admin/registration-filters";
import { RegistrationsTable } from "@/components/admin/registrations-table";
import { Pagination } from "@/components/admin/pagination";
import { CreateRegistrationButton } from "@/components/admin/create-registration-button";

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  search?: string;
  federation?: string;
  status?: string;
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
  active?: string;
}>;

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const {
    registrations,
    total,
    federationTypes,
    federationTypesWithRelations,
  } = await fetchData(params, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Miembros</h1>
        <CreateRegistrationButton
          federationTypes={federationTypesWithRelations}
        />
      </div>
      <RegistrationFilters federationTypes={federationTypes} />
      <RegistrationsTable registrations={registrations} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}

async function fetchData(params: Awaited<SearchParams>, page: number) {
  const where = buildWhere(params);

  const [registrations, total, federationTypes, federationTypesWithRelations] =
    await Promise.all([
      prisma.registration.findMany({
        where,
        include: { federationType: true, federationSubtype: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.registration.count({ where }),
      prisma.federationType.findMany({
        where: { active: true },
        select: { id: true, name: true },
      }),
      prisma.federationType.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          subtypes: {
            where: { active: true },
            select: { id: true, name: true },
          },
          categories: {
            where: { active: true },
            select: { id: true, name: true },
          },
        },
      }),
    ]);

  return {
    registrations,
    total,
    federationTypes,
    federationTypesWithRelations,
  };
}

const TEXT_FILTER_KEYS = [
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

function buildWhere(params: Awaited<SearchParams>) {
  const conditions: Record<string, unknown>[] = [];
  const hasAdvancedTextFilter = TEXT_FILTER_KEYS.some((k) => params[k]);

  if (params.search && !hasAdvancedTextFilter) {
    const search = params.search;
    conditions.push({
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ],
    });
  }

  for (const key of TEXT_FILTER_KEYS) {
    if (params[key]) {
      conditions.push({ [key]: { contains: params[key] } });
    }
  }

  if (params.federation) {
    conditions.push({ federationTypeId: params.federation });
  }

  if (params.status) {
    conditions.push({ paymentStatus: params.status });
  }

  if (params.federated === "true" || params.federated === "false") {
    conditions.push({ isFederated: params.federated === "true" });
  }

  if (params.active === "true" || params.active === "false") {
    conditions.push({ active: params.active === "true" });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
