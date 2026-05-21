import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`min-h-11 rounded-md border border-migo-gold-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-migo-red-600 focus:ring-2 focus:ring-migo-gold-200 ${className}`}
      {...props}
    />
  );
}
