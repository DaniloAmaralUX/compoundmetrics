// Frame geometry shared by scenes and components. Only sizes and frame timings live here.
import { useVideoConfig } from "remotion";
import type { Shot } from "../data/storyboard";

export type Box = { x: number; y: number; w: number; h: number };

export const useLayout = () => {
  const { width: W, height: H, fps } = useVideoConfig();
  const vertical = H > W;
  const safe = vertical ? { x: 72, y: 120 } : { x: 96, y: 96 };
  const railH = 56;
  const railInset = 24;
  // Text safe area ends 96 px above the bottom (rail is 56 px, 24 px inset) in 16:9.
  const textBottom = vertical ? 0 : railInset + railH + 96;
  return {
    W,
    H,
    fps,
    vertical,
    safe,
    railH,
    railInset,
    textBottom,
    headline: vertical ? 44 : 64,
    body: vertical ? 32 : 40,
    mono: vertical ? 20 : 22,
    small: vertical ? 16 : 18,
    /** Where a match-cut target lands on screen for a sections.json key (STORYBOARD MS-04..06). */
    boxForKey: (sectionKey: string): Box => {
      if (vertical) return { x: 150, y: 200, w: 780, h: 860 };
      if (sectionKey.endsWith("/nav")) return { x: (W - 1400) / 2, y: 120, w: 1400, h: 300 };
      if (sectionKey.endsWith("/primary_action")) return { x: (W - 560) / 2, y: (H - 160) / 2 - 140, w: 560, h: 160 };
      return { x: (W - 1500) / 2, y: 110, w: 1500, h: 640 };
    },
    /** Full-frame image box (leaves the rail free). */
    fullBox: (): Box => (vertical ? { x: 150, y: 200, w: 780, h: 860 } : { x: 0, y: 0, w: W, h: H - railInset - railH - 16 }),
  };
};

/** Which source of a cut-shot is on screen at an absolute frame (used by scene and constellation). */
export const cutIndex = (shot: Shot, frame: number): number => {
  const n = shot.sources.length;
  if (n === 0) return -1;
  const per = (shot.end - shot.start) / n;
  return Math.max(0, Math.min(n - 1, Math.floor((frame - shot.start) / per)));
};

/** Local frame at which the k-th of n T.* phrases of a shot appears (evenly distributed). */
export const textStart = (shot: Shot, k: number, n: number): number =>
  Math.round(((shot.end - shot.start) * k) / Math.max(n, 1));
