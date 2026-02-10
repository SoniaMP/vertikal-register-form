import { prisma } from "@/lib/prisma";
import { RegistrationFilters } from "@/components/admin/registration-filters";
import { RegistrationsTable } from "@/components/admin/registrations-table";
import { Pagination } from "@/components/admin/pagination";

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  search?: string;
  federation?: string;
  status?: string;
  page?: string;
}>;

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const { registrations, total, federationTypes } = await fetchData(
    params,
    page,
  );
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Miembros</h1>
      <RegistrationFilters federationTypes={federationTypes} />
      <RegistrationsTable registrations={registrations} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}

async function fetchData(params: Awaited<SearchParams>, page: number) {
  const where = buildWhere(params);

  const [registrations, total, federationTypes] = await Promise.all([
    prisma.registration.findMany({
      where,
      include: { federationType: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.registration.count({ where }),
    prisma.federationType.findMany({
      where: { active: true },
      select: { id: true, name: true },
    }),
  ]);

  return { registrations, total, federationTypes };
}

function buildWhere(params: Awaited<SearchParams>) {
  const conditions: Record<string, unknown>[] = [];

  if (params.search) {
    const search = params.search;
    conditions.push({
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ],
    });
  }

  if (params.federation) {
    conditions.push({ federationTypeId: params.federation });
  }

  if (params.status) {
    conditions.push({ paymentStatus: params.status });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
