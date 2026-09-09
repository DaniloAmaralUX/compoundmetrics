import type { Metadata } from "next";
import shared from "./comet.module.css";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { DoAnything } from "./sections/DoAnything";
import { ResourceBridge } from "./sections/ResourceBridge";
import { PersonalAssistant } from "./sections/PersonalAssistant";
import { Faq } from "./sections/Faq";
import { ClosingCta } from "./sections/ClosingCta";
import { Footer } from "./sections/Footer";
import { MobileSplash } from "./MobileSplash";

export const metadata: Metadata = {
  title: { absolute: "Comet: Browser: Assistente de IA pessoal" },
  description: "O navegador que trabalha por você.",
  robots: { index: false, follow: false },
};

/**
 * Página inicial do Comet em PT-BR. Ordem das seções = ordem observada na captura da referência:
 * cabeçalho → hero → "Faça qualquer coisa" → ponte de recursos → assistente pessoal → FAQ → fechamento → rodapé.
 */
export default function CometPage() {
  return (
    <div className={shared.page} lang="pt-BR">
      <Header />
      <main>
        <Hero />
        <DoAnything />
        <ResourceBridge />
        <PersonalAssistant />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
      <MobileSplash />
    </div>
  );
}
