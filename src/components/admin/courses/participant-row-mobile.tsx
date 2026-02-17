import type { ParticipantRow } from "./participants-table";

type Props = { participant: ParticipantRow };

export function ParticipantRowMobile({ participant: p }: Props) {
  return (
    <div className="rounded-lg border p-4 transition-colors">
      <div className="min-w-0">
        <p className="font-medium truncate">
          {p.firstName} {p.lastName}
        </p>
        <p className="text-sm text-muted-foreground truncate">{p.email}</p>
      </div>
      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{p.coursePrice.name}</span>
        {p.phone && <span>{p.phone}</span>}
        <span className="ml-auto">{formatDate(p.createdAt)}</span>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
