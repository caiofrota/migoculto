import type { ReactNode } from "react";

type StepCardProps = {
  number: string;
  title: string;
  children: ReactNode;
};

export function StepCard({ number, title, children }: StepCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[28px] border border-amber-200/70 bg-amber-50/90 p-6 text-red-950 shadow-[0_20px_70px_rgba(79,6,6,0.08)]">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-red-800 text-sm font-black text-amber-50 shadow-lg shadow-red-900/20">
        {number}
      </span>
      <h3 className="mt-5 text-xl font-black tracking-tight">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-red-950/72">{children}</div>
    </article>
  );
}
