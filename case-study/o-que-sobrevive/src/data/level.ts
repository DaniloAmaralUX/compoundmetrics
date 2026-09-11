import { createContext, useContext } from "react"

/** The three reading depths the page offers, named after career stages. `pleno` is the default. */
export type Level = "junior" | "pleno" | "senior"

export const LEVELS: Array<{ id: Level; label: string; hint: string }> = [
  { id: "junior", label: "Júnior", hint: "Linguagem simples, sem termos técnicos." },
  { id: "pleno", label: "Pleno", hint: "Linguagem de trabalho, termos técnicos explicados." },
  { id: "senior", label: "Sênior", hint: "Linguagem técnica: perguntas, números e a fonte de cada afirmação." },
]

export const LevelContext = createContext<Level>("pleno")
export const useLevel = () => useContext(LevelContext)

/** Resolve a public asset against the document, so the Lifeline's absolute-URL comparisons hold wherever the page is served. */
export const asset = (path: string) =>
  typeof document === "undefined" ? path : new URL(path, document.baseURI).href
