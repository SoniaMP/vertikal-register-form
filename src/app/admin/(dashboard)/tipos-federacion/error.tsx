"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error("Server Component Error:", error.message, error.digest);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <h2 className="text-xl font-semibold">Algo salió mal</h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      {error.digest && (
        <p className="text-muted-foreground text-xs font-mono">
          Digest: {error.digest}
        </p>
      )}
      <Button onClick={reset} variant="outline">
        Reintentar
      </Button>
    </div>
  );
}
