import type { ReactNode } from "react";

type FeatureCardProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function FeatureCard({ eyebrow, title, children }: FeatureCardProps) {
  return (
    <article className="group rounded-[28px] border border-red-100/80 bg-white/82 p-6 text-red-950 shadow-[0_24px_80px_rgba(79,6,6,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">{eyebrow}</p> : null}
      <h3 className="mt-3 text-xl font-black tracking-tight text-red-950">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-red-950/72">{children}</div>
    </article>
  );
}
