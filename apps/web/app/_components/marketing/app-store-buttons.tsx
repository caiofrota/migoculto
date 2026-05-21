import { StoreBadge } from "@migoculto/ui";
import { appStoreUrl, googlePlayUrl } from "./store-links";

type AppStoreButtonsProps = {
  className?: string;
};

export function AppStoreButtons({ className = "" }: AppStoreButtonsProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 sm:flex-row ${className}`}>
      <StoreBadge
        href={appStoreUrl}
        target="_blank"
        rel="noreferrer"
        imageSrc="/images/app-store.png"
        imageAlt="Baixar MigOculto na App Store"
        className="shadow-lg shadow-red-950/20 transition duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
      />
      <StoreBadge
        href={googlePlayUrl}
        target="_blank"
        rel="noreferrer"
        imageSrc="/images/google-play.png"
        imageAlt="Baixar MigOculto no Google Play"
        className="shadow-lg shadow-red-950/20 transition duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
      />
    </div>
  );
}
