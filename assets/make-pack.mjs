#!/usr/bin/env node
// Admin-only photo-pack pipeline (founder ruling 2026-07-17: backend/admin, never user-facing).
//
//   node scripts/make-pack.mjs <master-image> [pack-name]
//
// Produces public/assets/packs/<name>/:
//   photo-640/1280/2048.webp + .avif, photo@1x/2x/3x.webp (AGENTS.md pipeline ruling)
//   palette.json      — extracted colors + derived ambient/tint/accent tokens
//   derivatives.json  — the LQIP
// and refreshes public/assets/packs/index.json.
//
// v3 (2026-08-21, FD-31): the LQIP left palette.json. A 24px inlined rendition
// of the licensed photograph is a rendition of the licensed photograph, so it
// belongs with the renditions and not with the token set —
// ../marketplace/SPEC.md §1.1: `palette` is the approved token set, thirteen
// fields, and `derivatives` is "the responsive image set and, since FD-31, the
// LQIP", delivered only to entitled accounts. The store document's
// `derivatives` field is assembled from this file plus the rendition files
// written beside it; keeping the LQIP in palette.json meant the palette — which
// §1.1 sends to unentitled browsers as preview material — carried a picture.
//
// v2 (2026-07-17): extraction via node-vibrant's semantic swatches (Android Palette port);
// derivation math in OKLCH via culori (perceptually uniform, unlike HSL); WCAG contrast
// gate on the accent; urgency-collision check via CIEDE2000 distance.

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { Vibrant } from "node-vibrant/node";
import { oklch, formatHex, wcagContrast, differenceCiede2000, parse } from "culori";

const [, , input, nameArg] = process.argv;
if (!input) {
  console.error("usage: node scripts/make-pack.mjs <master-image> [pack-name]");
  process.exit(1);
}
const name = (nameArg || path.parse(input).name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
const outDir = path.join("public/assets/packs", name);
fs.mkdirSync(outDir, { recursive: true });

// ---------- 1. responsive derivatives ----------
for (const w of [640, 1280, 2048]) {
  await sharp(input).resize({ width: w, kernel: sharp.kernel.lanczos3 }).webp({ quality: 85 }).toFile(`${outDir}/photo-${w}.webp`);
  await sharp(input).resize({ width: w, kernel: sharp.kernel.lanczos3 }).avif({ quality: 60 }).toFile(`${outDir}/photo-${w}.avif`);
}
for (const [alias, w] of [["1x", 640], ["2x", 1280], ["3x", 2048]]) {
  fs.copyFileSync(`${outDir}/photo-${w}.webp`, `${outDir}/photo@${alias}.webp`);
}
const lqip = `data:image/webp;base64,${(await sharp(input).resize({ width: 24 }).webp({ quality: 40 }).toBuffer()).toString("base64")}`;

// ---------- 2. extraction ----------
// overall luminance (sharp) → suggested appearance mode
const { data, info } = await sharp(input).resize(64, 64, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let lumSum = 0, satSum = 0;
for (let i = 0; i < data.length; i += 3) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  lumSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const mx = Math.max(r, g, b);
  satSum += mx === 0 ? 0 : (mx - Math.min(r, g, b)) / mx;
}
const px = info.width * info.height;
const luminance = +(lumSum / px / 255).toFixed(2);
const colorfulness = +(satSum / px).toFixed(2); // mean saturation — near 0 for monochrome photos

// semantic swatches (Vibrant/Muted × Dark/Light) — pre-classified extraction.
// Vibrant's decoder caps resolution, and palette extraction needs nowhere near full res:
// hand it a downscaled temp copy.
const os = await import("node:os");
const vibrantTmp = path.join(os.tmpdir(), `vibrant-${name}.jpg`);
await sharp(input).resize({ width: 512 }).jpeg({ quality: 90 }).toFile(vibrantTmp);
const swatches = await Vibrant.from(vibrantTmp).getPalette();
fs.unlinkSync(vibrantTmp);
const sw = (key) => (swatches[key] ? { hex: swatches[key].hex, population: swatches[key].population } : null);
const semantic = Object.fromEntries(
  ["Vibrant", "Muted", "DarkVibrant", "DarkMuted", "LightVibrant", "LightMuted"].map((k) => [k, sw(k)])
);
const totalPop = Object.values(semantic).reduce((s, v) => s + (v?.population ?? 0), 0) || 1;
const dominants = Object.values(semantic)
  .filter(Boolean)
  .sort((a, b) => b.population - a.population)
  .map((s) => ({ hex: s.hex, share: +(s.population / totalPop).toFixed(3) }));

// ---------- 3. derivation (OKLCH — perceptually uniform) ----------
const inOklch = (hex) => oklch(parse(hex));
const hexAt = (c, l, maxC) => formatHex({ mode: "oklch", l, c: Math.min(c.c ?? 0, maxC), h: c.h ?? 0 });

// ambient surrounds (the canvas): muted seeds, but the canvas must FOLLOW the photo —
// its darkness tracks the photo's luminance, and its color tracks the photo's
// colorfulness (a near-black, near-colorless photo gets a near-black, neutral canvas).
const darkSeed = inOklch((semantic.DarkMuted ?? semantic.Muted ?? dominants[0])?.hex ?? "#3d3d3d");
const lightSeed = inOklch((semantic.LightMuted ?? semantic.Muted ?? dominants[0])?.hex ?? "#e8e8e8");
const sat3 = Math.min(1, colorfulness * 3);
const cCap = 0.035 * sat3;
// Dark end (founder ruling 2026-07-24, ambient-floor tryout): a colorful dark photo
// keeps its hue visible — lightness and chroma floors rise with colorfulness, the
// lightness floor scaled back by luminance so a near-black photo stays near-black.
const dL = Math.max(Math.min(0.26, 0.1 + luminance * 0.35), 0.1 + 0.13 * sat3 * Math.min(1, luminance / 0.15));
const dCap = Math.max(cCap, 0.09 * sat3);
const lL = Math.max(0.9, 0.97 - (1 - luminance) * 0.05);
const ambientDark = [hexAt(darkSeed, dL, dCap), hexAt(darkSeed, Math.max(0.07, dL - 0.06), dCap)];
const ambientLight = [hexAt(lightSeed, lL, cCap), hexAt(lightSeed, lL - 0.04, cCap)];

// accent: the Vibrant swatch, if the photo really has one
const URGENCY = ["#b5ead7", "#ffdca8", "#ff8a75"]; // calm, attention, alarm — color means urgency, never decoration
const dE = differenceCiede2000();
let accent = null, accentDeep = null, accentNote = "theme default";
const accentSeed = semantic.Vibrant ?? semantic.DarkVibrant ?? semantic.LightVibrant;
if (accentSeed) {
  const c = inOklch(accentSeed.hex);
  if ((c.c ?? 0) > 0.06 && accentSeed.population / totalPop > 0.02) {
    // normalize for UI duty, then walk darker until white text passes WCAG 3:1
    let cand = { mode: "oklch", l: 0.62, c: Math.min(c.c, 0.15), h: c.h ?? 0 };
    while (wcagContrast("#ffffff", formatHex(cand)) < 3 && cand.l > 0.35) cand.l -= 0.02;
    const candHex = formatHex(cand);
    // per-skin urgency marks are lightness-walked from these hues (app/DESIGN §Colour),
    // so the collision check must be lightness-invariant: compare at the candidate's own L
    const collision = URGENCY.find((u) => dE(parse(candHex), parse(formatHex({ ...inOklch(u), l: cand.l }))) < 12);
    if (collision) {
      accentNote = `rejected: too close to urgency ${collision}`;
    } else {
      accent = candHex;
      accentDeep = formatHex({ ...cand, l: cand.l - 0.1 });
      accentNote = "derived";
    }
  } else {
    accentNote = "rejected: too grey or too rare";
  }
}

const palette = {
  name,
  master: path.basename(input),
  luminance,
  colorfulness,
  suggestedMode: luminance < 0.45 ? "dark" : "light",
  dominants,
  semantic: Object.fromEntries(Object.entries(semantic).map(([k, v]) => [k, v?.hex ?? null])),
  accent,
  accentDeep,
  ambientDark,
  ambientLight,
  tintDarkAlpha: +Math.min(0.3 + luminance * 0.35, 0.6).toFixed(2),
  tintLightAlpha: +Math.min(0.35 + (1 - luminance) * 0.3, 0.65).toFixed(2),
};
fs.writeFileSync(`${outDir}/palette.json`, JSON.stringify(palette, null, 2));
fs.writeFileSync(`${outDir}/derivatives.json`, JSON.stringify({ name, lqip }, null, 2));

// ---------- 4. refresh the pack index ----------
const packsRoot = "public/assets/packs";
const ids = fs.readdirSync(packsRoot).filter((d) => fs.existsSync(path.join(packsRoot, d, "palette.json"))).sort();
fs.writeFileSync(path.join(packsRoot, "index.json"), JSON.stringify({ packs: ids }, null, 2));

console.log(`pack "${name}" → ${outDir}`);
console.log(`  luminance ${luminance} → suggested ${palette.suggestedMode}`);
console.log(`  semantic ${Object.entries(palette.semantic).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(" ")}`);
console.log(`  accent ${accent ?? "(none)"} — ${accentNote}`);
console.log(`  ambientDark ${ambientDark.join(" ")}  ambientLight ${ambientLight.join(" ")}`);
console.log(`  index: ${ids.join(", ")}`);
