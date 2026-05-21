import type { Metadata } from "next";
import { PrivacyLayout } from "../_components/marketing/privacy-layout";
import { contactHref, contactLabel } from "../_components/marketing/store-links";

export const metadata: Metadata = {
  title: "Política de Privacidade | MigOculto",
  description:
    "Entenda como o MigOculto trata dados necessários para criar conta, organizar grupos, enviar mensagens, listas de desejos, notificações e melhorar a experiência no app.",
  alternates: {
    canonical: "/politica-de-privacidade",
  },
  openGraph: {
    title: "Política de Privacidade | MigOculto",
    description: "Política de privacidade do MigOculto, app de amigo secreto online.",
    url: "https://migoculto.com.br/politica-de-privacidade",
    siteName: "MigOculto",
    type: "website",
    locale: "pt_BR",
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-red-100 bg-white/86 p-6 shadow-[0_20px_70px_rgba(79,6,6,0.07)]">
      <h2 className="text-xl font-black tracking-tight text-red-950">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-7 text-red-950/72">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <PrivacyLayout>
      <main className="px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
        <article className="mx-auto max-w-5xl">
          <header className="rounded-[36px] border border-amber-100/20 bg-amber-50/10 p-8 text-amber-50 shadow-[0_30px_100px_rgba(48,1,1,0.3)] backdrop-blur lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-200">MigOculto</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Política de Privacidade</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-amber-50/76">
              Esta política explica, em linguagem direta, como tratamos informações necessárias para o funcionamento do aplicativo MigOculto.
            </p>
            <p className="mt-6 text-sm font-semibold text-amber-200">Última atualização: 10 de novembro de 2023</p>
          </header>

          <div className="mt-10 space-y-5">
            <Section title="Visão geral">
              <p>
                A sua privacidade é importante para nós. Esta política de privacidade descreve como o MigOculto (&quot;nós&quot;,
                &quot;nosso&quot; ou &quot;aplicativo&quot;) coleta, utiliza e protege informações dos usuários para viabilizar a criação
                de conta, organização de grupos de amigo secreto, mensagens, listas de desejos, notificações e demais funcionalidades do app.
              </p>
            </Section>

            <Section title="Coleta de informações">
              <p>
                Ao usar o MigOculto, podemos tratar informações como nome, endereço de e-mail, dados de conta, identificadores de usuário e
                dispositivo, interações com funcionalidades do aplicativo, informações de uso, dados técnicos, diagnósticos, falhas e
                desempenho.
              </p>
              <p>
                Esses dados ajudam a manter o aplicativo funcionando, personalizar a experiência, permitir a participação nos grupos e
                aprimorar a estabilidade do serviço.
              </p>
            </Section>

            <Section title="Uso de informações">
              <p>
                Utilizamos informações para autenticar usuários, organizar grupos, realizar sorteios, exibir listas de desejos, viabilizar
                mensagens, enviar lembretes e notificações, prestar suporte e melhorar a experiência no MigOculto.
              </p>
            </Section>

            <Section title="Mensagens anônimas">
              <p>
                O MigOculto oferece a possibilidade de enviar mensagens anônimas que permanecem ocultas durante a brincadeira. Essa
                funcionalidade existe para criar uma experiência divertida, misteriosa e alinhada à dinâmica do amigo secreto.
              </p>
              <p>
                A depender da dinâmica da brincadeira, remetentes de mensagens anônimas podem ser revelados no final do evento. Essa
                revelação faz parte da proposta do aplicativo.
              </p>
            </Section>

            <Section title="Compartilhamento de informações">
              <p>
                Podemos compartilhar informações quando necessário para o funcionamento do aplicativo, cumprimento de obrigações legais,
                segurança, suporte, publicidade, marketing ou melhoria do serviço. Esse compartilhamento deve ocorrer de forma responsável e
                compatível com esta política.
              </p>
            </Section>

            <Section title="Segurança">
              <p>
                Adotamos medidas técnicas e organizacionais razoáveis para proteger as informações tratadas pelo MigOculto. Nenhum sistema,
                entretanto, é totalmente imune a riscos, e seguimos trabalhando para manter a aplicação segura e estável.
              </p>
            </Section>

            <Section title="Cookies e tecnologias semelhantes">
              <p>
                Podemos utilizar cookies e tecnologias semelhantes para manter sessões, lembrar preferências, melhorar navegação, analisar
                funcionamento do serviço e oferecer uma experiência mais eficiente.
              </p>
            </Section>

            <Section title="Alterações nesta política">
              <p>
                Podemos atualizar esta política de privacidade a qualquer momento. Quando isso ocorrer, a data de última atualização será
                indicada nesta página.
              </p>
            </Section>

            <Section title="Contato">
              <p>
                Em caso de dúvidas sobre esta política de privacidade ou sobre o MigOculto, use o canal de contato oficial:{" "}
                <a className="font-bold text-red-800 underline underline-offset-4 hover:text-red-950" href={contactHref}>
                  {contactLabel}
                </a>
                .
              </p>
            </Section>

            <Section title="Disposições finais">
              <p>
                Ao usar o MigOculto, você declara ciência desta política de privacidade. Esta página busca manter transparência sobre o uso
                de dados necessários à experiência do aplicativo e poderá ser revista conforme o produto evoluir.
              </p>
            </Section>
          </div>
        </article>
      </main>
    </PrivacyLayout>
  );
}
