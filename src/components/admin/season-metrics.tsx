import type { SeasonMetrics } from "@/lib/admin-queries";

type Props = {
  metrics: SeasonMetrics;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function SeasonMetricsCards({ metrics }: Props) {
  const activeCount = metrics.byStatus["ACTIVE"] ?? 0;
  const federatedPct =
    metrics.totalMembers > 0
      ? Math.round((metrics.federatedCount / metrics.totalMembers) * 100)
      : 0;

  return (
    <div className="flex items-center divide-x text-sm">
      <Stat label="Total" value={String(metrics.totalMembers)} />
      <Stat label="Ingresos" value={formatCurrency(metrics.totalRevenue)} />
      <Stat label="Activos" value={String(activeCount)} />
      <Stat
        label="Federados"
        value={`${metrics.federatedCount} (${federatedPct}%)`}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 first:pl-0">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
