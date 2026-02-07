"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutAction } from "./logout-action";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </Button>
    </form>
  );
}
