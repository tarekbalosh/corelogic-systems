"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CalendarClock,
  Loader2,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Power,
  ReceiptText,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  ADMIN_NAV_ITEMS,
  resolveAdminNavItem,
  type AdminNavIconName,
} from "@/config/admin-nav";
import {
  logoutAdminAction,
  toggleWidgetPauseAdminAction,
} from "@/lib/admin/actions";
import { cn } from "@/lib/utils";
import {
  Drawer,
  StatusBadge,
  ToastProvider,
  useToast,
} from "@/components/admin/ui";

const NAV_ICON_MAP: Record<
  AdminNavIconName,
  React.ComponentType<{ className?: string }>
> = {
  users: Users,
  "calendar-clock": CalendarClock,
  sliders: SlidersHorizontal,
  "receipt-text": ReceiptText,
  "building-2": Building2,
};

export interface AdminWidgetState {
  envEnabled: boolean;
  dbPaused: boolean;
  effectiveEnabled: boolean;
}

interface AdminFrameProps {
  widgetState: AdminWidgetState;
  children: React.ReactNode;
}

function AdminFrameInner({ widgetState, children }: AdminFrameProps) {
  const pathname = usePathname() || "/admin/leads";
  const router = useRouter();
  const toast = useToast();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [widgetPending, startWidgetTransition] = useTransition();

  const activeNav = resolveAdminNavItem(pathname);
  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) => item.status !== "hidden"
  );

  const handleToggleWidget = () => {
    const nextPaused = !widgetState.dbPaused;
    startWidgetTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("paused", nextPaused ? "true" : "false");
        await toggleWidgetPauseAdminAction(fd);
        router.refresh();
        toast.success(
          nextPaused ? "Chat widget paused" : "Chat widget resumed",
          nextPaused
            ? "The AI assistant is now paused for public visitors."
            : "The AI assistant is now live on the website."
        );
      } catch {
        toast.error(
          "Could not update widget status",
          "Please try again or verify database connectivity."
        );
      }
    });
  };

  const renderNavLinks = (isCollapsed: boolean, onNavigate?: () => void) => (
    <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-4">
      {!isCollapsed && (
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
      )}
      {visibleItems.map((item) => {
        const Icon = NAV_ICON_MAP[item.icon];
        const isActive =
          item.status === "active" &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));
        const isSoon = item.status === "soon";

        if (isSoon) {
          return (
            <div
              key={item.id}
              aria-disabled="true"
              title={isCollapsed ? `${item.label} (${item.badge ?? "Soon"})` : undefined}
              className={cn(
                "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 select-none cursor-not-allowed",
                isCollapsed ? "justify-center" : "justify-between gap-2.5"
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-slate-300" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </span>
              {!isCollapsed && item.badge && (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 ring-1 ring-inset ring-slate-200">
                  {item.badge}
                </span>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              "group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              isCollapsed ? "justify-center" : "gap-3",
              isActive
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-700"
              )}
            />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const widgetStatusKey = !widgetState.envEnabled
    ? "OFF"
    : widgetState.dbPaused
      ? "PAUSED"
      : "LIVE";
  const widgetStatusLabel = !widgetState.envEnabled
    ? "Widget: Off"
    : widgetState.dbPaused
      ? "Widget: Paused"
      : "Widget: Live";

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Desktop Fixed Sidebar */}
      <aside
        aria-label="Sidebar"
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col border-r border-slate-200/90 bg-white transition-[width] duration-200",
          collapsed ? "lg:w-[76px]" : "lg:w-64"
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-200/80 px-4",
            collapsed ? "justify-center" : "justify-between gap-2"
          )}
        >
          <Link
            href="/admin/leads"
            className={cn(
              "flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              collapsed && "justify-center"
            )}
          >
            <Image
              src="/brand/corelogic-symbol-color.svg"
              alt="CoreLogic Systems"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="truncate font-heading text-sm font-bold tracking-tight text-slate-900">
                  CoreLogic
                </p>
                <p className="truncate text-[11px] font-semibold text-indigo-600">
                  Admin Console
                </p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              aria-expanded={!collapsed}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {renderNavLinks(collapsed)}

        {/* Sidebar Footer / Expand toggle when collapsed */}
        <div className="border-t border-slate-200/80 p-3">
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              aria-expanded={!collapsed}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          ) : (
            <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] text-slate-500">
              <p className="font-semibold text-slate-700">Timezone: MYT</p>
              <p className="mt-0.5 text-slate-400">Asia/Kuala_Lumpur (UTC+8)</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title="CoreLogic Admin"
        subtitle="Operations & AI Agent Console"
        side="left"
        widthClass="w-[280px] max-w-[85vw]"
      >
        <div className="-mx-5 -my-4 flex h-full flex-col">
          {renderNavLinks(false, () => setMobileNavOpen(false))}
          <div className="mt-auto border-t border-slate-200 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Timezone: MYT</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Asia/Kuala_Lumpur (UTC+8)
            </p>
          </div>
        </div>
      </Drawer>

      {/* Main Column */}
      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-1 flex-col transition-[padding-left] duration-200",
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        )}
      >
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            {/* Left: Mobile menu button + Page title */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileNavOpen}
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <h1 className="truncate font-heading text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {activeNav.pageTitle}
                </h1>
                <p className="hidden truncate text-xs text-slate-500 sm:block">
                  {activeNav.pageDescription}
                </p>
              </div>
            </div>

            {/* Right: Widget Status + Pause/Resume + Sign Out */}
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/90 px-2.5 py-1.5">
                <StatusBadge
                  status={widgetStatusKey}
                  label={widgetStatusLabel}
                  size="sm"
                />
                {widgetState.envEnabled && (
                  <button
                    type="button"
                    disabled={widgetPending}
                    onClick={handleToggleWidget}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60",
                      widgetState.dbPaused
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    )}
                  >
                    {widgetPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Power className="h-3 w-3" />
                    )}
                    <span>{widgetState.dbPaused ? "Resume" : "Pause Now"}</span>
                  </button>
                )}
              </div>

              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Main Workspace Container */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminFrame({ widgetState, children }: AdminFrameProps) {
  return (
    <ToastProvider>
      <AdminFrameInner widgetState={widgetState}>{children}</AdminFrameInner>
    </ToastProvider>
  );
}
