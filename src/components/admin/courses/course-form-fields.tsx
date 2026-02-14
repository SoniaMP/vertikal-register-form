"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseTypeFormDialog } from "./course-type-form-dialog";
import type { CourseRow, CourseTypeOption } from "./types";

type Props = {
  course?: CourseRow;
  courseTypes: CourseTypeOption[];
};

function toDateInputValue(date: Date): string {
  return new Date(date).toISOString().slice(0, 16);
}

export function CourseFormFields({ course, courseTypes }: Props) {
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          defaultValue={course?.title ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="mi-curso-ejemplo"
          defaultValue={course?.slug ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          Solo letras minúsculas, números y guiones. Se usa en la URL pública.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="courseTypeId">Categoría</Label>
        <div className="flex gap-2">
          <Select
            name="courseTypeId"
            defaultValue={course?.courseType.id ?? ""}
          >
            <SelectTrigger id="courseTypeId">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {courseTypes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsTypeDialogOpen(true)}
            aria-label="Nueva categoría"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <CourseTypeFormDialog
          open={isTypeDialogOpen}
          onOpenChange={setIsTypeDialogOpen}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="courseDate">Fecha</Label>
        <Input
          id="courseDate"
          name="courseDate"
          type="datetime-local"
          defaultValue={
            course?.courseDate ? toDateInputValue(course.courseDate) : ""
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          defaultValue={course?.address ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxCapacity">Capacidad máxima</Label>
        <Input
          id="maxCapacity"
          name="maxCapacity"
          type="number"
          min={1}
          defaultValue={course?.maxCapacity ?? ""}
        />
      </div>
    </>
  );
}
