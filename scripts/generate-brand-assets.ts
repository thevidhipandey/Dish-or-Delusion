/**
 * Generates the brand assets that are not dish photography:
 *   public/favicon.ico        - 256x256 chef-hat + question-mark mark
 *   public/icon-192.png       - PWA / manifest icon
 *   public/icon-512.png       - PWA / manifest icon
 *   public/apple-touch-icon.png - 180x180, no transparency (iOS masks corners)
 *   public/og-image.jpg       - 1200x630 social preview card
 *
 * Everything is drawn from the SVG below so the artwork is reproducible and the
 * dish contact sheet stays the single source of dish photography (see AGENTS.md).
 *
 * Usage: bun run generate:brand
 *
 * NOTE: the social card wordmark needs Abril Fatface (the app's display font).
 * This script downloads it into ~/.fonts on first run and points fontconfig at
 * it, because the container ships with no fonts at all. If the download fails
 * the shapes still render and only the wordmark is dropped -- `assertWordmark`
 * turns that silent degradation into a hard error.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const FONT_DIR = join(homedir(), ".fonts");
const FONT_FILE = join(FONT_DIR, "AbrilFatface-Regular.ttf");
const FONTCONFIG_FILE = join(homedir(), ".config", "fontconfig", "fonts.conf");
const FONT_URL = "https://github.com/google/fonts/raw/main/ofl/abrilfatface/AbrilFatface-Regular.ttf";

/** Palette, matched to the app's dark violet theme plus its warm accent. */
const INK = "#170733";
const VIOLET_DEEP = "#2A0F55";
const VIOLET = "#3C1A73";
const LILAC = "#A97BFF";
const HAT_TOP = "#FFF3D0";
const HAT_BOTTOM = "#F0D89A";
const GOLD = "#FFC24D";
const GOLD_DEEP = "#F2A93B";

if (!existsSync(FONT_FILE)) {
  mkdirSync(FONT_DIR, { recursive: true });
  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error(`could not download Abril Fatface: HTTP ${res.status}`);
  writeFileSync(FONT_FILE, Buffer.from(await res.arrayBuffer()));
  console.log(`fetched Abril Fatface -> ${FONT_FILE}`);
}

mkdirSync(join(homedir(), ".config", "fontconfig"), { recursive: true });
writeFileSync(
  FONTCONFIG_FILE,
  `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig>\n  <dir>${FONT_DIR}</dir>\n  <cachedir>${homedir()}/.cache/fontconfig</cachedir>\n</fontconfig>\n`,
);
process.env.FONTCONFIG_FILE = FONTCONFIG_FILE;

const { default: sharp } = await import("sharp");

/** The chef-hat + question-mark logo, drawn in a 512x512 box. */
function mark(hatFill: string, hatTop: string, qmFill: string, dotFill: string): string {
  return `
  <g>
    <circle cx="196" cy="196" r="74" fill="${hatFill}"/>
    <circle cx="316" cy="196" r="74" fill="${hatFill}"/>
    <circle cx="256" cy="168" r="88" fill="${hatFill}"/>
    <rect x="168" y="236" width="176" height="86" rx="30" fill="${hatFill}"/>
    <path d="M 180 248 a 76 60 0 0 1 152 0 a 76 76 0 0 0 -152 0 z" fill="${hatTop}" opacity="0.55"/>
  </g>
  <g>
    <path d="M 200 352 c 0 -40 30 -64 60 -64 c 36 0 62 24 62 56 c 0 34 -32 42 -32 70"
          fill="none" stroke="${qmFill}" stroke-width="34" stroke-linecap="round"/>
    <circle cx="290" cy="442" r="20" fill="${dotFill}"/>
  </g>`;
}

const defs = `
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${VIOLET}"/>
    <stop offset="0.55" stop-color="${VIOLET_DEEP}"/>
    <stop offset="1" stop-color="${INK}"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.3" r="0.66">
    <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="hatg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${HAT_TOP}"/>
    <stop offset="1" stop-color="${HAT_BOTTOM}"/>
  </linearGradient>
  <linearGradient id="qmg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#D9C7FF"/>
    <stop offset="1" stop-color="${LILAC}"/>
  </linearGradient>
  <linearGradient id="goldg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${GOLD}"/>
    <stop offset="1" stop-color="${GOLD_DEEP}"/>
  </linearGradient>
  <linearGradient id="cardbg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${VIOLET}"/>
    <stop offset="0.5" stop-color="#220B47"/>
    <stop offset="1" stop-color="${INK}"/>
  </linearGradient>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>${defs}</defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect width="512" height="512" rx="112" fill="url(#glow)"/>
  <g fill="none" stroke="${LILAC}" stroke-opacity="0.16" stroke-linecap="round">
    <path d="M 84 322 A 176 176 0 0 1 428 296" stroke-width="11"/>
    <path d="M 108 386 A 224 224 0 0 1 440 356" stroke-width="7"/>
  </g>
  ${mark("url(#hatg)", HAT_TOP, "url(#qmg)", "#F3E9FF")}
</svg>`;

/** A four-point sparkle. */
function sparkle(cx: number, cy: number, r: number, fill: string, opacity = 0.9): string {
  return `<path d="M ${cx} ${cy - r} Q ${cx + r * 0.16} ${cy - r * 0.16} ${cx + r} ${cy} Q ${cx + r * 0.16} ${cy + r * 0.16} ${cx} ${cy + r} Q ${cx - r * 0.16} ${cy + r * 0.16} ${cx - r} ${cy} Q ${cx - r * 0.16} ${cy - r * 0.16} ${cx} ${cy - r} Z" fill="${fill}" opacity="${opacity}"/>`;
}

/** Stylised taco. */
function taco(): string {
  return `<g>
    <path d="M -72 34 a 72 72 0 0 1 144 0 z" fill="#F2BE6B"/>
    <path d="M -72 34 q 10 -17 22 -4 q 12 -17 24 -2 q 12 -17 24 -2 q 12 -17 24 -2 q 10 -17 22 -4 l 0 11 l -140 0 z" fill="#6FC26F"/>
    <circle cx="-34" cy="18" r="8" fill="#E4573D"/>
    <circle cx="6" cy="10" r="8" fill="#E4573D"/>
    <circle cx="40" cy="20" r="8" fill="#E4573D"/>
    <path d="M -66 6 a 66 66 0 0 1 132 0 z" fill="#FFFFFF" opacity="0.12"/>
  </g>`;
}

/** Stylised burger. */
function burger(): string {
  return `<g>
    <path d="M -74 -4 a 74 58 0 0 1 148 0 z" fill="#E9A94D"/>
    <ellipse cx="-30" cy="-36" rx="8" ry="4.5" fill="${HAT_TOP}" transform="rotate(-18 -30 -36)"/>
    <ellipse cx="14" cy="-44" rx="8" ry="4.5" fill="${HAT_TOP}"/>
    <ellipse cx="46" cy="-26" rx="8" ry="4.5" fill="${HAT_TOP}" transform="rotate(14 46 -26)"/>
    <path d="M -78 2 q 13 15 26 0 q 13 15 26 0 q 13 15 26 0 q 13 15 26 0 q 13 15 26 0 l 0 13 l -130 0 z" fill="#7BC96F"/>
    <rect x="-76" y="16" width="152" height="26" rx="13" fill="#6B3B21"/>
    <path d="M -74 44 h 148 a 21 21 0 0 1 -21 21 h -106 a 21 21 0 0 1 -21 -21 z" fill="#E9A94D"/>
  </g>`;
}

/** Stylised noodle bowl with chopsticks. */
function noodles(): string {
  return `<g>
    <path d="M -62 2 q -24 -34 4 -48 q 28 -14 38 8 q 12 22 -6 36" fill="none" stroke="#F5D98C" stroke-width="10" stroke-linecap="round"/>
    <path d="M -26 -4 q 26 -32 56 -22" fill="none" stroke="#F5D98C" stroke-width="10" stroke-linecap="round"/>
    <rect x="30" y="-74" width="9" height="80" rx="4.5" fill="#C98A4B" transform="rotate(13 34 -34)"/>
    <rect x="48" y="-74" width="9" height="80" rx="4.5" fill="#C98A4B" transform="rotate(19 52 -34)"/>
    <ellipse cx="0" cy="4" rx="74" ry="17" fill="#EFE6D6"/>
    <path d="M -72 4 a 72 62 0 0 0 144 0 z" fill="#F9F3E7"/>
    <path d="M -50 34 a 50 44 0 0 0 100 0 z" fill="#E6DCC8"/>
  </g>`;
}

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>${defs}</defs>
  <rect width="1200" height="630" fill="url(#cardbg)"/>
  <ellipse cx="600" cy="180" rx="470" ry="270" fill="#8B5CF6" opacity="0.16"/>
  <g fill="none" stroke="${LILAC}" stroke-opacity="0.12" stroke-linecap="round">
    <path d="M 60 470 A 420 420 0 0 1 1140 452" stroke-width="10"/>
    <path d="M 120 556 A 500 500 0 0 1 1200 528" stroke-width="6"/>
  </g>
  ${sparkle(150, 120, 26, GOLD, 0.85)}
  ${sparkle(1058, 150, 20, HAT_TOP, 0.7)}
  ${sparkle(238, 470, 18, GOLD, 0.6)}
  ${sparkle(1004, 470, 24, HAT_TOP, 0.55)}
  ${sparkle(330, 92, 13, GOLD, 0.5)}
  ${sparkle(884, 86, 15, HAT_TOP, 0.5)}
  <g transform="translate(442,14) scale(0.62)">
    ${mark("url(#hatg)", HAT_TOP, "url(#qmg)", "#F3E9FF")}
  </g>
  <g transform="translate(196,352) rotate(-13) scale(0.86)">${taco()}</g>
  <g transform="translate(1004,336) rotate(11) scale(0.9)">${burger()}</g>
  <g transform="translate(232,486) rotate(9) scale(0.62)">${taco()}</g>
  <g transform="translate(984,492) rotate(-8) scale(0.66)">${noodles()}</g>
  <rect x="330" y="516" width="540" height="86" rx="43" fill="${INK}" opacity="0.42"/>
  <text x="600" y="580" text-anchor="middle" font-family="Abril Fatface" font-size="76" letter-spacing="3">
    <tspan fill="${HAT_TOP}">DISH </tspan><tspan fill="${GOLD}" font-size="50">OF </tspan><tspan fill="url(#goldg)">DELUSION</tspan>
  </text>
</svg>`;

const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });

const favicon512 = await sharp(Buffer.from(faviconSvg)).png().toBuffer();
const ogImage = await sharp(Buffer.from(ogSvg)).jpeg({ quality: 88, chromaSubsampling: "4:4:4" }).toBuffer();

/** Fails loudly if the wordmark silently dropped because no font was found. */
async function assertWordmark(png: Buffer): Promise<void> {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let cream = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] as number;
    const g = data[i + 1] as number;
    const b = data[i + 2] as number;
    // The "DISH" run is warm cream; the dark plate behind it is violet.
    if (r > 225 && g > 215 && b > 170 && b < 225) cream++;
  }
  if (cream < 1500) {
    throw new Error(
      `wordmark did not render (cream pixels=${cream}). Abril Fatface was not picked up by fontconfig.`,
    );
  }
  console.log(`wordmark rendered: ${cream} cream pixels`);
}

await assertWordmark(await sharp(ogImage).png().toBuffer());

/** Wrap a PNG in a single-image ICO container. */
function ico(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

const favicon256 = await sharp(favicon512).resize(256, 256).png().toBuffer();
writeFileSync(join(outDir, "favicon.ico"), ico(favicon256, 256));
writeFileSync(join(outDir, "icon-192.png"), await sharp(favicon512).resize(192, 192).png().toBuffer());
writeFileSync(join(outDir, "icon-512.png"), favicon512);
// iOS composites transparent pixels onto black, so the touch icon stays opaque.
writeFileSync(join(outDir, "apple-touch-icon.png"), await sharp(favicon512).resize(180, 180).flatten({ background: INK }).png().toBuffer());
writeFileSync(join(outDir, "og-image.jpg"), ogImage);

for (const f of ["favicon.ico", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "og-image.jpg"]) {
  const { size } = await Bun.file(join(outDir, f)).stat ? { size: (await Bun.file(join(outDir, f)).stat()).size } : { size: 0 };
  console.log(`wrote public/${f} (${size} bytes)`);
}
