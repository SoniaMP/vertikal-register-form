import { fetchPublicCourseList } from "@/lib/course-queries";
import { CourseCard } from "@/components/courses/course-card";

export default async function CursosPage() {
  const courses = await fetchPublicCourseList();

  if (courses.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No hay cursos disponibles en este momento.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
