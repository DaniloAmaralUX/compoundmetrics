// Pans / zooms a full-page screenshot so that a sections.json rectangle lands in a screen box.
// scale = min(boxW/(w+2·pad), boxH/(h+2·pad)); translate centres the target and is clamped so the
// image never shows its edge (STORYBOARD §0 rule 6). Motion between two targets is interpolated
// by `progress` (0..1) which the caller derives from the frame (spring-flat or decel).
import React from "react";
import { Img, staticFile } from "remotion";
import { resolveTarget, surfaceSrc, type Rect } from "../data/milestones";
import type { Box } from "./layout";

export type Target = { milestone: string; sectionKey: string; rect?: Rect };

const PAD = 48;

/** A target taller than the capture viewport is cropped to its top viewport-high band. */
const capToViewport = (rect: Rect, sectionKey: string): Rect => {
  const vh = sectionKey.includes(":mobile/") ? 844 : 900;
  return rect.height > vh ? { ...rect, height: vh } : rect;
};

export const fit = (box: Box, rect: Rect, page: { width: number; height: number }, push: number) => {
  const scale = Math.min(box.w / (rect.width + 2 * PAD), box.h / (rect.height + 2 * PAD)) * push;
  const iw = page.width * scale;
  const ih = page.height * scale;
  let tx = box.w / 2 - (rect.x + rect.width / 2) * scale;
  let ty = box.h / 2 - (rect.y + rect.height / 2) * scale;
  tx = iw >= box.w ? Math.min(0, Math.max(box.w - iw, tx)) : (box.w - iw) / 2;
  ty = ih >= box.h ? Math.min(0, Math.max(box.h - ih, ty)) : (box.h - ih) / 2;
  return { scale, tx, ty, iw, ih };
};

/** The first screen (viewport-high band from the top) of a surface, as a target rect. */
export const firstScreenRect = (milestone: string, sectionKey: string): Rect => {
  const { page } = resolveTarget(milestone, sectionKey);
  const ratio = sectionKey.includes(":mobile/") ? 844 / 390 : 900 / 1440;
  return { x: 0, y: 0, width: page.width, height: Math.min(page.height, page.width * ratio) };
};

type Props = {
  box: Box;
  target: Target;
  to?: Target;
  progress?: number;
  push?: number;
  opacity?: number;
  filter?: string;
  radius?: number;
  style?: React.CSSProperties;
};

export const CameraShot: React.FC<Props> = ({ box, target, to, progress = 0, push = 1, opacity = 1, filter, radius = 0, style }) => {
  const a = resolveTarget(target.milestone, target.sectionKey);
  const fa = fit(box, target.rect ?? capToViewport(a.rect, target.sectionKey), a.page, push);
  let { scale, tx, ty } = fa;
  if (to) {
    const b = resolveTarget(to.milestone, to.sectionKey);
    const fb = fit(box, to.rect ?? capToViewport(b.rect, to.sectionKey), b.page, push);
    scale = fa.scale + (fb.scale - fa.scale) * progress;
    tx = fa.tx + (fb.tx - fa.tx) * progress;
    ty = fa.ty + (fb.ty - fa.ty) * progress;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        overflow: "hidden",
        opacity,
        borderRadius: radius,
        filter,
        backgroundColor: "#111",
        ...style,
      }}
    >
      <Img
        src={staticFile(surfaceSrc(target.milestone, target.sectionKey))}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: a.page.width,
          height: a.page.height,
          transformOrigin: "0 0",
          translate: `${tx}px ${ty}px`,
          scale: `${scale}`,
          maxWidth: "none",
        }}
      />
    </div>
  );
};
