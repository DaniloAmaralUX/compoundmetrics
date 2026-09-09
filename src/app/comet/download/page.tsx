import type { Metadata } from "next";
import shared from "../comet.module.css";
import { Header } from "../sections/Header";
import { Footer } from "../sections/Footer";
import { DownloadClient } from "./DownloadClient";

export const metadata: Metadata = {
  title: { absolute: "Baixar o Comet" },
  robots: { index: false, follow: false },
};

/**
 * Tela de download. Na referência o CTA aponta para um link inteligente (perplexity.sng.link)
 * que redireciona por sistema operacional; aqui a detecção é feita no cliente e cada plataforma
 * fica visível, para que o fluxo seja legível e reversível.
 */
export default function DownloadPage() {
  return (
    <div className={shared.page} lang="pt-BR">
      <Header />
      <main>
        <DownloadClient />
      </main>
      <Footer />
    </div>
  );
}
