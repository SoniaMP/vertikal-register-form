"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "./logout-button";

type Props = {
  userName: string;
};

export function MobileSidebar({ userName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 border-b p-3 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-lg font-bold">Vertikal Club</span>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <SheetHeader className="p-4">
            <SheetTitle>Vertikal Club</SheetTitle>
            <p className="text-xs text-muted-foreground">Administracion</p>
          </SheetHeader>
          <Separator />
          <nav className="flex-1 p-2 space-y-1">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <ClipboardList className="h-4 w-4" />
              Registros
            </Link>
          </nav>
          <Separator />
          <div className="p-3">
            <p className="text-xs text-muted-foreground mb-2 truncate">
              {userName}
            </p>
            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
