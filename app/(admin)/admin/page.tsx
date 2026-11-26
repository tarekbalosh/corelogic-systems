import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const authed = await isAdminAuthenticated();
  if (authed) {
    redirect("/admin/leads");
  }
  redirect("/admin/login");
}
