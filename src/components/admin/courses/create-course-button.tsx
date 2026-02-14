"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseFormDialog } from "./course-form-dialog";
import type { CourseTypeOption } from "./types";

type Props = {
  courseTypes: CourseTypeOption[];
};

export function CreateCourseButton({ courseTypes }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-1.5">
        <Plus className="h-4 w-4" />
        Nuevo curso
      </Button>
      <CourseFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        courseTypes={courseTypes}
      />
    </>
  );
}
