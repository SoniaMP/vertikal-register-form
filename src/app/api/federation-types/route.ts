import { NextResponse } from "next/server";
import { fetchLicenseCatalog } from "@/lib/license-catalog";

export async function GET() {
  const catalog = await fetchLicenseCatalog();
  return NextResponse.json(catalog);
}
