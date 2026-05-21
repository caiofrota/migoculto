import type { AnchorHTMLAttributes } from "react";

export type StoreBadgeProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  imageAlt: string;
  imageSrc: string;
};

export function StoreBadge({ className = "", imageAlt, imageSrc, ...props }: StoreBadgeProps) {
  return (
    <a className={`block w-44 overflow-hidden transition hover:opacity-85 ${className}`} {...props}>
      <img src={imageSrc} alt={imageAlt} className="w-full" />
    </a>
  );
}
