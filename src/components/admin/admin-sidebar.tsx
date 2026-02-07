import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "./logout-button";

type Props = {
  userName: string;
};

export function AdminSidebar({ userName }: Props) {
  return (
    <aside className="flex h-full w-56 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="p-4">
        <Link href="/admin" className="text-lg font-bold">
          Vertikal Club
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Administración</p>
      </div>
      <Separator />
      <nav className="flex-1 p-2 space-y-1">
        <Link
          href="/admin"
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
    </aside>
  );
}
