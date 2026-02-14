import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/helpers/price-calculator";
import type { fetchPublicCourseList } from "@/lib/course-queries";

type PublicCourse = Awaited<ReturnType<typeof fetchPublicCourseList>>[number];

function formatCourseDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function CourseCard({ course }: { course: PublicCourse }) {
  const spotsUsed = course._count.registrations;
  const spotsLeft = Math.max(0, course.maxCapacity - spotsUsed);
  const isFull = spotsLeft === 0;
  const lowestPrice = course.prices[0]?.amountCents;

  return (
    <Link href={`/cursos/${course.slug}`} className="block">
      <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
        {course.image && (
          <div className="relative h-40 w-full">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            {isFull && (
              <Badge variant="destructive" className="absolute right-2 top-2">
                Agotado
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="pb-2">
          <Badge variant="secondary" className="w-fit">
            {course.courseType.name}
          </Badge>
          <CardTitle className="line-clamp-2 text-lg">
            {course.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 pb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4 shrink-0" />
            <span>{formatCourseDate(course.courseDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{course.address}</span>
          </div>

          <div className="mt-2 flex items-center justify-between border-t pt-3">
            {lowestPrice !== undefined ? (
              <span className="text-base font-semibold text-foreground">
                Desde {formatPrice(lowestPrice)}
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>
                {isFull
                  ? "Sin plazas"
                  : `${spotsLeft} plaza${spotsLeft !== 1 ? "s" : ""}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
