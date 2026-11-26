"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastContextValue {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      const timer = setTimeout(() => dismiss(id), 4200);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    pushToast,
    success: useCallback(
      (title, description) => pushToast({ tone: "success", title, description }),
      [pushToast]
    ),
    error: useCallback(
      (title, description) => pushToast({ tone: "error", title, description }),
      [pushToast]
    ),
    info: useCallback(
      (title, description) => pushToast({ tone: "info", title, description }),
      [pushToast]
    ),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed right-4 bottom-4 z-[110] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5"
      >
        {toasts.map((t) => {
          const Icon =
            t.tone === "success"
              ? CheckCircle2
              : t.tone === "error"
                ? AlertCircle
                : Info;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-3.5 shadow-lg transition-all",
                t.tone === "success" && "border-emerald-200",
                t.tone === "error" && "border-rose-200",
                t.tone === "info" && "border-slate-200"
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  t.tone === "success" && "text-emerald-600",
                  t.tone === "error" && "text-rose-600",
                  t.tone === "info" && "text-indigo-600"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      pushToast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
  return ctx;
}
