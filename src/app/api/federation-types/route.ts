import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const federationTypes = await prisma.federationType.findMany({
    where: { active: true },
    include: {
      subtypes: {
        where: { active: true },
        orderBy: { name: "asc" },
      },
      categories: {
        where: { active: true },
        include: { prices: true },
        orderBy: { name: "asc" },
      },
      supplements: {
        where: { active: true },
        include: { supplementGroup: true },
        orderBy: { name: "asc" },
      },
      supplementGroups: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(federationTypes);
}
