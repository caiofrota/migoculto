import type { Metadata, Viewport } from "next";
import { AppStoreButtons } from "./_components/marketing/app-store-buttons";
import { CTASection } from "./_components/marketing/cta-section";
import { FAQ, faqJsonLd } from "./_components/marketing/faq";
import { FeatureCard } from "./_components/marketing/feature-card";
import { SiteFooter } from "./_components/marketing/site-footer";
import { SiteHeader } from "./_components/marketing/site-header";
import { StepCard } from "./_components/marketing/step-card";

const siteUrl = "https://migoculto.com.br";

export const metadata: Metadata = {
  title: "MigOculto | Amigo secreto online sem complicação",
  description:
    "Organize amigo secreto online com sorteio, convites, lista de desejos, mensagens anônimas, lembretes e revelação. Ideal para Natal, Páscoa, amigo doce, empresas, família e amigos.",
  keywords: [
    "amigo secreto online",
    "app de amigo secreto",
    "sorteio de amigo secreto",
    "organizar amigo secreto",
    "amigo oculto online",
    "amigo doce",
    "amigo secreto de Natal",
    "amigo secreto para empresas",
    "lista de desejos amigo secreto",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MigOculto | Amigo secreto online sem complicação",
    description:
      "Crie grupos, convide participantes, faça o sorteio e viva a revelação do amigo secreto com mais magia e menos trabalho.",
    url: siteUrl,
    siteName: "MigOculto",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "Logo do MigOculto, app de amigo secreto online",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MigOculto | Amigo secreto online sem complicação",
    description: "App para organizar amigo secreto, amigo doce, Natal, Páscoa, empresas, família e amigos.",
    images: ["/images/logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6b0000",
};

const featureCards = [
  {
    eyebrow: "Sorteio",
    title: "Grupos e convite simples",
    description: "Crie a brincadeira, compartilhe o convite e deixe cada participante entrar pelo app, sem planilha ou mensagem perdida.",
  },
  {
    eyebrow: "Presentes",
    title: "Lista de desejos",
    description: "Cada pessoa adiciona ideias de presente, links e preferências para facilitar a escolha e reduzir o risco de errar.",
  },
  {
    eyebrow: "Mistério",
    title: "Mensagens anônimas",
    description: "Troque pistas, recados e provocações leves sem revelar quem tirou quem antes do momento certo.",
  },
  {
    eyebrow: "Ritmo",
    title: "Lembretes e notificações",
    description: "Ajude o grupo a lembrar datas, mudanças e novidades importantes sem precisar coordenar tudo manualmente.",
  },
  {
    eyebrow: "Final",
    title: "Revelação do amigo secreto",
    description: "Conduza a expectativa até o dia da troca de presentes com uma experiência mais organizada, divertida e moderna.",
  },
  {
    eyebrow: "Sempre junto",
    title: "Tudo no celular",
    description: "Os detalhes da brincadeira, participantes, mensagens e listas ficam acessíveis no app para iOS e Android.",
  },
];

const occasions = ["Natal", "Páscoa", "Amigo doce", "Confraternização", "Empresa", "Família", "Aniversário", "Amigos"];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MigOculto",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Android",
  description:
    "Aplicativo para organizar amigo secreto online com sorteio, lista de desejos, mensagens anônimas, convites, notificações e revelação.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SiteHeader />
      <main className="overflow-hidden bg-amber-50 text-red-950">
        <section className="relative bg-[radial-gradient(circle_at_18%_18%,rgba(255,196,107,0.26),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(255,248,239,0.16),transparent_24%),linear-gradient(145deg,#6b0000,#4f0606_52%,#300101)] text-amber-50">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24">
            <div className="text-center lg:text-left">
              <p className="inline-flex max-w-full rounded-full border border-amber-200/25 bg-amber-50/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-amber-200 shadow-lg shadow-red-950/20 backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.22em]">
                Amigo secreto online desde 2023
              </p>
              <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-amber-50 sm:text-6xl lg:mx-0 lg:text-7xl">
                Organize amigo secreto sem complicação.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-amber-50/78 sm:text-xl sm:leading-8 lg:mx-0">
                O MigOculto ajuda você a criar grupos, sortear participantes, montar listas de desejos, trocar mensagens anônimas e preparar a revelação para Natal, Páscoa, empresas, família, amigos e outras ocasiões.
              </p>
              <AppStoreButtons className="mt-8 items-center justify-center lg:justify-start" />
              <p className="mt-5 text-sm text-amber-100/68">Disponível para iOS e Android.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
              <div className="absolute -right-6 bottom-12 h-44 w-44 rounded-full bg-red-300/10 blur-3xl" />
              <div className="relative mx-auto max-w-sm rounded-[32px] border border-amber-100/22 bg-amber-50/10 p-3 shadow-[0_30px_120px_rgba(48,1,1,0.46)] backdrop-blur sm:max-w-md sm:rounded-[42px] sm:p-4">
                <div className="rounded-[26px] bg-amber-50 p-4 text-red-950 shadow-2xl shadow-red-950/25 sm:rounded-[32px] sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/images/logo.png" alt="Logo do MigOculto" className="size-12 rounded-2xl bg-red-900 p-1" />
                      <div>
                        <p className="text-sm font-black">Natal da família</p>
                        <p className="text-xs text-red-950/55">12 participantes</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-900 px-2.5 py-1 text-[0.7rem] font-bold text-amber-50 sm:px-3 sm:text-xs">Sorteado</span>
                  </div>

                  <div className="mt-5 space-y-3 sm:mt-7">
                    <div className="rounded-3xl bg-red-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Seu amigo secreto</p>
                      <p className="mt-2 text-xl font-black sm:text-2xl">Revelado no app</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-3xl bg-amber-100 p-4">
                        <p className="text-2xl font-black">5</p>
                        <p className="text-xs text-red-950/62">desejos na lista</p>
                      </div>
                      <div className="rounded-3xl bg-red-900 p-4 text-amber-50">
                        <p className="text-2xl font-black">3</p>
                        <p className="text-xs text-amber-50/70">mensagens secretas</p>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-red-100 bg-white p-4">
                      <p className="text-sm font-bold">Próximo lembrete</p>
                      <p className="mt-1 text-sm text-red-950/65">Comprar presente até sexta-feira.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">Como funciona</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Do grupo ao presente em 3 passos.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <StepCard number="1" title="Crie o grupo">
                Defina nome, data, local, regras e convide participantes pelo app.
              </StepCard>
              <StepCard number="2" title="Faça o sorteio">
                O MigOculto distribui os amigos secretos de forma privada para cada pessoa.
              </StepCard>
              <StepCard number="3" title="Viva a revelação">
                Use listas, mensagens anônimas e lembretes para deixar a troca mais leve e divertida.
              </StepCard>
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-[#fff3e6] px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">Recursos</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Tudo que deixa o amigo secreto mais fácil.</h2>
                <p className="mt-5 text-base leading-8 text-red-950/70">
                  Menos combinados soltos, menos dúvida sobre presente e mais clima de celebração para todos os participantes.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {featureCards.map((feature) => (
                  <FeatureCard key={feature.title} eyebrow={feature.eyebrow} title={feature.title}>
                    {feature.description}
                  </FeatureCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-3">
              <FeatureCard title="Para famílias">Organize a troca de presentes sem depender de papelzinho, ligação ou grupo lotado de mensagens.</FeatureCard>
              <FeatureCard title="Para empresas">Conduza confraternizações com clareza, convite simples e menos trabalho para RH, líderes ou organizadores.</FeatureCard>
              <FeatureCard title="Para amigos">Deixe amigo doce, aniversários e encontros mais divertidos com mistério, pistas e listas de desejos.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="bg-red-950 px-4 py-16 text-amber-50 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-200">Ocasiões</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Um app para toda celebração com troca de presentes.</h2>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {occasions.map((occasion) => (
                <span key={occasion} className="rounded-full border border-amber-100/18 bg-amber-50/10 px-5 py-3 text-sm font-bold text-amber-50 shadow-lg shadow-red-950/20">
                  {occasion}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[36px] bg-red-900 p-8 text-amber-50 shadow-[0_26px_90px_rgba(79,6,6,0.2)]">
              <p className="text-6xl font-black">2023</p>
              <p className="mt-3 text-lg font-bold">MigOculto existe desde 2023.</p>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">Confiança</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Feito para organizar brincadeiras reais.</h2>
              <p className="mt-5 text-base leading-8 text-red-950/70">
                O MigOculto nasceu para resolver a parte chata do amigo secreto e preservar o que importa: expectativa, carinho, surpresa e boas histórias no dia da revelação.
              </p>
            </div>
          </div>
        </section>

        <FAQ />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
