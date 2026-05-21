import { Metadata, Viewport } from "next";
import { StoreBadge } from "@migoculto/ui";

export const metadata: Metadata = {
  title: "MigOculto - Organize seu amigo secreto de forma divertida!",
  description:
    "MigOculto é o app perfeito para organizar amigo secreto, amigo doce, Natal, Páscoa e muito mais. Crie grupos, sorteie, envie mensagens anônimas e compartilhe listas de presentes. Tudo rápido, fácil e mágico!",
  keywords: [
    "amigo secreto",
    "amigo oculto",
    "migoculto",
    "amigo doce",
    "sorteio de amigo secreto",
    "organizar amigo secreto",
    "páscoa",
    "natal",
    "grupos de amigo secreto",
    "aplicativo de sorteio",
    "wishlist de presentes",
    "lista de presentes",
  ],
  authors: [{ name: "MigOculto", url: "https://www.migoculto.com.br" }],
  creator: "MigOculto",
  publisher: "MigOculto",
  metadataBase: new URL("https://www.migoculto.com.br"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "MigOculto - Organize seu amigo secreto de forma divertida!",
    description:
      "Organize amigo secreto ou amigo doce para Natal, Páscoa e qualquer celebração. Baixe o aplicativo e torne tudo mais fácil e mágico!",
    url: "https://migoculto.com.br",
    siteName: "MigOculto",
    images: [
      {
        url: "/icon.png",
        width: 1024,
        height: 1024,
        alt: "MigOculto - App de amigo secreto",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MigOculto - Organize seu amigo secreto de forma divertida!",
    description: "MigOculto permite criar grupos, sortear, mandar mensagens secretas e compartilhar listas de presentes!",
    images: ["/icon.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#8B0000",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-migo-red-950 via-migo-red-900 to-migo-red-700 text-slate-100">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <img src="/images/logo.png" alt="MigOculto" className="w-24 p-2 rounded-2xl" />
        <h1 className="text-4xl font-bold tracking-tight text-migo-cream-100 sm:text-5xl">MigOculto</h1>
        <p className="mt-4 max-w-md text-lg text-migo-gold-100">
          O jeito mais divertido, moderno e mágico de organizar seu amigo secreto! Natal, Páscoa, amigo doce ou qualquer ocasião especial!
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <StoreBadge
            href="https://apps.apple.com/br/app/migoculto/id6471426378"
            target="_blank"
            rel="noreferrer"
            imageSrc="/images/app-store.png"
            imageAlt="Baixar na App Store"
          />
          <StoreBadge
            href="https://play.google.com/store/apps/details?id=com.cftechsol.migoculto&pcampaignid=web_share"
            target="_blank"
            rel="noreferrer"
            imageSrc="/images/google-play.png"
            imageAlt="Disponível no Google Play"
          />
        </div>
      </section>
      <footer className="py-6 text-center text-xs text-migo-gold-200">
        © {new Date().getFullYear()} MigOculto | Todos os direitos reservados.
        <br />
        Desde 2024 alegrando os momentos especiais!
      </footer>
    </main>
  );
}
