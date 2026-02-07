import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const federationTypes = await prisma.federationType.findMany({
    where: { active: true },
    include: {
      supplements: {
        where: { active: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { price: "asc" },
  });

  return NextResponse.json(federationTypes);
}
