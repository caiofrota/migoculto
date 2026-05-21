import Link from "next/link";
import { AppStoreButtons } from "./app-store-buttons";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-amber-100/18 bg-red-950/82 px-3 py-2 shadow-lg shadow-red-950/20 backdrop-blur-xl sm:px-4">
        <Link href="/" className="flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
          <img src="/images/logo.png" alt="MigOculto" className="size-11 rounded-2xl bg-amber-50 p-1 shadow-lg shadow-red-950/20 sm:size-12" />
          <span className="text-base font-black tracking-tight text-amber-50 sm:text-lg">MigOculto</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 text-sm font-semibold text-amber-50/82 lg:flex">
          <a href="/#como-funciona" className="transition hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
            Como funciona
          </a>
          <a href="/#recursos" className="transition hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
            Recursos
          </a>
          <a href="/#faq" className="transition hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
            FAQ
          </a>
        </nav>

        <AppStoreButtons className="hidden scale-90 origin-right xl:flex" />

        <details className="group lg:hidden">
          <summary
            className="flex size-11 cursor-pointer list-none flex-col items-center justify-center gap-1.5 rounded-full border border-amber-100/22 bg-amber-50/10 transition hover:bg-amber-50/16 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            aria-label="Abrir menu"
          >
            <span className="h-0.5 w-5 rounded-full bg-amber-50 transition group-open:translate-y-2 group-open:rotate-45" />
            <span className="h-0.5 w-5 rounded-full bg-amber-50 transition group-open:opacity-0" />
            <span className="h-0.5 w-5 rounded-full bg-amber-50 transition group-open:-translate-y-2 group-open:-rotate-45" />
          </summary>
          <div className="absolute left-4 right-4 top-[76px] rounded-[28px] border border-amber-100/20 bg-red-950/96 p-4 text-amber-50 shadow-2xl shadow-red-950/40 backdrop-blur-xl">
            <nav aria-label="Menu mobile" className="grid gap-2 text-sm font-bold">
              <a className="rounded-2xl px-4 py-3 transition hover:bg-amber-50/10" href="/#como-funciona">
                Como funciona
              </a>
              <a className="rounded-2xl px-4 py-3 transition hover:bg-amber-50/10" href="/#recursos">
                Recursos
              </a>
              <a className="rounded-2xl px-4 py-3 transition hover:bg-amber-50/10" href="/#faq">
                FAQ
              </a>
              <a className="rounded-2xl px-4 py-3 transition hover:bg-amber-50/10" href="/politica-de-privacidade">
                Política de privacidade
              </a>
            </nav>
            <AppStoreButtons className="mt-4 items-center" />
          </div>
        </details>
      </div>
    </header>
  );
}
