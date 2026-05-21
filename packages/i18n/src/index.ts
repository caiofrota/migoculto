import ptBR from "./locales/pt-BR.json";

export const defaultLocale = "pt-BR";
export const locales = ["pt-BR"] as const;

export type Locale = (typeof locales)[number];
export type TranslationKey = keyof typeof ptBR;

const dictionaries = {
  "pt-BR": ptBR,
} satisfies Record<Locale, Record<string, string>>;

export function createTranslator(locale: Locale = defaultLocale) {
  const dictionary = dictionaries[locale];

  return function t(key: TranslationKey) {
    return dictionary[key] ?? key;
  };
}
