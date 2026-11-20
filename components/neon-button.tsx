import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "destructive" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const baseButtonClasses =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold tracking-tight whitespace-nowrap select-none cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:translate-y-0 active:scale-[0.98]";

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm gap-2 min-h-[40px]",
  md: "px-6 py-3 text-[15px] gap-2.5 min-h-[46px]",
  lg: "px-8 py-4 text-base gap-3 min-h-[54px]",
};

const iconSizeMap: Record<ButtonSize, string> = {
  sm: "w-9 h-9 p-0",
  md: "w-10 h-10 p-0",
  lg: "w-12 h-12 p-0",
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white border border-white/15 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.45),0_4px_10px_-2px_rgba(124,58,237,0.25),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_18px_35px_-5px_rgba(79,70,229,0.6),0_6px_15px_-3px_rgba(124,58,237,0.35),inset_0_1px_0_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 hover:scale-[1.01] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700 before:pointer-events-none",
  secondary:
    "bg-white text-slate-800 border border-slate-200/90 shadow-[0_2px_10px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.15)] hover:-translate-y-0.5",
  outline:
    "bg-indigo-500/5 text-indigo-600 border border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:border-transparent shadow-xs hover:shadow-[0_12px_25px_-5px_rgba(79,70,229,0.4)] hover:-translate-y-0.5",
  destructive:
    "bg-gradient-to-r from-red-600 to-rose-600 text-white border border-white/15 shadow-[0_10px_25px_-5px_rgba(239,68,68,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_16px_32px_-5px_rgba(239,68,68,0.55)] hover:-translate-y-0.5",
  icon:
    "bg-white text-slate-700 border border-slate-200/90 shadow-xs hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:border-transparent hover:shadow-[0_10px_20px_-4px_rgba(79,70,229,0.45)] hover:-translate-y-0.5",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  const dimensions = variant === "icon" ? iconSizeMap[size] : sizeMap[size];
  return cn(baseButtonClasses, dimensions, variantMap[variant], className);
}

export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      href,
      target,
      rel,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const classes = buttonVariants({ variant, size, className });

    if (href) {
      const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
      if (isExternal) {
        return (
          <a href={href} target={target} rel={rel} className={classes}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={classes}
        {...props}
      >
        {loading && <Loader2 size={18} className="animate-spin shrink-0" aria-hidden="true" />}
        <span className="inline-flex items-center justify-center gap-2.5">{children}</span>
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";
export const Button = NeonButton;
