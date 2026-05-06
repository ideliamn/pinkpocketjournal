import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "w-full px-4 py-2 rounded-xl font-medium transition cursor-pointer",
        variant === "primary" &&
          "bg-pink-500 text-white hover:bg-pink-600 active:scale-95",
        variant === "outline" &&
          "border border-pink-500 text-pink-500 hover:bg-pink-50",
        className
      )}
      {...props}
    />
  );
}