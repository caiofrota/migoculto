import { Metadata } from "next";
import "./globals.css";
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
    <html>
      <body>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
