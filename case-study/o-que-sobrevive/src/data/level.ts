import { createContext, useContext } from "react"

/** The three reading depths the page offers. `colega` is the default. */
export type Level = "crianca" | "colega" | "especialista"

export const LEVELS: Array<{ id: Level; label: string; hint: string }> = [
  { id: "crianca", label: "Criança", hint: "Linguagem simples, sem termos técnicos." },
  { id: "colega", label: "Colega", hint: "Linguagem de trabalho, termos técnicos explicados." },
  { id: "especialista", label: "Especialista", hint: "Linguagem técnica: perguntas, números e fontes literais." },
]

export const LevelContext = createContext<Level>("colega")
export const useLevel = () => useContext(LevelContext)

/** Resolve a public asset against the document, so the Lifeline's absolute-URL comparisons hold wherever the page is served. */
export const asset = (path: string) =>
  typeof document === "undefined" ? path : new URL(path, document.baseURI).href
