"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaultValue?: string;
};

export function CourseImageField({ defaultValue = "" }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="image">URL de imagen</Label>
      <Input
        id="image"
        name="image"
        type="url"
        placeholder="https://ejemplo.com/imagen.jpg"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setHasError(false);
        }}
      />
      {url && !hasError && (
        <img
          src={url}
          alt="Preview"
          className="h-32 w-full rounded-md border object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
