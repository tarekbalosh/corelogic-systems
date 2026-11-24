"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AdminPasswordInput() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id="admin-token-input"
        name="token"
        type={visible ? "text" : "password"}
        required
        autoComplete="current-password"
        placeholder="Enter admin password…"
        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-12 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-2 flex cursor-pointer items-center justify-center rounded-xl px-2.5 text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {visible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
