import Link from "next/link";
import { AppStoreButtons } from "./app-store-buttons";
import { contactEmail } from "./store-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-amber-100/20 bg-red-950 px-5 py-12 text-center text-amber-50 sm:px-8 lg:text-left">
      <div className="mx-auto grid max-w-7xl gap-10 justify-items-center lg:grid-cols-[1.3fr_0.7fr_0.8fr] lg:justify-items-start">
        <div className="flex max-w-md flex-col items-center lg:items-start">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <img src="/images/logo.png" alt="" className="size-12 rounded-2xl bg-amber-50 p-1" />
            <span className="text-xl font-black">MigOculto</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-amber-50/72">
            App de amigo secreto online para sortear, convidar participantes, criar listas de desejos e deixar a revelação mais divertida.
          </p>
          <p className="mt-4 text-sm font-semibold text-amber-200">Desde 2023 organizando celebrações com mais leveza.</p>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">Links</h2>
          <ul className="mt-4 space-y-3 text-sm text-amber-50/76">
            <li>
              <Link className="transition hover:text-amber-200" href="/politica-de-privacidade">
                Política de privacidade
              </Link>
            </li>
            <li>
              <a className="transition hover:text-amber-200" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">Baixe o app</h2>
          <AppStoreButtons className="mt-4" />
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl text-xs text-amber-50/55">
        © {new Date().getFullYear()} MigOculto. Todos os direitos reservados.
      </div>
    </footer>
  );
}
