import { Metadata } from "next";
import "./globals.css";
import { AnalyticsScripts } from "./_components/marketing/analytics-scripts";
import { Providers } from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://migoculto.com.br"),
    title: {
      default: "MigOculto",
      template: `%s | MigOculto`,
    },
    description: "MigOculto sorteia amigos secretos de forma fácil e divertida!",
    openGraph: {
      type: "website",
      url: `https://migoculto.com.br`,
      title: "MigOculto",
      description: "MigOculto sorteia amigos secretos de forma fácil e divertida!",
      siteName: "MigOculto",
      images: ["/images/logo-128.png"],
    },
    alternates: {
      canonical: `https://www.migoculto.com.br/`,
    },
  };
}

type Props = {
  children: React.ReactNode;
};
export default async function RootLayout({ children }: Props) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
