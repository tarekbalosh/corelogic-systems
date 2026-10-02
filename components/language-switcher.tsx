"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLocale: "en" | "ar";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  className,
}) => {
  const pathname = usePathname();

  // Build the alternate path
  const getAlternatePath = () => {
    if (currentLocale === "en") {
      // English -> Arabic: prepend /ar
      return `/ar${pathname}`;
    } else {
      // Arabic -> English: remove /ar prefix
      return pathname.replace(/^\/ar/, "") || "/";
    }
  };

  const alternateLocale = currentLocale === "en" ? "ar" : "en";
  const label = currentLocale === "en" ? "العربية" : "English";

  return (
    <Link
      href={getAlternatePath()}
      hrefLang={alternateLocale}
      className={cn(
        "group inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-foreground/5 border border-foreground/10",
        "hover:bg-primary/10 hover:border-primary/30 hover:text-primary",
        "transition-all duration-300 text-sm font-semibold text-foreground/70",
        "shadow-sm hover:shadow-md hover:shadow-primary/5",
        className
      )}
    >
      <Globe
        size={16}
        className="text-foreground/40 group-hover:text-primary transition-colors duration-300"
      />
      <span className="tracking-wide">{label}</span>
    </Link>
  );
};
