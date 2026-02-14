import { getActiveSeason } from "@/lib/settings";
import {
  fetchMembershipList,
  fetchAllSeasons,
  fetchFilterOptions,
  fetchSeasonMetrics,
} from "@/lib/admin-queries";
import { parseFilterParams } from "@/lib/filter-params";
import { fetchLicenseCatalog } from "@/lib/license-catalog";
import { MembershipsToolbar } from "@/components/admin/memberships-toolbar";
import { AdvancedFiltersPanel } from "@/components/admin/advanced-filters-panel";
import { ActiveFilterChips } from "@/components/admin/active-filter-chips";
import { MembershipsTable } from "@/components/admin/memberships-table";
import { Pagination } from "@/components/admin/pagination";
import { CreateMemberButton } from "@/components/admin/create-member-button";
import { SeasonSelector } from "@/components/admin/season-selector";
import { SeasonMetricsCards } from "@/components/admin/season-metrics";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [activeSeason, allSeasons] = await Promise.all([
    getActiveSeason(),
    fetchAllSeasons(),
  ]);

  const filters = parseFilterParams(params, activeSeason.id);
  const appliedFilters = applyViewOverrides(filters);

  const [catalog, filterOptions, metrics, { memberships, total, pageSize }] =
    await Promise.all([
      fetchLicenseCatalog(),
      fetchFilterOptions(),
      fetchSeasonMetrics(filters.seasonId),
      fetchMembershipList(appliedFilters),
    ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        allSeasons={allSeasons}
        currentSeasonId={filters.seasonId}
        catalog={catalog}
      />
      <SeasonMetricsCards metrics={metrics} />
      <MembershipsToolbar />
      <AdvancedFiltersPanel filterOptions={filterOptions} />
      <ActiveFilterChips filterOptions={filterOptions} />
      <MembershipsTable
        memberships={memberships}
        sortBy={filters.sortBy}
        sortDir={filters.sortDir}
      />
      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
      />
    </div>
  );
}

// ── Helpers ──

function applyViewOverrides(
  filters: import("@/types/membership-filters").MembershipFilterState,
) {
  if (filters.view === "federados") {
    return { ...filters, federated: "true" };
  }
  if (filters.view === "no_federados") {
    return { ...filters, federated: "false" };
  }
  return filters;
}

type PageHeaderProps = {
  allSeasons: { id: string; name: string; isActive: boolean }[];
  currentSeasonId: string;
  catalog: Awaited<ReturnType<typeof fetchLicenseCatalog>>;
};

function PageHeader({ allSeasons, currentSeasonId, catalog }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Miembros</h1>
      <div className="flex items-center gap-3">
        <SeasonSelector seasons={allSeasons} currentSeasonId={currentSeasonId} />
        <CreateMemberButton licenseCatalog={catalog} />
      </div>
    </div>
  );
}
