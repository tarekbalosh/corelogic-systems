import React from "react";
import { redirect } from "next/navigation";
import { KeyRound, ShieldAlert } from "lucide-react";
import { AdminPasswordInput } from "@/components/admin/admin-password-input";
import { loginAdminAction } from "@/lib/admin/actions";
import { isAdminAuthenticated } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const authed = await isAdminAuthenticated();
  if (authed) {
    redirect("/admin/leads");
  }

  const params = await searchParams;
  const errorKey = params.error;

  const errorMessage =
    errorKey === "invalid_token"
      ? "Invalid admin token. Please check ADMIN_TOKEN and try again."
      : errorKey === "rate_limited"
        ? "Too many login attempts from this IP. Please wait 15 minutes."
        : errorKey === "not_configured"
          ? "ADMIN_TOKEN is not configured on the server (must be at least 12 characters)."
          : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-28 pb-20 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Sign In
          </h1>
          <p className="text-sm text-slate-500">
            Enter your <code className="font-mono text-xs">ADMIN_TOKEN</code> to
            manage AI agent leads, bookings, and consultation hours.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form action={loginAdminAction} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-token-input"
              className="block text-xs font-semibold text-slate-700"
            >
              Admin Token
            </label>
            <AdminPasswordInput />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
