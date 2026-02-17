import { TableCell, TableRow } from "@/components/ui/table";
import type { ParticipantRow } from "./participants-table";

type Props = { participant: ParticipantRow };

export function ParticipantRowDesktop({ participant: p }: Props) {
  return (
    <TableRow>
      <TableCell className="font-medium">{p.firstName}</TableCell>
      <TableCell>{p.lastName}</TableCell>
      <TableCell className="text-muted-foreground">{p.email}</TableCell>
      <TableCell className="text-muted-foreground">{p.phone ?? "—"}</TableCell>
      <TableCell>{p.coursePrice.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(p.createdAt)}
      </TableCell>
    </TableRow>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
