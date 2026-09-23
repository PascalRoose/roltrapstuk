import { ImageResponse } from "next/og";
import type { Lang } from "@/lib/types";

const OG_SIZE = { width: 1200, height: 630 };

const HEADLINE: Record<Lang, string> = {
  nl: "Roltrap & lift status",
  en: "Escalator & lift status",
};

/** The badge from the brand logo (see `public/icon.svg`), inlined for the renderer. */
function Logo({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="110 26 160 160" width={size} height={size}>
      <rect x="110" y="26" width="160" height="160" rx="38" fill="#FFD84D" />
      <polygon
        points="126,152 150,152 174,128 179,131 175,133 180,134 150,164 126,164"
        fill="#2E3A59"
      />
      <polygon
        points="196,106 228,74 252,74 252,86 228,86 202,112 197,109 201,107"
        fill="#2E3A59"
      />
      <g stroke="#8794B8" strokeWidth="2.5" strokeLinecap="round">
        <line x1="154" y1="148" x2="158" y2="152" />
        <line x1="162" y1="140" x2="166" y2="144" />
        <line x1="170" y1="132" x2="174" y2="136" />
        <line x1="206" y1="96" x2="210" y2="100" />
        <line x1="214" y1="88" x2="218" y2="92" />
        <line x1="222" y1="80" x2="226" y2="84" />
      </g>
      <path
        d="M128 150 L128 140 L152 140 L228 62 L250 62 L250 72"
        fill="none"
        stroke="#4A5B85"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="186" cy="118" r="3.5" fill="#E4443A" />
      <circle cx="193" cy="127" r="2.2" fill="#E4443A" />
    </svg>
  );
}

/** 1200×630 social preview, one per language (see the opengraph-image files). */
export function ogImage(lang: Lang): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: 88,
        background: "#F6F2E8",
        color: "#2E3A59",
      }}
    >
      <Logo size={300} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 40, color: "#4A5B85", letterSpacing: 6 }}>ROLTRAPSTUK</div>
        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05 }}>{HEADLINE[lang]}</div>
        <div style={{ fontSize: 44, color: "#55607C" }}>&rsquo;s-Hertogenbosch</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
