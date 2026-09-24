/**
 * Generates the themed placeholder product SVGs (one per category) into
 * public/products/. Run with:  node scripts/generate-product-svgs.mjs
 *
 * The seed data references these files (e.g. /products/processors.svg),
 * so the store always has an on-brand image for every product.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "products");

const W = 600;
const H = 600;

/** Grid overlay lines across the canvas. */
function gridLines() {
  const lines = [];
  for (let x = 60; x < W; x += 60) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" />`);
  }
  for (let y = 60; y < H; y += 60) {
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" />`);
  }
  return lines.join("");
}

function wrap(glyph) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d0b15"/>
      <stop offset="0.5" stop-color="#171326"/>
      <stop offset="1" stop-color="#0d0b15"/>
    </linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c29dd"/>
      <stop offset="1" stop-color="#a84dff"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.62">
      <stop offset="0" stop-color="#7c29dd" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#7c29dd" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g stroke="rgba(255,255,255,0.045)" stroke-width="1">${gridLines()}</g>
  <g transform="translate(300 300)">${glyph}</g>
</svg>
`;
}

/* ------------------------- glyphs ------------------------- */

const G_STROKE = 'fill="none" stroke="url(#g)" stroke-width="10"';
const SOFT = 'fill="none" stroke="#e9e5f6" stroke-width="5"';
const SOFT_FILL = 'fill="#e9e5f6"';
const DIM_FILL = 'fill="#3a2f63"';

/**
 * Same strokes with an explicit width. XML forbids duplicate attributes,
 * so these must be used instead of appending `stroke-width="..."` after
 * G_STROKE/SOFT (which already carry one) — duplicate attributes make the
 * whole SVG fail to parse and render as a broken image.
 */
const gStroke = (w) => `fill="none" stroke="url(#g)" stroke-width="${w}"`;
const softStroke = (w) => `fill="none" stroke="#e9e5f6" stroke-width="${w}"`;

const glyphs = {
  processors: `
    <rect x="-110" y="-110" width="220" height="220" rx="26" ${G_STROKE}/>
    <rect x="-74" y="-74" width="148" height="148" rx="14" ${SOFT}/>
    <rect x="-34" y="-34" width="68" height="68" rx="8" ${SOFT_FILL} opacity="0.85"/>
    <rect x="-34" y="-34" width="68" height="68" rx="8" fill="url(#g)" opacity="0.9"/>
    ${[-110, -66, -22, 22, 66].map((p) => `
      <rect x="${p - 9}" y="-150" width="18" height="40" rx="4" fill="url(#g)"/>
      <rect x="${p - 9}" y="110" width="18" height="40" rx="4" fill="url(#g)"/>
      <rect x="-150" y="${p - 9}" width="40" height="18" rx="4" fill="url(#g)"/>
      <rect x="110" y="${p - 9}" width="40" height="18" rx="4" fill="url(#g)"/>
    `).join("")}
  `,

  motherboards: `
    <rect x="-120" y="-90" width="240" height="180" rx="16" ${G_STROKE}/>
    <line x1="-120" y1="-24" x2="120" y2="-24" ${SOFT}/>
    <line x1="-120" y1="28" x2="120" y2="28" ${SOFT}/>
    <line x1="-40" y1="-90" x2="-40" y2="90" ${SOFT}/>
    <line x1="56" y1="-90" x2="56" y2="90" ${SOFT}/>
    <rect x="-108" y="-78" width="16" height="120" rx="3" fill="url(#g)" opacity="0.85"/>
    <rect x="-80" y="-78" width="16" height="96" rx="3" fill="url(#g)" opacity="0.85"/>
    <rect x="96" y="-70" width="18" height="140" rx="4" fill="url(#g)"/>
    <circle cx="-92" cy="62" r="10" fill="url(#g)"/>
    <circle cx="-56" cy="62" r="10" fill="url(#g)"/>
    <circle cx="-20" cy="62" r="10" fill="url(#g)"/>
    <circle cx="80" cy="62" r="6" fill="#e9e5f6"/>
  `,

  "graphics-cards-gpu": `
    <rect x="-130" y="-70" width="260" height="140" rx="16" ${G_STROKE}/>
    <rect x="70" y="-70" width="60" height="140" rx="4" fill="url(#g)" opacity="0.85"/>
    <circle cx="-78" cy="0" r="38" ${gStroke(8)}/>
    <circle cx="-78" cy="0" r="8" ${SOFT_FILL}/>
    <path d="M -78 -38 A 38 38 0 0 1 -40 0" ${SOFT}/>
    <path d="M -78 38 A 38 38 0 0 1 -116 0" ${SOFT}/>
    <circle cx="20" cy="0" r="30" ${gStroke(7)}/>
    <circle cx="20" cy="0" r="7" ${SOFT_FILL}/>
    <rect x="-48" y="-132" width="10" height="26" rx="3" fill="#e9e5f6"/>
  `,

  ram: `
    <rect x="-112" y="-84" width="88" height="150" rx="10" ${G_STROKE}/>
    <rect x="-16" y="-84" width="88" height="150" rx="10" ${G_STROKE}/>
    <rect x="40" y="-84" width="88" height="150" rx="10" fill="url(#g)" opacity="0.16"/>
    <rect x="40" y="-84" width="88" height="150" rx="10" ${SOFT}/>
    ${[86, 56, 26, -4].map((y) => `
      <rect x="-100" y="${y}" width="64" height="9" rx="2" fill="url(#g)" opacity="0.85"/>
      <rect x="52" y="${y}" width="64" height="9" rx="2" fill="url(#g)" opacity="0.85"/>
    `).join("")}
    <rect x="-60" y="-150" width="16" height="34" rx="4" fill="#e9e5f6"/>
    <rect x="36" y="-150" width="16" height="34" rx="4" fill="#e9e5f6"/>
  `,

  storage: `
    <rect x="-120" y="-88" width="240" height="176" rx="18" ${G_STROKE}/>
    <circle cx="-44" cy="0" r="46" ${gStroke(9)}/>
    <circle cx="-44" cy="0" r="14" fill="url(#g)"/>
    <path d="M -44 -46 A 46 46 0 0 1 2 0" ${SOFT}/>
    ${[-62, -26].map((x) => `<rect x="${x}" y="14" width="28" height="9" rx="4" fill="url(#g)"/>`).join("")}
    <rect x="70" y="-40" width="34" height="9" rx="4" fill="url(#g)"/>
    <rect x="70" y="-18" width="34" height="9" rx="4" fill="url(#g)"/>
    <rect x="70" y="4" width="34" height="9" rx="4" fill="url(#g)" opacity="0.7"/>
    <rect x="70" y="26" width="34" height="9" rx="4" fill="url(#g)" opacity="0.7"/>
  `,

  "power-supplies": `
    <rect x="-120" y="-100" width="240" height="200" rx="18" ${G_STROKE}/>
    <circle cx="0" cy="-18" r="52" ${gStroke(8)}/>
    <circle cx="0" cy="-18" r="12" fill="url(#g)"/>
    ${[0, 60, 120, 180, 240, 300].map((deg) => `
      <ellipse cx="0" cy="-52" rx="14" ry="34" transform="rotate(${deg})" ${softStroke(5)}/>
    `).join("")}
    ${[-96, -60, -24, 12, 48, 84].map((y) => (y > -96 ? `
      <rect x="-96" y="${y}" width="192" height="8" rx="4" fill="url(#g)" opacity="0.75"/>
    ` : "")).join("")}
  `,

  cooling: `
    <circle cx="0" cy="0" r="88" ${gStroke(11)}/>
    <circle cx="0" cy="0" r="58" ${softStroke(4)}/>
    <circle cx="0" cy="0" r="16" fill="url(#g)"/>
    ${[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map((deg) => `
      <path d="M 0 -58 Q 30 -92 58 -58" transform="rotate(${deg})" ${softStroke(6)}/>
    `).join("")}
    <rect x="-30" y="88" width="60" height="34" rx="8" fill="url(#g)"/>
    <line x1="0" y1="122" x2="0" y2="142" ${gStroke(8)}/>
  `,

  "pc-cases": `
    <rect x="-104" y="-130" width="208" height="260" rx="16" ${G_STROKE}/>
    <rect x="-84" y="-110" width="84" height="180" rx="10" fill="url(#g)" opacity="0.14"/>
    <rect x="-84" y="-110" width="84" height="180" rx="10" ${SOFT}/>
    <rect x="-84" y="84" width="168" height="34" rx="8" fill="url(#g)" opacity="0.85"/>
    <rect x="12" y="-84" width="72" height="30" rx="6" ${SOFT}/>
    <circle cx="30" cy="-18" r="4" fill="#74dd38"/>
    <rect x="12" y="12" width="72" height="26" rx="6" ${SOFT}/>
    <rect x="12" y="50" width="72" height="22" rx="6" ${SOFT}/>
  `,

  monitors: `
    <rect x="-130" y="-92" width="260" height="164" rx="14" ${G_STROKE}/>
    <rect x="-118" y="-80" width="236" height="140" rx="10" fill="url(#g)" opacity="0.12"/>
    <rect x="-118" y="-80" width="236" height="140" rx="10" ${softStroke(3)}/>
    <path d="M 0 72 L 0 118" ${gStroke(9)}/>
    <path d="M -58 118 L 58 118" ${gStroke(9)}/>
    <path d="M -58 118 Q 0 132 58 118" ${gStroke(9)}/>
    <line x1="-84" y1="-44" x2="84" y2="-44" stroke="#e9e5f6" stroke-width="6" stroke-linecap="round"/>
    <line x1="-84" y1="-18" x2="60" y2="-18" stroke="#7c29dd" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
  `,

  peripherals: `
    <rect x="-150" y="10" width="232" height="88" rx="12" ${G_STROKE}/>
    <g ${softStroke(5)}>
      <line x1="-118" y1="-8" x2="-118" y2="82"/>
      <line x1="-46" y1="-8" x2="-46" y2="82"/>
      <line x1="26" y1="-8" x2="26" y2="82"/>
      <line x1="98" y1="-8" x2="98" y2="82"/>
      <line x1="-150" y1="26" x2="82" y2="26"/>
      <line x1="-150" y1="54" x2="82" y2="54"/>
    </g>
    <rect x="122" y="-8" width="46" height="62" rx="8" fill="url(#g)" opacity="0.9"/>
    <rect x="-34" y="-150" width="96" height="124" rx="34" ${G_STROKE}/>
    <rect x="-34" y="-150" width="96" height="124" rx="34" fill="url(#g)" opacity="0.1"/>
    <line x1="14" y1="-150" x2="14" y2="-30" ${softStroke(4)}/>
    <circle cx="14" cy="-106" r="16" ${softStroke(5)}/>
    <circle cx="14" cy="-106" r="5" fill="url(#g)"/>
  `,
};

mkdirSync(OUT_DIR, { recursive: true });

for (const [slug, glyph] of Object.entries(glyphs)) {
  const file = join(OUT_DIR, `${slug}.svg`);
  writeFileSync(file, wrap(glyph.trim()));
  console.log(`wrote ${file}`);
}

console.log(`\nDone — ${Object.keys(glyphs).length} SVGs in ${OUT_DIR}`);