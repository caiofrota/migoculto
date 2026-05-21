import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type PrivacyLayoutProps = {
  children: ReactNode;
};

export function PrivacyLayout({ children }: PrivacyLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,196,107,0.22),transparent_32%),linear-gradient(180deg,#6b0000,#300101)] text-red-950">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
