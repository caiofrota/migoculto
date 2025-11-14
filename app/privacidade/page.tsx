import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | MigOculto",
  description: "Leia a política de privacidade do MigOculto e saiba como protegemos suas informações.",
  alternates: {
    canonical: `https://www.migoculto.com.br/privacidade`,
  },
};

export default function Index() {
  return (
    <main className="flex items-center justify-center bg-[#6B0000] p-2">
      <div className="p-4 max-w-6xl rounded-lg shadow-md space-y-2 text-yellow-100">
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-400 md:hidden">
          Política de Privacidade
          <br />
          <span className="text-2xl">MigOculto</span>
        </h1>
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-400 hidden md:block">Política de Privacidade | MigOculto</h1>
        <p className="text-sm text-center">Última atualização: 10 de novembro de 2023</p>
        <p className="text-md text-justify">
          A sua privacidade é importante para nós. Esta política de privacidade descreve como MigOculto ("nós", "nosso" ou "aplicativo")
          coleta, utiliza e protege as informações pessoais dos usuários. Entretanto, é importante ressaltar que nosso aplicativo é
          projetado de forma a não coletar ou armazenar qualquer informação pessoal dos usuários.
        </p>
        <p className="text-md text-lg font-bold text-yellow-200">Coleta de Informações</p>
        <p className="text-md text-justify">
          Ao usar o MigOculto, coletamos uma riqueza de informações, como: nome, endereço de e-mail e outras informações de contato, ID do
          usuário, ID do dispositivo, interações com o produto, dados de publicidade, informações sobre o uso, dados técnicos, como falhas,
          desempenho, diagnósticos e outros dados necessários para o funcionamento do aplicativo.
          <br />
          Essas informações são a chave para personalizar e aprimorar a sua experiência conosco, garantindo que cada interação seja única e
          adaptada às suas preferências.
        </p>
        <p className="text-md text-lg font-bold text-yellow-200">Uso de Informações</p>
        <p className="text-md text-justify">
          Utilizamos essas informações para enriquecer a sua experiência no MigOculto, buscando constantemente formas de aprimorar e
          personalizar a aplicação conforme as suas preferências e interações.
        </p>
        <p className="text-md text-lg font-bold text-yellow-200">Mensagens Anônimas</p>
        <p className="text-md text-justify">
          No MigOculto, oferecemos aos usuários a capacidade de enviar mensagens anônimas que permanecerão ocultas até o dia do evento ou
          término da brincadeira. Durante esse período, a identidade dos remetentes não será revelada. Esta funcionalidade visa proporcionar
          uma experiência única e intrigante para os usuários. No entanto, é importante destacar que ao final da brincadeira, os remetentes
          das mensagens anônimas serão revelados. Esta revelação faz parte da dinâmica do aplicativo e está em conformidade com nossa
          abordagem transparente e de diversão. Ressaltamos que, embora as mensagens sejam inicialmente anônimas, outras informações sobre o
          uso do aplicativo podem ser coletadas conforme descrito nesta política de privacidade.
        </p>
        <p className="text-md text-lg font-bold text-yellow-200">Compartilhamento de Informações</p>
        <p className="text-md text-justify">
          Em casos específicos, podemos compartilhar informações coletadas para aprimorar nossos esforços de publicidade e marketing. Este
          compartilhamento será realizado com responsabilidade, garantindo a segurança e privacidade dos dados. Além disso, compartilharemos
          informações apenas quando necessário para o funcionamento do aplicativo ou em conformidade com as leis aplicáveis.
        </p>
        <p className="text-md text-lg font-bold text-yellow-200">Segurança</p>
        <p className="text-md text-justify">Implementamos medidas de segurança adequadas para proteger quaisquer informações.</p>
        <p className="text-md text-lg font-bold text-yellow-200">Cookies e Tecnologias Semelhantes</p>
        <p className="text-md text-justify">
          Para oferecer uma experiência personalizada, utilizamos cookies e tecnologias semelhantes. Essas ferramentas ajudam a identificar
          o usuário, mantendo informações importantes durante a sessão e garantindo uma navegação mais eficiente e personalizada.
        </p>
        <p className="text-md text-lg font-bold text-yellow-200">Alterações nesta Política de Privacidade</p>
        <p className="text-md text-justify">
          Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento. A data da última atualização será indicada
          no início desta política.
        </p>
        <p className="text-md text-lg font-bold text-yellow-200">Contato</p>
        <p className="text-md text-justify">
          Se tiver alguma dúvida sobre esta política de privacidade ou sobre o nosso aplicativo, entre em contato conosco através do
          seguinte endereço de e-mail: <a href="mailto:contato@cftechsol.com">contato@cftechsol.com</a>.
        </p>
        <p className="text-md text-justify">
          Esta política de privacidade reflete o nosso compromisso em proteger a privacidade dos usuários, e estamos empenhados em manter a
          transparência em relação às informações que não coletamos. Ao usar nosso aplicativo, você concorda com esta política de
          privacidade. Lembre-se de que, uma vez que não coletamos informações pessoais, não temos a capacidade de usá-las ou
          compartilhá-las de qualquer forma.
        </p>
      </div>
    </main>
  );
}
