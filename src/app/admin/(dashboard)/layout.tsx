import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar userName={session.user.name ?? "Admin"} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
