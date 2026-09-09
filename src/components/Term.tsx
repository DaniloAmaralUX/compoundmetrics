import { conceptById } from "@/content/concepts";
import { ConceptLink } from "./ConceptLink";
import type { ReactNode } from "react";

/**
 * Server-side wrapper: looks the concept up once at build time and hands the client component only
 * the strings it needs. A term that does not exist in the Field Guide fails the build rather than
 * rendering a dead link.
 */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const c = conceptById(id);
  if (!c) throw new Error(`Term: unknown concept "${id}"`);
  return (
    <ConceptLink id={c.id} title={c.title} plain={c.oneSentence}>
      {children ?? c.title}
    </ConceptLink>
  );
}
