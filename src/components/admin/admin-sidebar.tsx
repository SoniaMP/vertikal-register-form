import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "./logout-button";
import { ADMIN_NAV_ITEMS } from "./nav-items";

type Props = {
  userName: string;
};

export function AdminSidebar({ userName }: Props) {
  return (
    <aside className="flex h-full w-56 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="p-4">
        <Link href="/admin">
          <Image
            src="/logo-horizontal-light.png"
            alt="Club Vertikal"
            width={160}
            height={40}
            priority
          />
        </Link>
        <p className="text-xs text-sidebar-foreground/70 mt-1">
          Administración
        </p>
      </div>
      <Separator />
      <nav className="flex-1 p-2 space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Separator />
      <div className="p-3">
        <p className="text-xs text-sidebar-foreground/70 mb-2 truncate">
          {userName}
        </p>
        <LogoutButton />
      </div>
    </aside>
  );
}
