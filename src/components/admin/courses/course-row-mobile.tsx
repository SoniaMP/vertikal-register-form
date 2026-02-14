import { Badge } from "@/components/ui/badge";
import { CourseActiveToggle } from "./course-active-toggle";
import { CourseActionsMenu } from "./course-actions-menu";
import { formatCourseDate } from "./helpers";
import type { CourseRow, CourseTypeOption } from "./types";

type Props = {
  course: CourseRow;
  courseTypes: CourseTypeOption[];
};

export function CourseRowMobile({ course, courseTypes }: Props) {
  const spots = course.maxCapacity - course._count.registrations;

  return (
    <div className="rounded-lg border p-4 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium truncate">{course.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {formatCourseDate(course.courseDate)} &middot; {course.address}
          </p>
        </div>
        <CourseActiveToggle
          courseId={course.id}
          isActive={course.isActive}
        />
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
        <Badge variant="outline">{course.courseType.name}</Badge>
        <span className="tabular-nums">
          {course._count.registrations} / {course.maxCapacity}
        </span>
        {spots <= 0 && (
          <Badge variant="destructive">Lleno</Badge>
        )}
      </div>
      <div className="mt-2 flex justify-end border-t pt-2">
        <CourseActionsMenu course={course} courseTypes={courseTypes} />
      </div>
    </div>
  );
}
