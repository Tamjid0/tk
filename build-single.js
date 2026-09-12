/* ================================================================
   build-single.js — builds a self-contained single-file gift version
   of the birthday book (all images + audio embedded).

   Usage:  npm run build:gift
   Output: dist/dolia-book.html

   Safety:
   - Scans sources for every asset reference (IMG/RES/assetPath/HTML/CSS)
   - Fails loudly if a referenced file is missing
   - Fails loudly if an unknown direct "assets/..." reference is found
   - Post-build verification scans the output for leftover file refs
   ================================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const sharp = require("sharp");
const ffmpegPath = require("ffmpeg-static");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const OUT_FILE = path.join(DIST, "dolia-book.html");

const AUDIO_TARGET_KBPS = 192;
const DEFAULT_IMG = { max: 1400, quality: 88 };
const STICKER_IMG = { max: 1600, quality: 96 };
const IMAGE_OVERRIDES = {
    "assets/images/ocean-bg.jpg": { max: 1920, quality: 84 },
    "assets/resources/chest.png": { max: 1400, quality: 92 },
};

const MIME = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
    ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".m4a": "audio/mp4",
};

const stripJsComments = (s) =>
    s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

function readSrc(rel) {
    return fs.readFileSync(path.join(ROOT, rel), "utf8").replace(/\r\n/g, "\n");
}

/* ---------- 1. collect asset references from sources ---------- */
const refs = new Map(); // asset path -> Set of sources

function addRef(p, source) {
    p = p.replace(/\\/g, "/").replace(/^\.\//, "");
    if (!refs.has(p)) refs.set(p, new Set());
    refs.get(p).add(source);
}

const htmlSrc = readSrc("index.html");
const cssSrc = readSrc("css/styles.css");
const contentSrc = readSrc("js/content.js");
const flipbookSrc = readSrc("js/flipbook.js");
const contentScan = stripJsComments(contentSrc);
const flipbookScan = stripJsComments(flipbookSrc);

for (const m of contentScan.matchAll(/\bIMG\(\s*["']([^"']+)["']\s*\)/g))
    addRef("assets/images/" + m[1], "js/content.js IMG()");
for (const m of contentScan.matchAll(/\bRES\(\s*["']([^"']+)["']\s*\)/g))
    addRef("assets/resources/" + m[1], "js/content.js RES()");
for (const m of flipbookScan.matchAll(/\bassetPath\(\s*["']([^"']+)["']\s*\)/g))
    addRef(m[1], "js/flipbook.js assetPath()");
for (const m of htmlSrc.matchAll(/(?:src|href)="(assets\/[^"]+)"/g))
    addRef(m[1], "index.html");
for (const m of cssSrc.matchAll(/url\(\s*['"]?\.\.\/(assets\/[^'")]+)['"]?\s*\)/g))
    addRef(m[1], "css/styles.css");

/* ---------- 2. unknown-reference guard ---------- */
const KNOWN = new Set(refs.keys());
const ASSET_RE = /(?:["'`(])((?:\.\.?\/)?assets\/[^\s"'`)]+\.(?:png|jpe?g|webp|gif|svg|mp3|wav|ogg|m4a))/g;
const unknown = [];
for (const [name, text] of [
    ["js/content.js", contentScan],
    ["js/flipbook.js", flipbookScan],
    ["index.html", htmlSrc],
    ["css/styles.css", cssSrc],
]) {
    for (const m of text.matchAll(ASSET_RE)) {
        const norm = m[1].replace(/^\.\.?\//, "");
        if (!KNOWN.has(norm)) unknown.push(name + ": " + m[1]);
    }
}
if (unknown.length) {
    console.error("\nBUILD STOPPED — asset references found that are not wired through IMG()/RES()/assetPath():");
    for (const u of unknown) console.error("  - " + u);
    console.error("\nWrap them in assetPath(\"...\") (or IMG()/RES() in content.js) and re-run.\n");
    process.exit(1);
}

/* ---------- 3. verify files exist ---------- */
const missing = [];
for (const p of refs.keys()) {
    if (!fs.existsSync(path.join(ROOT, p))) missing.push(p);
}
if (missing.length) {
    console.error("\nBUILD STOPPED — referenced asset files are missing:");
    for (const p of missing) console.error("  - " + p + "  (used by " + [...refs.get(p)].join(", ") + ")");
    process.exit(1);
}

/* ---------- 4. compress + encode ---------- */
function audioBitrateKbps(file) {
    const r = spawnSync(ffmpegPath, ["-i", file], { encoding: "utf8" });
    const err = (r.stderr || "") + (r.stdout || "");
    const dur = /Duration:\s*(\d+):(\d+):(\d+)/.exec(err);
    const br = /Audio:\s*mp3[^\n]*?(\d+)\s*kb\/s/.exec(err);
    return {
        kbps: br ? parseInt(br[1], 10) : null,
        duration: dur ? `${dur[1]}:${dur[2]}:${dur[3]}` : "?",
    };
}

function encodeAudio(file) {
    const info = audioBitrateKbps(file);
    if (info.kbps !== null && info.kbps <= AUDIO_TARGET_KBPS) {
        return { buf: fs.readFileSync(file), note: `kept ${info.kbps}kbps (<= ${AUDIO_TARGET_KBPS})`, duration: info.duration };
    }
    const tmp = path.join(DIST, "_tmp_audio.mp3");
    const r = spawnSync(ffmpegPath, [
        "-y", "-i", file,
        "-codec:a", "libmp3lame", "-b:a", AUDIO_TARGET_KBPS + "k",
        "-map_metadata", "-1", tmp,
    ], { encoding: "utf8" });
    if (r.status !== 0 || !fs.existsSync(tmp)) {
        console.error("BUILD STOPPED — ffmpeg re-encode failed:\n" + (r.stderr || ""));
        process.exit(1);
    }
    const buf = fs.readFileSync(tmp);
    fs.unlinkSync(tmp);
    return { buf, note: `${info.kbps || "?"}kbps -> ${AUDIO_TARGET_KBPS}kbps`, duration: info.duration };
}

async function encodeImage(file, relKey) {
    const ext = path.extname(file).toLowerCase();
    if (ext === ".svg") {
        return { buf: fs.readFileSync(file), note: "svg passthrough" };
    }
    const cfg = IMAGE_OVERRIDES[relKey] || (relKey.startsWith("assets/resources/") ? STICKER_IMG : DEFAULT_IMG);
    const orig = fs.statSync(file).size;
    const buf = await sharp(file)
        .rotate()
        .resize({ width: cfg.max, height: cfg.max, fit: "inside", withoutEnlargement: true })
        .webp({ quality: cfg.quality, alphaQuality: 100, chromaSubsampling: "4:4:4", effort: 6 })
        .toBuffer();
    return { buf, note: `webp q${cfg.quality} max${cfg.max} (was ${(orig / 1024).toFixed(0)}KB)` };
}

(async () => {
    fs.mkdirSync(DIST, { recursive: true });

    console.log("Embedding " + refs.size + " assets...\n");
    const assetData = new Map();
    let totalOut = 0, totalIn = 0;

    for (const p of [...refs.keys()].sort()) {
        const abs = path.join(ROOT, p);
        totalIn += fs.statSync(abs).size;
        const ext = path.extname(p).toLowerCase();
        let res;
        if (ext === ".mp3") {
            res = encodeAudio(abs);
        } else {
            res = await encodeImage(abs, p);
        }
        totalOut += res.buf.length;
        const mime = MIME[ext] || "application/octet-stream";
        const uri = "data:" + mime + ";base64," + res.buf.toString("base64");
        assetData.set(p, uri);
        console.log(
            "  " + p.padEnd(52) +
            (res.buf.length / 1024).toFixed(0).padStart(6) + "KB  " + res.note
        );
    }

    console.log(
        "\ncompressed " + (totalIn / 1048576).toFixed(1) + "MB -> " +
        (totalOut / 1048576).toFixed(1) + "MB (before base64)\n"
    );

    /* ---------- 5. build CSS with embedded urls ---------- */
    let css = cssSrc.replace(
        /url\(\s*(['"]?)\.\.\/(assets\/[^'")]+)\1\s*\)/g,
        (m, q, p) => {
            const uri = assetData.get(p);
            return uri ? "url(\"" + uri + "\")" : m;
        }
    );

    /* ---------- 6. build HTML ---------- */
    let html = htmlSrc;

    html = html.replace(/\s*<link rel="preload"[^>]*>\n/, "\n");

    /* audio -> blob approach: strip file src before generic substitution */
    const audioTag = '<audio id="bgMusic" src="assets/audio/dolia-music.mp3" loop preload="auto"></audio>';
    if (!html.includes(audioTag)) {
        console.error("BUILD STOPPED — audio tag not found in index.html (structure changed). Update build-single.js.");
        process.exit(1);
    }
    html = html.replace(audioTag, '<audio id="bgMusic" loop></audio>');

    /* replace remaining HTML src/href file references with data URIs */
    html = html.replace(/(?:src|href)="(assets\/[^"]+)"/g, (m, p) => {
        const uri = assetData.get(p);
        return uri ? m.replace(p, uri) : m;
    });

    html = html.replace(
        '    <link rel="stylesheet" href="css/styles.css">',
        "    <style>\n" + css + "\n    </style>"
    );

    const mapJson = "{" + [...assetData.entries()]
        .map(([k, v]) => JSON.stringify(k) + ":" + JSON.stringify(v))
        .join(",") + "}";

    html = html.replace(
        '<audio id="bgMusic" src="assets/audio/dolia-music.mp3" loop preload="auto"></audio>',
        '<audio id="bgMusic" loop></audio>'
    );

    const blobScript =
        "<script>\n" +
        "/* audio: base64 -> Blob URL (more reliable than raw data URI for large audio) */\n" +
        "(function () {\n" +
        "    var uri = window.__ASSETS__ && window.__ASSETS__[\"assets/audio/dolia-music.mp3\"];\n" +
        "    if (!uri) return;\n" +
        "    var bin = atob(uri.slice(uri.indexOf(\",\") + 1));\n" +
        "    var buf = new Uint8Array(bin.length);\n" +
        "    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);\n" +
        "    var url = URL.createObjectURL(new Blob([buf], { type: \"audio/mpeg\" }));\n" +
        "    var a = document.getElementById(\"bgMusic\");\n" +
        "    if (a) a.src = url;\n" +
        "})();\n" +
        "<\/script>";

    const inlineScripts =
        "    <script>window.__ASSETS__=" + mapJson + ";<\/script>\n" +
        "    <script>\n" + contentSrc + "\n    <\/script>\n" +
        "    <script>\n" + flipbookSrc + "\n    <\/script>\n" +
        blobScript;

    const scriptsTag = "    <script src=\"js/content.js\"><\/script>\n    <script src=\"js/flipbook.js\"><\/script>";
    if (!html.includes(scriptsTag)) {
        console.error("BUILD STOPPED — could not find the script tags in index.html. The page structure changed; update build-single.js.");
        process.exit(1);
    }
    html = html.replace(scriptsTag, inlineScripts);

    /* ---------- 7. post-build verification ---------- */
    const problems = [];
    if (/="assets\//.test(html)) problems.push('HTML still has an ="assets/..." attribute reference');
    if (/url\(\s*['"]?\.?\.?\/?assets\//.test(html)) problems.push("output still has a CSS url(assets/...) reference");
    if (!html.includes("window.__ASSETS__")) problems.push("__ASSETS__ map missing from output");
    if (/src="assets\//.test(html)) problems.push("an element src still references a file path");
    if (html.includes("<script src=")) problems.push("output still loads an external script");
    if (html.includes('href="css/')) problems.push("output still links the stylesheet");

    if (problems.length) {
        console.error("\nBUILD STOPPED — post-build verification failed:");
        for (const p of problems) console.error("  - " + p);
        process.exit(1);
    }

    fs.writeFileSync(OUT_FILE, html, "utf8");
    const size = fs.statSync(OUT_FILE).size;
    console.log("Wrote " + path.relative(ROOT, OUT_FILE) + "  (" + (size / 1048576).toFixed(1) + "MB)");
    console.log("Single-file gift build complete.\n");
})().catch((e) => {
    console.error("BUILD STRUCK AN ERROR:", e);
    process.exit(1);
});
