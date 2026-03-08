import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "data/uploads/branding");

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!filename.match(/^[a-f0-9-]+\.(png|jpe?g|svg)$/)) {
    return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
  }

  const filePath = join(UPLOAD_DIR, filename);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 },
    );
  }

  const ext = filename.split(".").pop()!;
  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
