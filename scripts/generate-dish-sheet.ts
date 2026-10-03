/**
 * Regenerates src/assets/dish-contact-sheet.jpg — the ONE contact-sheet asset
 * the game crops by dish id (see AGENTS.md).
 *
 * Layout: 10 columns x 6 rows = 60 cells, tile 480px -> 4800 x 2880.
 * Cell order matches DISHES ids 1..60 (id 1 = col 0/row 0).
 *
 * Sources, per dish, in order:
 *   1. Wikipedia lead image of the dish (or of its main component for the
 *      fictional dishes, which have no article of their own).
 *   2. Wikimedia Commons file search for the dish/component name.
 *   3. Commons search for "food" (last resort so no cell is ever empty).
 *
 * Downloads are cached in /tmp/dod-sheet-cache so reruns are fast and the
 * collected attribution survives. Writes src/assets/dish-contact-sheet.sources.md.
 *
 * Run: bun scripts/generate-dish-sheet.ts  (or: bun run generate:dish-sheet)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

import { DISHES } from "../src/lib/dishes.ts";

const TILE = 480;
const COLS = 10;
const ROWS = 6;
const SHEET_W = TILE * COLS;
const SHEET_H = TILE * ROWS;
const OUT_JPG = "src/assets/dish-contact-sheet.jpg";
const OUT_SOURCES = "src/assets/dish-contact-sheet.sources.md";
const CACHE_DIR = "/tmp/dod-sheet-cache";
const UA = "DishOrDelusion/1.0 (game asset generation; contact: local project)";
// Wikimedia only serves direct thumb requests at "standard" widths
// (see https://w.wiki/GHai); other widths get HTTP 400.
const STANDARD_WIDTHS = [960, 500, 330, 250, 120];
const THUMB_WIDTH = 500;

type SourceMeta = {
  dishId: number;
  name: string;
  answer: string;
  pageUrl: string;
  pageName: string;
  file: string;
  fileHost: "commons" | "enwiki" | "unknown";
  artist: string;
  license: string;
  fetchedVia: string;
};

// Per-dish sources. `wiki` = en.wikipedia article title used for its lead image
// (for the 30 fictional dishes this is the main component — e.g. "Cappuccino"
// for Pickle Cappuccino). `commons` = Wikimedia Commons search fallback.
const SOURCES: Record<string, { wiki?: string; commons: string }> = {
  "Stargazy Pie": { wiki: "Stargazy pie", commons: "stargazy pie" },
  "Casu Marzu": { wiki: "Casu marzu", commons: "casu marzu" },
  "Hákarl": { wiki: "Hákarl", commons: "hakarl" },
  "Century Egg": { wiki: "Century egg", commons: "century egg" },
  "Balut": { wiki: "Balut (food)", commons: "balut" },
  "Escamoles": { wiki: "Escamoles", commons: "escamoles" },
  "Surströmming": { wiki: "Surströmming", commons: "surstromming" },
  Shirako: { wiki: "Shirako", commons: "shirako" },
  Kiviak: { commons: "kiviak" },
  "Ant Egg Soup": { commons: "ant eggs" },
  Poutine: { wiki: "Poutine", commons: "poutine" },
  "Smörgåstårta": { wiki: "Smörgåstårta", commons: "smorgastarta" },
  "Jellied Eels": { wiki: "Jellied eels", commons: "jellied eels" },
  Chaprah: { commons: "kashmiri rice dish" },
  "Pakhala Bhata": { wiki: "Pakhala", commons: "pakhala bhata" },
  "Cheesecake Dal": { wiki: "Lentil soup", commons: "dal (food) lentils" },
  "Blueberry Naan Sundae": { wiki: "Naan", commons: "naan" },
  "Coconut Butter Tea": { wiki: "Coconut milk", commons: "coconut milk drink" },
  "Mango Mustard Cake": { wiki: "Mango", commons: "mango fruit" },
  "Popcorn Soup": { wiki: "Popcorn", commons: "popcorn" },
  "Chocolate Paneer Pie": { wiki: "Paneer", commons: "paneer" },
  "Watermelon Curry": { wiki: "Watermelon", commons: "watermelon slices" },
  "Pizza Chai": { wiki: "Masala chai", commons: "masala chai" },
  "Caramel Samosa Soup": { wiki: "Caramel", commons: "caramel sauce" },
  "Mango Cheese Tea": { wiki: "Milk tea", commons: "milk tea" },
  "Masala Cheesecake Dosa": { wiki: "Masala dosa", commons: "masala dosa south indian" },
  "Strawberry Sambar": { commons: "sambar south indian food" },
  "Chocolate Idli Pudding": { wiki: "Idli", commons: "idli" },
  "Peanut Butter Biryani": { wiki: "Peanut butter", commons: "peanut butter jar" },
  "Coffee Paratha": { wiki: "Paratha", commons: "paratha" },
  "Garlic Jalebi": { wiki: "Jalebi", commons: "jalebi" },
  "Cola Rasmalai": { wiki: "Rasmalai", commons: "rasmalai" },
  "Mango Macaroni Kheer": { wiki: "Macaroni and cheese", commons: "macaroni and cheese" },
  "Pizza Pani Puri": { wiki: "Pani puri", commons: "pani puri" },
  "Coconut Butter Popcorn Curry": { wiki: "Curry", commons: "curry bowl" },
  "Chocolate Chole": { wiki: "Chickpea", commons: "chickpeas" },
  "Garlic Kheer": { wiki: "Kheer", commons: "kheer" },
  "Bánh Xèo": { wiki: "Bánh xèo", commons: "banh xeo" },
  "Pão de Deus": { commons: "pao de deus" },
  "Funeral Potatoes": { wiki: "Funeral potatoes", commons: "funeral potatoes" },
  "Rocky Mountain Oysters": { wiki: "Rocky Mountain oysters", commons: "rocky mountain oysters" },
  Haggis: { wiki: "Haggis", commons: "haggis" },
  "Black Pudding": { wiki: "Black pudding", commons: "black pudding" },
  "Pigs in Blankets": { wiki: "Pigs in blankets", commons: "pigs in blankets" },
  "Mooncake with Salted Egg Yolk": { wiki: "Mooncake", commons: "mooncake" },
  "Black Sesame Soup": { wiki: "Black sesame soup", commons: "black sesame soup" },
  "Salted Coffee": { wiki: "Vietnamese coffee", commons: "vietnamese coffee" },
  "Butter Tea": { wiki: "Butter tea", commons: "butter tea" },
  "Ackee and Saltfish": { wiki: "Ackee and saltfish", commons: "ackee and saltfish" },
  "Banana Ketchup": { wiki: "Banana ketchup", commons: "banana ketchup" },
  "Ants on a Log": { wiki: "Ants on a log", commons: "antsonalogb" },
  "Cloud Noodles": { wiki: "Noodle", commons: "noodle dish" },
  "Moonlight Soup": { wiki: "Soup", commons: "bowl of soup" },
  "Chocolate Curry Cake": { wiki: "Chocolate cake", commons: "chocolate cake" },
  "Pickle Cappuccino": { wiki: "Cappuccino", commons: "cappuccino" },
  "Banana Biryani": { wiki: "Biryani", commons: "biryani" },
  "Masala Ice Cream Pizza": { wiki: "Pizza", commons: "pizza" },
  "Garlic Cotton Candy": { wiki: "Cotton candy", commons: "cotton candy" },
  "Fried Water": { wiki: "Deep frying", commons: "deep frying" },
  "Strawberry Samosa Cake": { wiki: "Samosa", commons: "samosa" },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Wikimedia throttles bursts from a single client aggressively (HTTP 429).
// Every request in this script goes through `gate()`, which keeps at least
// REQUEST_GAP_MS between consecutive requests no matter which dish asked for
// them — without it a dish that tries several queries burns the whole budget
// and later dishes get throttled into failing.
const REQUEST_GAP_MS = 1_100;
let lastRequestAt = 0;

async function gate(): Promise<void> {
  const now = Date.now();
  const wait = lastRequestAt + REQUEST_GAP_MS - now;
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

/** Fetch with pacing-friendly retries: 429/5xx/network errors are retried with
 * exponential backoff (honouring Retry-After); other 4xx fail fast.
 *
 * Returns null when every attempt was throttled or hit a network error: the
 * caller must then try a *different* query, because an exhausted 429 carries
 * an HTML error body that cannot be parsed as an API response. */
async function fetchWithRetry(url: string, tries = 5): Promise<Response | null> {
  let last: Response | null = null;
  let delay = 2_000;
  for (let attempt = 0; attempt < tries; attempt += 1) {
    if (attempt > 0) {
      await sleep(delay);
      delay = Math.min(delay * 2, 20_000);
    }
    await gate();
    try {
      const res = await fetch(url, { headers: { "user-agent": UA } });
      if (res.ok) return res;
      last = res;
      if (res.status !== 429 && res.status < 500) return res; // permanent 4xx
      const ra = Number(res.headers.get("retry-after"));
      if (Number.isFinite(ra) && ra >= 1) delay = Math.min(ra * 1_000, 30_000);
    } catch {
      last = null; // network hiccup — retry
    }
  }
  // Every attempt was 429/5xx/network: report failure instead of an unparseable body.
  return last && last.status < 500 && last.status !== 429 ? last : null;
}

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  const res = await fetchWithRetry(url);
  if (!res) return null;
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function fetchBytes(url: string): Promise<Buffer | null> {
  const res = await fetchWithRetry(url);
  if (!res) return null;
  try {
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.byteLength > 3_000 ? buf : null;
  } catch {
    return null;
  }
}

function widenThumb(url: string, width: number): string {
  return url.replace(/\d+px-/, `${width}px-`);
}

/** Derive the File: title + host from a Wikimedia image URL. */
function fileFromUrl(url: string): { file: string; host: SourceMeta["fileHost"] } {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);
    const thumbIdx = parts.indexOf("thumb");
    let file: string;
    if (thumbIdx >= 0 && parts.length > thumbIdx + 3) {
      file = parts[thumbIdx + 3] ?? "";
    } else {
      file = parts[parts.length - 1] ?? "";
    }
    file = decodeURIComponent(file).replace(/^\d+px-/, "");
    const host: SourceMeta["fileHost"] = pathname.includes("/wikipedia/commons/")
      ? "commons"
      : pathname.includes("/wikipedia/en/") || pathname.includes("/en/")
        ? "enwiki"
        : "unknown";
    return { file: file ? `File:${file}` : "", host };
  } catch {
    return { file: "", host: "unknown" };
  }
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Wikipedia REST lead image for a title, widened to THUMB_WIDTH. */
async function wikiImage(title: string): Promise<{ buf: Buffer; meta: Partial<SourceMeta> } | null> {
  const summary = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  if (!summary) return null;
  const thumb = summary["thumbnail"] as { source?: string } | undefined;
  const original = summary["originalimage"] as { source?: string; width?: number } | undefined;
  const pageUrl = typeof summary["descriptionurl"] === "string" ? String(summary["descriptionurl"]) : `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
  const originalWidth = typeof original?.width === "number" ? original.width : undefined;
  // Only request standard thumb widths that don't upscale past the original.
  const widths = STANDARD_WIDTHS.filter((w) => originalWidth === undefined || w <= originalWidth);
  const candidates: string[] = [];
  if (thumb?.source) {
    for (const w of widths) candidates.push(widenThumb(thumb.source, w));
    candidates.push(thumb.source);
  }
  if (original?.source) candidates.push(original.source);
  for (const url of candidates) {
    const buf = await fetchBytes(url);
    if (buf) {
      const { file, host } = fileFromUrl(url);
      return {
        buf,
        meta: {
          pageUrl: typeof summary["canonicalurl"] === "string" ? summary["canonicalurl"] : pageUrl,
          pageName: title,
          file,
          fileHost: host,
          fetchedVia: `wikipedia:${title}`,
        },
      };
    }
  }
  return null;
}

/** First usable raster image from a Wikimedia Commons file search. */
async function commonsImage(query: string): Promise<{ buf: Buffer; meta: Partial<SourceMeta> } | null> {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=15` +
    "&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=" + THUMB_WIDTH;
  const json = await fetchJson(url);
  if (!json) return null;
  const query0 = json["query"] as { pages?: Record<string, unknown> } | undefined;
  const pages = query0?.pages;
  if (!pages) return null;
  const ranked = Object.values(pages)
    .map((p) => {
      // imageinfo is an ARRAY of objects (one per file), not a single object —
      // reading p.imageinfo.thumburl silently yielded undefined and dropped
      // every search result, which is why Commons lookups never resolved.
      const raw = (p as { imageinfo?: unknown }).imageinfo;
      const info = (Array.isArray(raw) ? raw[0] : raw) as
        | { thumburl?: string; thumbwidth?: number; extmetadata?: Record<string, { value?: string }> }
        | undefined;
      return {
        title: (p as { title?: string }).title,
        index: (p as { index?: number }).index,
        info,
      };
    })
    .filter((p) => Boolean(p.info?.thumburl))
    .filter((p) => /\.(jpe?g|png|webp|gif)$/i.test((p.title ?? "").replace(/^File:/, "")))
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  for (const page of ranked) {
    const thumburl = page.info?.thumburl;
    if (!thumburl) continue;
    const buf = await fetchBytes(thumburl);
    if (buf) {
      const meta = page.info?.extmetadata ?? {};
      const artist = stripHtml(meta["Artist"]?.value ?? "");
      const license = stripHtml(meta["LicenseShortName"]?.value ?? "");
      return {
        buf,
        meta: {
          pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title ?? "")}`,
          pageName: page.title ?? query,
          file: page.title ?? "",
          fileHost: "commons",
          artist,
          license,
          fetchedVia: `commons:${query}`,
        },
      };
    }
  }
  return null;
}

async function resolveDish(name: string): Promise<{ buf: Buffer; meta: SourceMeta } | null> {
  const spec = SOURCES[name] ?? { commons: name };
  const attempts: { label: string; run: () => Promise<{ buf: Buffer; meta: Partial<SourceMeta> } | null> }[] = [];
  if (spec.wiki) attempts.push({ label: `wiki:${spec.wiki}`, run: () => wikiImage(spec.wiki as string) });
  attempts.push({ label: `commons:${spec.commons}`, run: () => commonsImage(spec.commons) });
  attempts.push({ label: "commons:food", run: () => commonsImage("plated food dish") });

  for (const attempt of attempts) {
    const hit = await attempt.run();
    if (hit) {
      return {
        buf: hit.buf,
        meta: {
          dishId: 0,
          name,
          answer: "",
          pageUrl: hit.meta.pageUrl ?? "",
          pageName: hit.meta.pageName ?? "",
          file: hit.meta.file ?? "",
          fileHost: hit.meta.fileHost ?? "unknown",
          artist: hit.meta.artist ?? "",
          license: hit.meta.license ?? "",
          fetchedVia: hit.meta.fetchedVia ?? attempt.label,
        },
      };
    }
  }
  return null;
}

/** MediaWiki File: title comparison key: case/underscore insensitive. */
function normalizeTitle(title: string): string {
  return title.replace(/_/g, " ").trim().toLowerCase();
}

/** Fill artist/license for any file that lacks it (batch, <=40 titles/call).
 *
 * Wikipedia lead images are hosted on Commons under a File: title too, so the
 * Commons API resolves both fileHost values; querying only fileHost==="commons"
 * (as this once did) left 47 of the 60 rows without author or license. */
async function enrichAttribution(metas: SourceMeta[]): Promise<void> {
  const need = metas.filter((m) => m.file && (!m.artist || !m.license));
  for (let i = 0; i < need.length; i += 40) {
    const batch = need.slice(i, i + 40);
    const titles = batch.map((m) => m.file).join("|");
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
      `&iiprop=extmetadata&titles=${encodeURIComponent(titles)}`;
    const json = await fetchJson(url);
    const query0 = json?.["query"] as
      | { pages?: Record<string, { title?: string; imageinfo?: unknown }> }
      | undefined;
    const pages = query0?.pages ?? {};
    const byTitle = new Map(
      Object.values(pages).map((p) => {
        const raw = p.imageinfo;
        const info = (Array.isArray(raw) ? raw[0] : raw) as
          | { extmetadata?: Record<string, { value?: string }> }
          | undefined;
        // The API normalises File: titles to spaces ("File:A_b.jpg" ->
        // "File:A b.jpg") while URLs/caches carry underscores, so the map is
        // keyed on a normalised form on BOTH sides or every lookup misses.
        return [normalizeTitle(p.title ?? ""), info?.extmetadata ?? {}];
      }),
    );
    for (const m of batch) {
      const meta = byTitle.get(normalizeTitle(m.file));
      if (!meta) continue;
      if (!m.artist) m.artist = stripHtml(meta["Artist"]?.value ?? "");
      if (!m.license) m.license = stripHtml(meta["LicenseShortName"]?.value ?? "");
    }
  }
}

async function main(): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  const failures: string[] = [];
  const metas: SourceMeta[] = [];
  const tiles: { input: Buffer; top: number; left: number }[] = [];

  for (let i = 0; i < DISHES.length; i += 1) {
    const dish = DISHES[i];
    if (!dish) continue;
    const col = (dish.id - 1) % COLS;
    const row = Math.floor(((dish.id - 1) % (COLS * ROWS)) / COLS);
    const cacheFile = `${CACHE_DIR}/${dish.id}.jpg`;
    const metaFile = `${CACHE_DIR}/${dish.id}.json`;

    let buf: Buffer | null = null;
    let meta: SourceMeta | null = null;
    try {
      buf = await readFile(cacheFile);
      meta = JSON.parse(await readFile(metaFile, "utf8")) as SourceMeta;
    } catch {
      /* cache miss */
    }

    if (!buf || !meta) {
      // Every request inside resolveDish is already paced by gate(); no extra
      // per-dish sleep is needed (and a second delay only slowed reruns down).
      const hit = await resolveDish(dish.name);
      if (hit) {
        buf = hit.buf;
        // hit.meta carries placeholder dishId/answer, so the per-dish fields
        // must be applied AFTER the spread or they get overwritten with 0/"".
        meta = { ...hit.meta, dishId: dish.id, name: dish.name, answer: dish.answer } as SourceMeta;
        await writeFile(cacheFile, buf);
        await writeFile(metaFile, JSON.stringify(meta, null, 2));
      }
    }

    if (meta) {
      // Cached entries may predate a dish rename or the placeholder fix, so
      // always re-stamp the authoritative per-dish fields.
      meta.dishId = dish.id;
      meta.name = dish.name;
      meta.answer = dish.answer;
    }

    if (!buf || !meta) {
      failures.push(`${dish.name} (id ${dish.id})`);
      console.error(`  ✗ ${dish.name} — no image found`);
      continue;
    }

    const tile = await sharp(buf)
      .resize(TILE, TILE, { fit: "cover", position: "attention" })
      .toBuffer();
    tiles.push({ input: tile, top: row * TILE, left: col * TILE });
    metas.push(meta);
    console.log(`  [${i + 1}/${DISHES.length}] ${dish.name} ✓ (${meta.fetchedVia})`);
  }

  await enrichAttribution(metas);

  // Persist the enriched attribution so cached reruns keep author/license
  // instead of degrading to "see source page" on every subsequent run.
  for (const m of metas) {
    await writeFile(`${CACHE_DIR}/${m.dishId}.json`, JSON.stringify(m, null, 2));
  }

  if (tiles.length !== COLS * ROWS) {
    console.error(`FATAL: only ${tiles.length}/${COLS * ROWS} tiles resolved`);
    process.exit(1);
  }

  await sharp({
    create: { width: SHEET_W, height: SHEET_H, channels: 3, background: { r: 250, g: 244, b: 230 } },
  })
    .composite(tiles)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(OUT_JPG);

  const info = await sharp(OUT_JPG).metadata();
  if (info.width !== SHEET_W || info.height !== SHEET_H) {
    console.error(`FATAL: output is ${info.width}x${info.height}, expected ${SHEET_W}x${SHEET_H}`);
    process.exit(1);
  }

  const rows = metas
    .sort((a, b) => a.dishId - b.dishId)
    .map(
      (m) =>
        `| ${m.dishId} | ${m.name} | ${m.answer} | [${m.pageName || "—"}](${m.pageUrl || "—"}) | ${m.file || "—"} | ${m.artist || "—"} | ${m.license || "see source page"} |`,
    );
  await writeFile(
    OUT_SOURCES,
    [
      "# Dish or Delusion — contact sheet image sources",
      "",
      "Auto-generated by `bun run generate:dish-sheet`. Images are sourced from",
      "Wikipedia lead images and Wikimedia Commons files (licenses vary per file —",
      "see the linked source page for the author and exact license; many are",
      "CC BY-SA / CC BY / public domain). Fictional dishes use a photo of their",
      "main component, since no photo of the invented dish can exist.",
      "",
      "| id | dish | answer | source page | file | author | license |",
      "| --- | --- | --- | --- | --- | --- | --- |",
      ...rows,
      "",
    ].join("\n"),
  );

  console.log(`\n✓ ${OUT_JPG} → ${SHEET_W}x${SHEET_H}, ${tiles.length} cells`);
  console.log(`✓ ${OUT_SOURCES} written`);
  if (failures.length) {
    console.error(`✗ unresolved dishes: ${failures.join(", ")}`);
    process.exit(1);
  }
}

await main();
