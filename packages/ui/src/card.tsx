import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-migo-gold-200/70 bg-white/85 p-5 shadow-sm shadow-migo-red-950/10 backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
