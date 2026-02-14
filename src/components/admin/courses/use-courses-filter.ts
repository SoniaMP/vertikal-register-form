"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useCoursesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/admin/cursos?${params.toString()}`);
    },
    [router, searchParams],
  );

  const updateParamDebounced = useCallback(
    (key: string, value: string, delay = 300) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => updateParam(key, value), delay);
    },
    [updateParam],
  );

  const clearAll = useCallback(() => {
    router.push("/admin/cursos");
  }, [router]);

  return { updateParam, updateParamDebounced, clearAll, searchParams };
}
