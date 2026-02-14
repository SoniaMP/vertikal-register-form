"use client";

import { useState } from "react";
import Image from "next/image";
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
        <div className="relative h-32 w-full overflow-hidden rounded-md border">
          <Image
            src={url}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
            onError={() => setHasError(true)}
          />
        </div>
      )}
    </div>
  );
}
