"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SeasonOption } from "@/types/membership-filters";

type Props = {
  seasons: SeasonOption[];
  currentSeasonId: string;
};

export function SeasonSelector({ seasons, currentSeasonId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(seasonId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("seasonId", seasonId);
    params.delete("page");
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <Select value={currentSeasonId} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Temporada" />
      </SelectTrigger>
      <SelectContent>
        {seasons.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
            {s.isActive ? " (Actual)" : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
