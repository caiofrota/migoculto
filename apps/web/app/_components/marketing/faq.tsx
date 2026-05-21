const faqs = [
  {
    question: "Como fazer amigo secreto online?",
    answer:
      "No MigOculto, voce cria um grupo, define as informacoes da brincadeira, convida os participantes e faz o sorteio pelo app. Cada pessoa acessa seu resultado de forma privada.",
  },
  {
    question: "O app serve para amigo secreto de Natal?",
    answer:
      "Sim. O MigOculto foi pensado para Natal, Pascoa, amigo doce, aniversarios, confraternizacoes, empresas, familia e grupos de amigos.",
  },
  {
    question: "Da para criar lista de desejos?",
    answer:
      "Sim. Cada participante pode montar uma lista de desejos para ajudar quem tirou seu nome a escolher um presente melhor.",
  },
  {
    question: "As mensagens anonimas revelam quem enviou?",
    answer:
      "As mensagens ficam anonimas durante a brincadeira e podem fazer parte do momento de revelacao, conforme a dinamica do grupo.",
  },
  {
    question: "Posso usar para amigo secreto em empresas?",
    answer:
      "Sim. O app ajuda a organizar grupos maiores com convite, sorteio, lembretes, mensagens e informacoes centralizadas.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-amber-50 px-5 py-20 text-red-950 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Perguntas sobre amigo secreto online</h2>
        <div className="mt-10 divide-y divide-red-200/70 rounded-[32px] border border-red-100 bg-white/80 shadow-[0_24px_80px_rgba(79,6,6,0.08)]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-lg font-black">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="relative size-8 shrink-0 rounded-full bg-red-100 text-red-800 transition group-open:rotate-45"
                >
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
                  <span className="absolute left-1/2 top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-red-950/72">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};
