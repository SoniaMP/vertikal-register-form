"use client";

import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

type Props = {
  defaultValue?: string;
  onChange: (html: string) => void;
};

export function CourseDescriptionField({ defaultValue, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Descripción</Label>
      <RichTextEditor
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder="Escribe la descripción del curso..."
      />
    </div>
  );
}
