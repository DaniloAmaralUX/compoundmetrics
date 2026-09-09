// A neutral browser (or phone) chrome around a CameraShot. The route string and the caption are
// data (sections.json route, milestones[].name); nothing else is typeset.
import React from "react";
import { C, FONT } from "../data/storyboard";
import type { Box } from "./layout";

type Props = {
  box: Box;
  route?: string;
  caption?: string;
  phone?: boolean;
  opacity?: number;
  children?: React.ReactNode;
};

export const BAR = 36;

export const BrowserFrame: React.FC<Props> = ({ box, route, caption, phone = false, opacity = 1, children }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: box.x - 1,
        top: box.y - (phone ? 18 : BAR) - 1,
        width: box.w + 2,
        height: box.h + (phone ? 36 : BAR) + 2,
        borderRadius: phone ? 40 : 10,
        border: `1px solid rgba(239,238,233,0.18)`,
        backgroundColor: "#141514",
        opacity,
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
      }}
    >
      {phone ? (
        <div style={{ position: "absolute", left: "50%", top: 6, translate: "-50% 0", width: 90, height: 6, borderRadius: 3, backgroundColor: "rgba(239,238,233,0.2)" }} />
      ) : (
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: BAR, display: "flex", alignItems: "center", gap: 8, padding: "0 14px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(239,238,233,0.2)" }} />
          ))}
          {route ? (
            <div style={{ marginLeft: 12, fontFamily: FONT.mono, fontSize: 13, color: C.muted, letterSpacing: "0.02em" }}>{route}</div>
          ) : null}
        </div>
      )}
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            marginTop: 10,
            fontFamily: FONT.mono,
            fontSize: 18,
            color: C.muted,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {caption}
        </div>
      ) : null}
      {children}
    </div>
  );
};
