import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-migo-red-700 text-white shadow-sm shadow-migo-red-950/20 hover:bg-migo-red-800",
  secondary: "bg-white text-migo-red-900 ring-1 ring-migo-gold-200 hover:bg-migo-cream-50",
  ghost: "bg-transparent text-migo-cream-100 hover:bg-white/10",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-migo-gold-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClassName[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
