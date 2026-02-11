"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toggleMembershipFederated } from "@/app/admin/(dashboard)/registros/membership-actions";

type Props = {
  membershipId: string;
  isFederated: boolean;
};

export function FederatedToggle({ membershipId, isFederated }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSelect(value: boolean) {
    if (value === isFederated) return;
    startTransition(async () => {
      await toggleMembershipFederated(membershipId, value);
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" disabled={isPending} className="cursor-pointer">
          <Badge
            className={cn(
              "text-white transition-opacity",
              isFederated
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700",
              isPending && "opacity-50",
            )}
          >
            {isFederated ? "Si" : "No"}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1" align="start">
        <div className="flex flex-col gap-0.5">
          <Button
            variant={isFederated ? "secondary" : "ghost"}
            size="sm"
            className="justify-start text-xs"
            onClick={() => handleSelect(true)}
          >
            <Badge className="bg-green-600 text-white mr-1.5">Si</Badge>
            Federado
          </Button>
          <Button
            variant={!isFederated ? "secondary" : "ghost"}
            size="sm"
            className="justify-start text-xs"
            onClick={() => handleSelect(false)}
          >
            <Badge className="bg-red-600 text-white mr-1.5">No</Badge>
            No federado
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
