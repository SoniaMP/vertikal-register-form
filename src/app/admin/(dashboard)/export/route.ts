import { NextRequest, NextResponse } from "next/server";
import { getActiveSeason } from "@/lib/settings";
import { parseFilterParams } from "@/lib/filter-params";
import { buildMembershipWhere } from "@/lib/admin-queries";
import { prisma } from "@/lib/prisma";

const MAX_ROWS = 5000;
const BOM = "\uFEFF";

export async function GET(request: NextRequest) {
  const activeSeason = await getActiveSeason();
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = parseFilterParams(params, activeSeason.id);
  const where = buildMembershipWhere(filters);

  const memberships = await prisma.membership.findMany({
    where,
    include: {
      member: true,
      type: { select: { name: true } },
      subtype: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
  });

  const header = [
    "Nombre",
    "Apellidos",
    "DNI",
    "Email",
    "Teléfono",
    "Provincia",
    "Ciudad",
    "Tipo licencia",
    "Subtipo",
    "Categoría",
    "Federado",
    "Total",
    "Estado",
    "Estado pago",
    "Fecha",
  ];

  const rows = memberships.map((m) => [
    m.member.firstName,
    m.member.lastName,
    m.member.dni,
    m.member.email,
    m.member.phone,
    m.member.province,
    m.member.city,
    m.type?.name ?? "",
    m.subtype?.name ?? "",
    m.category?.name ?? "",
    m.isFederated ? "Sí" : "No",
    (m.totalAmount / 100).toFixed(2),
    m.status,
    m.paymentStatus,
    m.createdAt.toISOString().slice(0, 10),
  ]);

  const csv =
    BOM +
    [header, ...rows].map((row) => row.map(escapeCsv).join(";")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="miembros.csv"',
    },
  });
}

function escapeCsv(value: string): string {
  if (value.includes(";") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
