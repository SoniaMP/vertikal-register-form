import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "node:crypto";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return hash("sha256", password);
}

async function main() {
  // Create federation types
  const federativaBasica = await prisma.federationType.create({
    data: {
      name: "Federativa Basica",
      description: "Licencia federativa basica para la temporada 2025/2026",
      price: 4500, // 45.00 EUR
      active: true,
    },
  });

  const federativaCompeticion = await prisma.federationType.create({
    data: {
      name: "Federativa Competicion",
      description:
        "Licencia federativa de competicion para la temporada 2025/2026",
      price: 7500, // 75.00 EUR
      active: true,
    },
  });

  // Create supplements linked to federation types
  await prisma.supplement.createMany({
    data: [
      {
        name: "Seguro accidentes premium",
        description: "Cobertura ampliada de accidentes deportivos",
        price: 1500, // 15.00 EUR
        active: true,
        federationTypeId: federativaBasica.id,
      },
      {
        name: "Seguro responsabilidad civil",
        description: "Seguro de responsabilidad civil para actividades",
        price: 1000, // 10.00 EUR
        active: true,
        federationTypeId: federativaBasica.id,
      },
      {
        name: "Seguro accidentes premium",
        description: "Cobertura ampliada de accidentes deportivos",
        price: 2000, // 20.00 EUR
        active: true,
        federationTypeId: federativaCompeticion.id,
      },
      {
        name: "Seguro responsabilidad civil",
        description: "Seguro de responsabilidad civil para actividades",
        price: 1500, // 15.00 EUR
        active: true,
        federationTypeId: federativaCompeticion.id,
      },
      {
        name: "Asistencia en viaje",
        description: "Cobertura de asistencia durante desplazamientos",
        price: 2500, // 25.00 EUR
        active: true,
        federationTypeId: federativaCompeticion.id,
      },
    ],
  });

  // Create admin user (password: admin123 — change in production!)
  await prisma.adminUser.create({
    data: {
      email: "admin@vertikal.club",
      passwordHash: hashPassword("admin123"),
      name: "Admin",
    },
  });

  console.log("Seed completed successfully");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
