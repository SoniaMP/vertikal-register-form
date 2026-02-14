"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useFilterNavigation() {
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
      router.push(`/admin?${params.toString()}`);
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
    const params = new URLSearchParams();
    const seasonId = searchParams.get("seasonId");
    if (seasonId) params.set("seasonId", seasonId);
    router.push(`/admin?${params.toString()}`);
  }, [router, searchParams]);

  return { updateParam, updateParamDebounced, clearAll, searchParams };
}
