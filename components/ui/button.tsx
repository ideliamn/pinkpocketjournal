"use client";
import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: any) {
  const base = "rounded-xl px-4 py-3 text-sm font-medium transition w-full";

  const variants = {
    primary: "bg-pink-500 text-white hover:bg-pink-600",
    secondary: "bg-gray-100 text-gray-700",
    ghost: "bg-transparent text-gray-500",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}