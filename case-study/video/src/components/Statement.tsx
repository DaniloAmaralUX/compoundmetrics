// Typographic key phrase (§26). Enters with letter-spacing +0.04em → 0 over 18 f (decel),
// optionally exits over 10 f (accel). Every motion is a function of the current frame.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, accel, decel } from "../data/storyboard";

type Props = {
  text: string;
  from?: number;
  exitAt?: number;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  weight?: number;
  maxWidth?: number | string;
  style?: React.CSSProperties;
  mono?: boolean;
};

export const Statement: React.FC<Props> = ({
  text,
  from = 0,
  exitAt,
  size = 64,
  color = C.ink,
  align = "left",
  weight = 500,
  maxWidth,
  style,
  mono = false,
}) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const enter = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const exit = exitAt === undefined ? 1 : interpolate(frame, [exitAt, exitAt + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: accel });
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.15,
        color,
        textAlign: align,
        maxWidth,
        opacity: enter * exit,
        letterSpacing: `${(1 - enter) * 0.04}em`,
        translate: `0px ${(1 - enter) * 12}px`,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Small mono label (L.* data labels). */
export const Label: React.FC<{
  text: string;
  from?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
}> = ({ text, from = 0, size = 22, color = C.muted, style, align = "left" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - from, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FONT.mono,
        fontSize: size,
        color,
        opacity: o,
        lineHeight: 1.4,
        textAlign: align,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
