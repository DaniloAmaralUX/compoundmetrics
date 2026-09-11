import { createContext, useContext } from "react"

/** The three reading depths the page offers. `colega` is the default. */
export type Level = "crianca" | "colega" | "especialista"

export const LEVELS: Array<{ id: Level; label: string; hint: string }> = [
  { id: "crianca", label: "Criança", hint: "Duas frases, uma metáfora, nenhum jargão." },
  { id: "colega", label: "Colega", hint: "O que aconteceu, em linguagem de trabalho." },
  { id: "especialista", label: "Especialista", hint: "Pergunta, construído, aprendido, desconhecido, fonte." },
]

export const LevelContext = createContext<Level>("colega")
export const useLevel = () => useContext(LevelContext)

/** Resolve a public asset against the document, so the Lifeline's absolute-URL comparisons hold wherever the page is served. */
export const asset = (path: string) =>
  typeof document === "undefined" ? path : new URL(path, document.baseURI).href
