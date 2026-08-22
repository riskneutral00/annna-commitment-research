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

const augment = process.argv.includes("--augment");
const [input, nameArg] = process.argv.slice(2).filter((a) => a !== "--augment");
if (!input) {
  console.error("usage: node scripts/make-pack.mjs [--augment] <master-image> [pack-name]");
  process.exit(1);
}
const name = (nameArg || path.parse(input).name).toLowerCase().replace(/[^a-z0-9]+/g, "-");

// ---------- augment mode (2026-08-22 — the V1 fix's code half) ----------
// Measures brightestRegion AND darkestRegion from the master and derives veil
// per app/DESIGN.md §Appearance (by mode, one law in two directions, 18%
// DarkMuted carry); writes ONLY those three keys into the tracked pack's
// palette.json, so augmentation never churns the thirteen measured fields of an
// existing pack. Re-cut 2026-08-22 (review U-048/U-049): each branch binds its
// own worst case — the dark branch caps over the brightest region (highest
// composite), the light branch floors over the DARKEST region (lowest
// composite); the light branch previously read the brightest region, the
// loosest extreme of its own constraint, so every darker region composited
// below the solved floor and A12's two-extreme install door refused the
// derivation's own output. darkestRegion is the sixteenth stored field
// (../marketplace/SPEC.md §1.1) so a bought skin can run its own install floors.
if (augment) {
  const palettePath = path.join("assets/packs", name, "palette.json");
  const pal = JSON.parse(fs.readFileSync(palettePath, "utf8"));

  // brightest/darkest region: mean sRGB of the extreme cells of an 8×8 grid
  // over the photograph — the regions a glass plate must survive compositing over.
  // ponytail: 64×64 downsample, 8px cells — the law names a region, not a resolution
  const GRID = 8, CELL = 8;
  const { data: px, info: gi } = await sharp(input)
    .resize(GRID * CELL, GRID * CELL, { fit: "cover" }).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  let best = null, worst = null;
  for (let cy = 0; cy < GRID; cy++) for (let cx = 0; cx < GRID; cx++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = cy * CELL; y < (cy + 1) * CELL; y++) for (let x = cx * CELL; x < (cx + 1) * CELL; x++) {
      const i = (y * gi.width + x) * 3;
      r += px[i]; g += px[i + 1]; b += px[i + 2]; n++;
    }
    r /= n; g /= n; b /= n;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (!best || lum > best.lum) best = { r, g, b, lum };
    if (!worst || lum < worst.lum) worst = { r, g, b, lum };
  }
  const toHex = (r, g, b) =>
    "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
  const brightestRegion = toHex(best.r, best.g, best.b);
  const darkestRegion = toHex(worst.r, worst.g, worst.b);

  // veil, by mode. Plate alphas are the FD-41 quiet-glass engaged values.
  const PLATE_DARK = 0.6, PLATE_LIGHT = 0.78;
  let v;
  if (pal.suggestedMode === "dark") {
    // a plate composited over the brightest region must not exceed rgb(92)
    v = (92 - (1 - PLATE_DARK) * best.lum) / PLATE_DARK;
  } else {
    // the composite over the DARKEST region must not fall below the value where
    // the pack's ink clears 4.5:1 engaged (each branch binds its own worst case)
    const relLum = (hex) => {
      const c = parse(hex);
      const f = (u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const inkL = relLum(pal.ambientDark[1]); // the light pack's ink seed
    const Lmin = 4.5 * (inkL + 0.05) - 0.05; // minimum composite relative luminance
    const invF = (L) => 255 * (L <= 0.0031308 ? L * 12.92 : 1.055 * L ** (1 / 2.4) - 0.055);
    v = (invF(Math.min(1, Math.max(0, Lmin))) - (1 - PLATE_LIGHT) * worst.lum) / PLATE_LIGHT;
  }
  v = Math.max(0, Math.min(255, v));
  // carry 18% of DarkMuted so the veil reads tinted rather than grey
  const dm = parse(pal.semantic.DarkMuted ?? pal.ambientDark[0]);
  const mix = (a, b) => a * 0.82 + b * 255 * 0.18;
  pal.brightestRegion = brightestRegion;
  pal.darkestRegion = darkestRegion;
  pal.veil = toHex(mix(v, dm.r), mix(v, dm.g), mix(v, dm.b));
  fs.writeFileSync(palettePath, JSON.stringify(pal, null, 2) + "\n");
  console.log(`${name}: brightestRegion ${brightestRegion} (lum ${best.lum.toFixed(0)}) · darkestRegion ${darkestRegion} (lum ${worst.lum.toFixed(0)}) → veil ${pal.veil} [${pal.suggestedMode}]`);
  process.exit(0);
}
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
