import { notFound } from "next/navigation";
import { CalendarDays, Users } from "lucide-react";
import { fetchCourseBySlug } from "@/lib/course-queries";
import { CourseRegistrationForm } from "@/components/courses/course-registration-form";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

function formatCourseDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);

  if (!course) notFound();

  const spotsUsed = course._count.registrations;
  const spotsLeft = Math.max(0, course.maxCapacity - spotsUsed);
  const isFull = spotsLeft === 0;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold sm:text-2xl">{course.title}</h2>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {formatCourseDate(course.courseDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            {isFull
              ? "Sin plazas"
              : `${spotsLeft} plaza${spotsLeft !== 1 ? "s" : ""} disponible${spotsLeft !== 1 ? "s" : ""}`}
          </span>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Inscripción</h3>
        <CourseRegistrationForm
          courseCatalogId={course.id}
          prices={course.prices}
          isFull={isFull}
        />
      </section>
    </div>
  );
}
