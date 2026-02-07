import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const userName = session.user.name ?? "Admin";

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="hidden md:block">
        <AdminSidebar userName={userName} />
      </div>
      <MobileSidebar userName={userName} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
