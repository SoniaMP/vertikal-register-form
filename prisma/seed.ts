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
      active: true,
    },
  });

  const federativaCompeticion = await prisma.federationType.create({
    data: {
      name: "Federativa Competicion",
      description:
        "Licencia federativa de competicion para la temporada 2025/2026",
      active: true,
    },
  });

  // Create subtypes (no price — price lives on CategoryPrice)
  const basicaEstandar = await prisma.federationSubtype.create({
    data: {
      name: "Estándar",
      description: "Modalidad estándar de licencia básica",
      active: true,
      federationTypeId: federativaBasica.id,
    },
  });

  const basicaPremium = await prisma.federationSubtype.create({
    data: {
      name: "Premium",
      description: "Modalidad premium de licencia básica con extras",
      active: true,
      federationTypeId: federativaBasica.id,
    },
  });

  const competicionEstandar = await prisma.federationSubtype.create({
    data: {
      name: "Estándar",
      description: "Modalidad estándar de competición",
      active: true,
      federationTypeId: federativaCompeticion.id,
    },
  });

  const competicionElite = await prisma.federationSubtype.create({
    data: {
      name: "Elite",
      description: "Modalidad élite de competición",
      active: true,
      federationTypeId: federativaCompeticion.id,
    },
  });

  // Create categories for Basica
  const basicaInfantil = await prisma.category.create({
    data: {
      name: "Infantil",
      description: "Categoría para menores de 16 años",
      active: true,
      federationTypeId: federativaBasica.id,
    },
  });

  const basicaAdulto = await prisma.category.create({
    data: {
      name: "Adulto",
      description: "Categoría para mayores de 16 años",
      active: true,
      federationTypeId: federativaBasica.id,
    },
  });

  // Create categories for Competicion
  const competicionInfantil = await prisma.category.create({
    data: {
      name: "Infantil",
      description: "Categoría infantil de competición",
      active: true,
      federationTypeId: federativaCompeticion.id,
    },
  });

  const competicionAdulto = await prisma.category.create({
    data: {
      name: "Adulto",
      description: "Categoría adulto de competición",
      active: true,
      federationTypeId: federativaCompeticion.id,
    },
  });

  // Category prices: Basica
  await prisma.categoryPrice.createMany({
    data: [
      { categoryId: basicaInfantil.id, subtypeId: basicaEstandar.id, price: 3000 },
      { categoryId: basicaInfantil.id, subtypeId: basicaPremium.id, price: 4500 },
      { categoryId: basicaAdulto.id, subtypeId: basicaEstandar.id, price: 4500 },
      { categoryId: basicaAdulto.id, subtypeId: basicaPremium.id, price: 6000 },
    ],
  });

  // Category prices: Competicion
  await prisma.categoryPrice.createMany({
    data: [
      { categoryId: competicionInfantil.id, subtypeId: competicionEstandar.id, price: 5000 },
      { categoryId: competicionInfantil.id, subtypeId: competicionElite.id, price: 8000 },
      { categoryId: competicionAdulto.id, subtypeId: competicionEstandar.id, price: 7500 },
      { categoryId: competicionAdulto.id, subtypeId: competicionElite.id, price: 12000 },
    ],
  });

  // Create a supplement group for Basica
  const basicaSeguroGrupo = await prisma.supplementGroup.create({
    data: {
      name: "Pack Seguros Básicos",
      price: 2000, // 20.00 EUR for any combo
      federationTypeId: federativaBasica.id,
    },
  });

  // Create a supplement group for Competicion
  const competicionSeguroGrupo = await prisma.supplementGroup.create({
    data: {
      name: "Pack Seguros Competición",
      price: 3000, // 30.00 EUR for any combo
      federationTypeId: federativaCompeticion.id,
    },
  });

  // Create supplements
  await prisma.supplement.createMany({
    data: [
      // Basica: grouped supplements
      {
        name: "Seguro accidentes premium",
        description: "Cobertura ampliada de accidentes deportivos",
        price: null,
        active: true,
        federationTypeId: federativaBasica.id,
        supplementGroupId: basicaSeguroGrupo.id,
      },
      {
        name: "Seguro responsabilidad civil",
        description: "Seguro de responsabilidad civil para actividades",
        price: null,
        active: true,
        federationTypeId: federativaBasica.id,
        supplementGroupId: basicaSeguroGrupo.id,
      },
      // Competicion: grouped supplements
      {
        name: "Seguro accidentes premium",
        description: "Cobertura ampliada de accidentes deportivos",
        price: null,
        active: true,
        federationTypeId: federativaCompeticion.id,
        supplementGroupId: competicionSeguroGrupo.id,
      },
      {
        name: "Seguro responsabilidad civil",
        description: "Seguro de responsabilidad civil para actividades",
        price: null,
        active: true,
        federationTypeId: federativaCompeticion.id,
        supplementGroupId: competicionSeguroGrupo.id,
      },
      // Competicion: individual supplement
      {
        name: "Asistencia en viaje",
        description: "Cobertura de asistencia durante desplazamientos",
        price: 2500, // 25.00 EUR
        active: true,
        federationTypeId: federativaCompeticion.id,
        supplementGroupId: null,
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

  // Default membership fee: 20.00 EUR (in cents)
  await prisma.appSetting.upsert({
    where: { key: "MEMBERSHIP_FEE" },
    update: {},
    create: { key: "MEMBERSHIP_FEE", value: "2000" },
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
