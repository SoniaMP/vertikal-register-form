import { NextRequest, NextResponse } from "next/server";
import { fetchAllCourseParticipants } from "@/lib/course-participant-queries";
import { buildCsv } from "@/lib/csv-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const participants = await fetchAllCourseParticipants(id);

  const header = [
    "Nombre",
    "Apellidos",
    "Email",
    "Teléfono",
    "DNI",
    "Fecha nacimiento",
    "Categoría de pago",
    "Fecha inscripción",
  ];

  const rows = participants.map((p) => [
    p.firstName,
    p.lastName,
    p.email,
    p.phone ?? "",
    p.dni ?? "",
    p.dateOfBirth ?? "",
    p.coursePrice.name,
    p.createdAt.toISOString().slice(0, 10),
  ]);

  const csv = buildCsv(header, rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="participantes-curso.csv"',
    },
  });
}
