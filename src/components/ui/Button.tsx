"use client";

import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark disabled:opacity-40",
  secondary:
    "border border-brand text-brand hover:bg-brand-light disabled:opacity-40",
  ghost: "text-brand hover:bg-brand-light disabled:opacity-40",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-4 py-1.5",
  md: "text-sm px-5 py-2.5 font-semibold",
  lg: "text-base px-6 py-3.5 font-bold",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={[
        "font-semibold rounded-full transition-colors disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
