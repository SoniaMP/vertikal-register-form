import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 15;

export type CourseFilters = {
  search?: string;
  courseTypeId?: string;
  isActive?: string; // "true" | "false" | undefined (all)
  page: number;
};

// ── Paginated admin listing ──

export async function fetchCourseList(filters: CourseFilters) {
  const where = buildCourseWhere(filters);

  const [courses, total] = await Promise.all([
    prisma.courseCatalog.findMany({
      where,
      include: {
        courseType: { select: { id: true, name: true } },
        prices: {
          where: { isActive: true },
          select: { id: true, name: true, amountCents: true },
          orderBy: { name: "asc" },
        },
        _count: {
          select: {
            registrations: { where: { paymentStatus: "COMPLETED" } },
          },
        },
      },
      orderBy: { courseDate: "desc" },
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.courseCatalog.count({ where }),
  ]);

  return { courses, total, pageSize: PAGE_SIZE };
}

// ── Single course with prices + registration count ──

export async function fetchCourseDetail(id: string) {
  return prisma.courseCatalog.findUnique({
    where: { id },
    include: {
      courseType: { select: { id: true, name: true } },
      prices: { orderBy: { name: "asc" } },
      _count: {
        select: {
          registrations: { where: { paymentStatus: "COMPLETED" } },
        },
      },
    },
  });
}

// ── All course types ──

export async function fetchCourseTypes() {
  return prisma.courseType.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

// ── Available spots check ──

export async function getCourseAvailableSpots(
  courseCatalogId: string,
): Promise<number> {
  const course = await prisma.courseCatalog.findUnique({
    where: { id: courseCatalogId },
    select: {
      maxCapacity: true,
      _count: {
        select: {
          registrations: { where: { paymentStatus: "COMPLETED" } },
        },
      },
    },
  });

  if (!course) return 0;
  return Math.max(0, course.maxCapacity - course._count.registrations);
}

// ── Internal helpers ──

function buildCourseWhere(filters: CourseFilters) {
  const conditions: Record<string, unknown>[] = [
    { deletedAt: null },
  ];

  if (filters.search) {
    conditions.push({
      title: { contains: filters.search },
    });
  }

  if (filters.courseTypeId) {
    conditions.push({ courseTypeId: filters.courseTypeId });
  }

  if (filters.isActive === "true" || filters.isActive === "false") {
    conditions.push({ isActive: filters.isActive === "true" });
  }

  return { AND: conditions };
}
