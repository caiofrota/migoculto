import { AppStoreButtons } from "./app-store-buttons";

export function CTASection() {
  return (
    <section className="bg-red-900 px-4 py-16 text-center text-amber-50 sm:px-8 sm:py-20 lg:text-left">
      <div className="mx-auto grid max-w-7xl items-center justify-items-center gap-10 rounded-[32px] border border-amber-100/20 bg-[radial-gradient(circle_at_15%_20%,rgba(255,196,107,0.2),transparent_34%),linear-gradient(135deg,#6b0000,#300101)] p-6 shadow-[0_30px_100px_rgba(48,1,1,0.32)] sm:rounded-[36px] sm:p-8 lg:grid-cols-[1fr_auto] lg:justify-items-start lg:p-12">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-200">Comece agora</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            Transforme o sorteio em parte gostosa da celebração.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-amber-50/76 lg:mx-0">
            Baixe o MigOculto e organize amigo secreto online com convite, lista de desejos, mensagens anonimas e lembretes em um so lugar.
          </p>
        </div>
        <AppStoreButtons />
      </div>
    </section>
  );
}
