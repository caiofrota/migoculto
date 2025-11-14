// app/politica-de-privacidade/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | MigOculto",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-emerald-900">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-800">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-red-900 to-red-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <header className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" alt="MigOculto" className="w-24 p-2 rounded-2xl" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">MigOculto</p>
              <h1 className="text-2xl font-bold text-amber-50 sm:text-3xl">Política de Privacidade</h1>
              <p className="mt-1 text-xs text-amber-100/80">Última atualização: 10 de novembro de 2023</p>
            </div>
          </div>
        </header>

        <div className="grow rounded-3xl bg-slate-50/95 p-6 shadow-xl shadow-amber-950/40 backdrop-blur-sm sm:p-8">
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-slate-800">
              A sua privacidade é importante para nós. Esta política de privacidade descreve como MigOculto (&quot;nós&quot;,
              &quot;nosso&quot; ou &quot;aplicativo&quot;) coleta, utiliza e protege as informações pessoais dos usuários. Entretanto, é
              importante ressaltar que nosso aplicativo é projetado de forma a não coletar ou armazenar qualquer informação pessoal dos
              usuários.
            </p>

            <Section title="Coleta de Informações">
              <p>
                Ao usar o MigOculto, coletamos uma riqueza de informações, como: nome, endereço de e-mail e outras informações de contato,
                ID do usuário, ID do dispositivo, interações com o produto, dados de publicidade, informações sobre o uso, dados técnicos,
                como falhas, desempenho, diagnósticos e outros dados necessários para o funcionamento do aplicativo. Essas informações são a
                chave para personalizar e aprimorar a sua experiência conosco, garantindo que cada interação seja única e adaptada às suas
                preferências.
              </p>
            </Section>

            <Section title="Uso de Informações">
              <p>
                Utilizamos essas informações para enriquecer a sua experiência no MigOculto, buscando constantemente formas de aprimorar e
                personalizar a aplicação conforme as suas preferências e interações.
              </p>
            </Section>

            <Section title="Mensagens Anônimas">
              <p>
                No MigOculto, oferecemos aos usuários a capacidade de enviar mensagens anônimas que permanecerão ocultas até o dia do evento
                ou término da brincadeira. Durante esse período, a identidade dos remetentes não será revelada. Esta funcionalidade visa
                proporcionar uma experiência única e intrigante para os usuários.
              </p>
              <p>
                No entanto, é importante destacar que ao final da brincadeira, os remetentes das mensagens anônimas serão revelados. Esta
                revelação faz parte da dinâmica do aplicativo e está em conformidade com nossa abordagem transparente e de diversão.
              </p>
              <p>
                Ressaltamos que, embora as mensagens sejam inicialmente anônimas, outras informações sobre o uso do aplicativo podem ser
                coletadas conforme descrito nesta política de privacidade.
              </p>
            </Section>

            <Section title="Compartilhamento de Informações">
              <p>
                Em casos específicos, podemos compartilhar informações coletadas para aprimorar nossos esforços de publicidade e marketing.
                Este compartilhamento será realizado com responsabilidade, garantindo a segurança e privacidade dos dados. Além disso,
                compartilharemos informações apenas quando necessário para o funcionamento do aplicativo ou em conformidade com as leis
                aplicáveis.
              </p>
            </Section>

            <Section title="Segurança">
              <p>Implementamos medidas de segurança adequadas para proteger quaisquer informações.</p>
            </Section>

            <Section title="Cookies e Tecnologias Semelhantes">
              <p>
                Para oferecer uma experiência personalizada, utilizamos cookies e tecnologias semelhantes. Essas ferramentas ajudam a
                identificar o usuário, mantendo informações importantes durante a sessão e garantindo uma navegação mais eficiente e
                personalizada.
              </p>
            </Section>

            <Section title="Alterações nesta Política de Privacidade">
              <p>
                Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento. A data da última atualização será
                indicada no início desta política.
              </p>
            </Section>

            <Section title="Contato">
              <p>
                Se tiver alguma dúvida sobre esta política de privacidade ou sobre o nosso aplicativo, entre em contato conosco através do
                seguinte endereço de e-mail:{" "}
                <a
                  href="mailto:contato@migoculto.com.br"
                  className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                >
                  contato@migoculto.com.br
                </a>
                .
              </p>
            </Section>

            <Section title="Disposições Finais">
              <p>
                Esta política de privacidade reflete o nosso compromisso em proteger a privacidade dos usuários, e estamos empenhados em
                manter a transparência em relação às informações que não coletamos. Ao usar nosso aplicativo, você concorda com esta
                política de privacidade. Lembre-se de que, uma vez que não coletamos informações pessoais, não temos a capacidade de usá-las
                ou compartilhá-las de qualquer forma.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
