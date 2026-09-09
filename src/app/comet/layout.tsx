import type { Viewport } from "next";

/** As rotas /comet ficam fora do shell do site: tema claro e sem cabeçalho/rodapé do Compound Design. */
export const viewport: Viewport = {
  themeColor: "#fbfaf4",
  colorScheme: "light",
};

export default function CometLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
