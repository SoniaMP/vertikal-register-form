import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchX } from "lucide-react";
import { CourseRowDesktop } from "./course-row-desktop";
import { CourseRowMobile } from "./course-row-mobile";
import type { CourseRow, CourseTypeOption } from "./types";

type Props = {
  courses: CourseRow[];
  courseTypes: CourseTypeOption[];
};

export function CoursesTable({ courses, courseTypes }: Props) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <SearchX className="h-10 w-10" />
        <p className="text-sm">No se encontraron cursos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {courses.map((c) => (
          <CourseRowMobile
            key={c.id}
            course={c}
            courseTypes={courseTypes}
          />
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Plazas</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <CourseRowDesktop
                key={c.id}
                course={c}
                courseTypes={courseTypes}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
