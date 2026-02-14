"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleCourseActive } from "@/app/admin/(dashboard)/cursos/actions";

type Props = {
  courseId: string;
  isActive: boolean;
};

export function CourseActiveToggle({ courseId, isActive }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      await toggleCourseActive(courseId, checked);
    });
  }

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={isPending}
      aria-label={isActive ? "Desactivar curso" : "Activar curso"}
    />
  );
}
