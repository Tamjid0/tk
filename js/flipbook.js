/* ================================================================
   Flipbook engine â€” vanilla JS, no dependencies, no network.
   You should not need to edit this file.
================================================================ */
(() => {
    "use strict";

    /* ── Splash screen ── */
    (function initSplash() {
        const splash = document.getElementById("splash");
        const chest = document.getElementById("splashChest");
        const sparkles = document.getElementById("splashSparkles");
        const scene = splash ? splash.querySelector(".splash-scene") : null;
        const mk = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };
        if (!splash || !chest) return;

        /* Hide chest/hint until ocean bg is decoded to prevent dark flicker */
        const bgImg = new Image();
        bgImg.src = assetPath("assets/images/ocean-bg.jpg");
        if (bgImg.decode) {
            bgImg.decode().then(function () { if (scene) scene.classList.add("ready"); }).catch(function () { if (scene) scene.classList.add("ready"); });
        } else {
            bgImg.onload = function () { if (scene) scene.classList.add("ready"); };
            bgImg.onerror = function () { if (scene) scene.classList.add("ready"); };
        }
        /* fallback: show anyway after 1.2s */
        setTimeout(function () { if (scene && !scene.classList.contains("ready")) scene.classList.add("ready"); }, 1200);

        /* Ambient rising bubbles on the splash scene too */
        const splashBubbles = document.getElementById("splashBubbles");
        if (splashBubbles) {
            for (let i = 0; i < 14; i++) {
                const m = mk("span", "mote");
                m.style.left = (4 + Math.random() * 92) + "%";
                m.style.setProperty("--sz", (7 + Math.random() * 9).toFixed(1) + "px");
                m.style.setProperty("--d", (8 + Math.random() * 9).toFixed(1) + "s");
                m.style.setProperty("--delay", (-Math.random() * 16).toFixed(1) + "s");
                m.style.setProperty("--sx", (Math.random() * 60 - 30).toFixed(0) + "px");
                m.style.setProperty("--o", (0.6 + Math.random() * 0.35).toFixed(2));
                splashBubbles.appendChild(m);
            }
        }

        /* Big breath bubbles from the chest when opened */
        function breathBurst(x, y) {
            const count = 10 + Math.floor(Math.random() * 6);
            for (let i = 0; i < count; i++) {
                const b = mk("span", "splash-breath");
                const sz = 14 + Math.random() * 26;
                b.style.width = sz + "px";
                b.style.height = sz + "px";
                b.style.left = (x - sz / 2 + (Math.random() - 0.5) * 70) + "px";
                b.style.top = (y - sz / 2 + (Math.random() - 0.5) * 20) + "px";
                b.style.setProperty("--sx", (Math.random() * 90 - 45).toFixed(0) + "px");
                b.style.animationDuration = (1.6 + Math.random() * 1.6).toFixed(2) + "s";
                b.style.animationDelay = (Math.random() * 0.25).toFixed(2) + "s";
                (splashBubbles || document.body).appendChild(b);
                (function (el2) {
                    setTimeout(function () { el2.remove(); }, 3800);
                })(b);
            }
        }

        let opened = false;
        chest.addEventListener("click", function () {
            if (opened) return;
            opened = true;

            /* Spawn sparkles */
            const rect = chest.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            breathBurst(cx, cy - rect.height * 0.25);
            for (let i = 0; i < 24; i++) {
                const sp = document.createElement("div");
                sp.className = "splash-spark";
                const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
                const dist = 60 + Math.random() * 120;
                sp.style.left = cx + "px";
                sp.style.top = cy + "px";
                sp.style.setProperty("--sx", Math.cos(angle) * dist + "px");
                sp.style.setProperty("--sy", Math.sin(angle) * dist + "px");
                sp.style.animationDelay = (Math.random() * 0.15) + "s";
                sp.style.width = (3 + Math.random() * 5) + "px";
                sp.style.height = sp.style.width;
                sparkles.appendChild(sp);
            }

            /* Animate chest */
            chest.classList.add("opening");

            /* Start background music (user gesture, so autoplay is allowed) */
            const music = document.getElementById("bgMusic");
            if (music) {
                music.volume = 0;
                const p = music.play();
                if (p && p.catch) p.catch(function () { });
                let v = 0;
                const fade = setInterval(function () {
                    v = Math.min(1, v + 0.05);
                    music.volume = Math.min(0.55, v * 0.55);
                    if (v >= 1) clearInterval(fade);
                }, 120);
            }

            /* Hide splash after animation */
            setTimeout(function () {
                splash.classList.add("hidden");
            }, 800);
        });
    })();

    // ---- Content guard: fail loudly if js/content.js is broken ----
    if (typeof PAGES === "undefined" || !Array.isArray(PAGES) || PAGES.length === 0) {
        console.error("[flipbook] PAGES is missing or empty. Check js/content.js for a syntax error (usually a missing comma, quote, or bracket).");
        const wrap = document.querySelector(".book-wrap");
        if (wrap) {
            const msg = document.createElement("p");
            msg.textContent = "The keepsake could not load its content â€” js/content.js has a syntax error (see console).";
            msg.style.cssText = "position:relative;z-index:5;max-width:34ch;text-align:center;color:#ecd7a4;font-size:.85rem;line-height:1.7;padding:0 16px";
            wrap.appendChild(msg);
        }
        return;
    }

    const SVGNS = "http://www.w3.org/2000/svg";
    const $ = (s) => document.querySelector(s);

    const book = $("#book");
    const slotLeft = $("#slotLeft");
    const slotRight = $("#slotRight");
    const stage = $("#stage");
    const btnPrev = $("#btnPrev");
    const btnNext = $("#btnNext");
    const counterEl = $("#counter");
    const progressEl = $("#progressFill");
    const hint = $("#hint");

    const mqDouble = window.matchMedia("(min-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let mode = mqDouble.matches ? "double" : "single";
    let views = [];
    let cursor = 0;
    let anchor = 0;          // page index we try to keep visible across resizes
    let lock = false;

    /* ── DEV PERSIST: keep book on last viewed page across reloads ──
       Revertable: delete this block or `git revert` the commit that adds it.
       Usage: reload stays on same page. Disable with `?nopersist` in URL.
       Clear stored page: run `clearFlipbookPersist()` in console or add `?clearPersist`. */
    const DEV_PERSIST_KEY = "dev:flipbook:anchor";
    const _devParams = new URLSearchParams(location.search);
    const _persistEnabled = !_devParams.has("nopersist");
    if (_devParams.has("clearPersist")) { try { localStorage.removeItem(DEV_PERSIST_KEY); } catch (_) {} }
    function _savePersist() {
        if (!_persistEnabled) return;
        try { localStorage.setItem(DEV_PERSIST_KEY, String(anchor)); } catch (_) {}
        try { history.replaceState(null, "", location.pathname + location.search + "#p" + anchor); } catch (_) {}
    }
    function _loadPersist() {
        if (!_persistEnabled) return null;
        try {
            const qp = _devParams.get("page");
            if (qp !== null) { const n = parseInt(qp, 10); if (!isNaN(n)) return n; }
            const hs = (location.hash.match(/#p(\d+)/) || [])[1];
            if (hs != null) { const n = parseInt(hs, 10); if (!isNaN(n)) return n; }
            const ls = localStorage.getItem(DEV_PERSIST_KEY);
            if (ls !== null) { const n = parseInt(ls, 10); if (!isNaN(n)) return n; }
        } catch (_) {}
        return null;
    }
    // expose for console: clearFlipbookPersist()
    try { window.clearFlipbookPersist = () => { try { localStorage.removeItem(DEV_PERSIST_KEY); } catch (_) {} location.hash = ""; console.log("[flipbook] persist cleared"); }; } catch (_) {}
    try { window._flipbookDevPersist = { key: DEV_PERSIST_KEY, load: _loadPersist, save: _savePersist }; } catch (_) {}

    /* DEV PERSIST: auto-bypass chest/splash when reloading on a persisted page (revertable).
       Without this, reload always shows the chest even though the book underneath is already
       at the correct page. Enabled only when a non-zero page is persisted; disable with ?nopersist. */
    try {
        const _persistedForSplash = _loadPersist();
        const _shouldBypass = _persistEnabled && _persistedForSplash !== null && _persistedForSplash !== 0;
        if (_shouldBypass) {
            const _bypassSplash = () => {
                const sp = document.getElementById("splash");
                if (sp) sp.classList.add("hidden");
                // also ensure splash scene is marked ready so it doesn't flash later
                const sc = sp && sp.querySelector(".splash-scene");
                if (sc) sc.classList.add("ready");
            };
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () => setTimeout(_bypassSplash, 50), { once: true });
            } else {
                // DOM already ready (script at end of body) — hide on next tick
                setTimeout(_bypassSplash, 50);
            }
            // fallback: hide again after bg decode timeout in case splash re-shows
            setTimeout(() => { const sp = document.getElementById("splash"); if (sp && _loadPersist() !== null) sp.classList.add("hidden"); }, 1300);
        }
    } catch (_) {}

    /* ---------- tiny DOM helpers ---------- */
    const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };
    const isTok = (s) => typeof s === "string" && /^\[.+\]$/.test(s.trim());
    const tok = (s, cls) => { const n = el("span", cls); n.textContent = s; if (isTok(s)) n.classList.add("tok"); return n; };

    // views store page INDEXES; builders need page OBJECTS.
    const pageModel = (i) => (i == null ? null : PAGES[i]);

    function use(id, cls) {
        const s = document.createElementNS(SVGNS, "svg");
        if (cls) s.setAttribute("class", cls);
        s.setAttribute("aria-hidden", "true");
        const u = document.createElementNS(SVGNS, "use");
        u.setAttribute("href", "#" + id);
        s.appendChild(u);
        return s;
    }

    function getFlipMs() {
        const raw = getComputedStyle(book).getPropertyValue("--flip-dur").trim() || "800ms";
        const v = parseFloat(raw);
        return raw.endsWith("ms") ? v : v * 1000;
    }

    /* ---------- image plates & placeholders ---------- */
    function placeholder(art) {
        const ph = el("div", "ph ph--" + (art.tint === "aqua" ? "aqua" : "gold"));
        ph.appendChild(use(art.tint === "aqua" ? "sigil-water" : "sigil-sun"));
        const t = el("span", "ph-tok"); t.textContent = "[" + art.token + "]"; ph.appendChild(t);
        if (art.src) { const p = el("span", "ph-path"); p.textContent = art.src; ph.appendChild(p); }
        return ph;
    }

    function plateMedia(art) {
        const media = el("div", "plate-media");
        if (art && art.src) {
            const im = document.createElement("img");
            im.src = String(art.src).replace(/\\/g, "/");   // tolerate Windows-style paths
            im.alt = "[" + art.token + "]";
            im.decoding = "sync";
            im.draggable = false;
            // fit: "cover" (default) or "contain"
            const fit = art.fit === "contain" ? "contain" : "cover";
            im.style.objectFit = fit;
            // scale: 1-9 integer, 5 = default (no change).
            // Below 5 = zoomed out (more image visible), above 5 = zoomed in (cropped tighter).
            const sc = Math.min(9, Math.max(1, parseInt(art.scale, 10) || 5));
            if (sc !== 5) {
                const factor = 0.55 + (sc - 1) * 0.125;   // 1â†’0.55 â€¦ 5â†’1.05 â€¦ 9â†’1.55
                im.style.transform = "scale(" + factor.toFixed(3) + ")";
                im.style.transformOrigin = "center center";
            }
            im.addEventListener("error", () => media.replaceChild(placeholder(art), im));
            media.appendChild(im);
        } else {
            media.appendChild(placeholder(art || { token: "IMAGE", src: "" }));
        }
        return media;
    }

    function plate(art, { caption, cls = "" } = {}) {
        const fig = el("figure", "plate " + cls);
        fig.appendChild(plateMedia(art));
        if (caption) fig.appendChild(tok(caption));
        return fig;
    }

    const divider = (cls = "divider") => use("divider", cls);
    const grain = () => el("div", "grain");

    function cornerImg(src) {
        if (!src) return null;
        const d = el("div", "page-corner-img");
        const img = document.createElement("img");
        img.src = src; img.alt = ""; img.loading = "lazy";
        d.appendChild(img);
        return d;
    }

    function stickerImg(src, cls) {
        if (!src) return null;
        const d = el("div", "scrap-sticker " + (cls || ""));
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.loading = "lazy";
        d.appendChild(img);
        return d;
    }

    function accentDivider() {
        const d = el("div", "divider-accent");
        d.appendChild(el("span", "dot"));
        return d;
    }

    function randRot() {
        return (Math.random() * 6 - 3).toFixed(1);
    }

    function imgCell(src, caption, cls) {
        const cell = el("div", cls);
        cell.style.setProperty("--rot", randRot() + "deg");
        cell.style.setProperty("--tape-rot", (Math.random() * 6 - 3).toFixed(1) + "deg");
        const im = document.createElement("img");
        im.src = src; im.alt = caption || ""; im.loading = "lazy";
        cell.appendChild(im);
        if (caption) { const c = el("span", "hobby-caption"); c.textContent = caption; cell.appendChild(c); }
        return cell;
    }

    function imgCellTag(src, tag, cls, extra) {
        extra = extra || {};
        const cell = el("div", cls);
        cell.style.setProperty("--rot", randRot() + "deg");
        cell.style.setProperty("--tape-rot", (Math.random() * 6 - 3).toFixed(1) + "deg");
        const im = document.createElement("img");
        im.src = src; im.alt = ""; im.loading = "lazy";
        cell.appendChild(im);
        if (extra.mini) { const m = el("span", "mini-tag"); m.textContent = extra.mini; cell.appendChild(m); }
        if (extra.burst) { const b = el("span", "pow-burst"); b.textContent = extra.burst; cell.appendChild(b); }
        (extra.stickers || []).forEach((s) => {
            if (!s || !s.src) return;
            const w = el("div", "cell-sticker");
            w.style.left = (s.x || 0) + "%";
            w.style.top = (s.y || 0) + "%";
            w.style.width = (s.w || 20) + "%";
            if (s.rot) w.style.transform = "rotate(" + s.rot + "deg)";
            if (s.z != null) w.style.zIndex = s.z;
            const si = document.createElement("img");
            si.src = s.src; si.alt = ""; si.loading = "lazy";
            si.draggable = false;
            w.appendChild(si);
            cell.appendChild(w);
        });
        if (tag) { const t = el("span", "gaming-tag"); t.textContent = tag; cell.appendChild(t); }
        return cell;
    }

    function imgCellSpan(src, span2, cls) {
        const cell = el("div", cls + (span2 ? " span-2" : ""));
        cell.style.setProperty("--rot", randRot() + "deg");
        cell.style.setProperty("--tape-rot", (Math.random() * 6 - 3).toFixed(1) + "deg");
        const im = document.createElement("img");
        im.src = src; im.alt = ""; im.loading = "lazy";
        cell.appendChild(im);
        return cell;
    }

    /* ── Bubble cursor system ── */
    (function initBubbles() {
        const colors = ["rgba(200,225,255,0.6)", "rgba(190,230,255,0.55)", "rgba(220,240,255,0.65)", "rgba(205,232,255,0.6)"];

        function spawn(cx, cy, count) {
            for (let k = 0; k < count; k++) {
                const d = document.createElement("div");
                d.className = "cur-bubble";
                const sz = 10 + Math.random() * 18;
                d.style.width = sz + "px";
                d.style.height = sz + "px";
                d.style.left = (cx - sz / 2 + (Math.random() - 0.5) * 20) + "px";
                d.style.top = (cy - sz / 2 + (Math.random() - 0.5) * 12) + "px";
                d.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
                d.style.setProperty("--sx", (Math.random() * 80 - 40).toFixed(0) + "px");
                d.style.setProperty("--dur", (1.6 + Math.random() * 1.6).toFixed(2) + "s");
                document.body.appendChild(d);
                setTimeout(function (el) { el.remove(); }, 3600);
            }
        }

        let lastMx = 0, lastMy = 0;
        document.addEventListener("mousemove", function (e) {
            const dx = e.clientX - lastMx, dy = e.clientY - lastMy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 14) {
                spawn(e.clientX, e.clientY, 1);
                lastMx = e.clientX;
                lastMy = e.clientY;
            }
        });

        document.addEventListener("mousedown", function (e) {
            spawn(e.clientX, e.clientY, 4);
        });

        /* Touch: generate bubbles while dragging (swipe) and on tap */
        let lastTx = 0, lastTy = 0;
        document.addEventListener("touchmove", function (e) {
            const t = e.touches[0];
            if (!t) return;
            const dx = t.clientX - lastTx, dy = t.clientY - lastTy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 14) {
                spawn(t.clientX, t.clientY, 1);
                lastTx = t.clientX;
                lastTy = t.clientY;
            }
        }, { passive: true });

        document.addEventListener("touchstart", function (e) {
            const t = e.touches[0];
            if (!t) return;
            spawn(t.clientX, t.clientY, 4);
            lastTx = t.clientX;
            lastTy = t.clientY;
        }, { passive: true });
    })();

    function buildCover(p) {
        const pg = el("div", "page page--cover");
        pg.appendChild(el("div", "cover-frame"));
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        ["tl", "tr", "bl", "br"].forEach((c) => {
            const corner = el("span", "cover-corner " + c);
            corner.appendChild(use("corner-flourish"));
            pg.appendChild(corner);
        });
        const wm = el("div", "cover-watermark"); wm.appendChild(use("crest")); pg.appendChild(wm);
        if (p.sticker) {
            const sticker = stickerImg(p.sticker, "cover-sticker");
            if (sticker) pg.appendChild(sticker);
        }
        const inner = el("div", "page-inner");
        inner.appendChild(use("crest", "cover-crest"));
        inner.appendChild(plate(p.art, { cls: "cover-art" }));
        const h1 = el("h1", "cover-title"); h1.appendChild(tok(p.title)); inner.appendChild(h1);
        inner.appendChild(divider("divider cover-rule"));
        const name = el("p", "cover-name");
        const lbl = el("span", "label"); lbl.textContent = "for"; name.appendChild(lbl);
        name.appendChild(tok(p.recipient)); inner.appendChild(name);
        const date = el("p", "cover-date"); date.appendChild(tok(p.date)); inner.appendChild(date);
        pg.appendChild(inner);
        return pg;
    }

    function buildIntroLeft(p) {
        const pg = el("div", "page page--intro-left page--pilot-photo");
        const inner = el("div", "page-inner");
        inner.appendChild(plate(p.art, { cls: "intro-photo" }));
        pg.appendChild(inner);
        return pg;
    }

    function buildIntroRight(p) {
        const pg = el("div", "page page--intro-right page--text-page page--framed page--pilot-message");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner intro-message-inner");
        const note = el("div", "intro-message-card");
        if (p.kicker) { const k = el("span", "text-subtitle"); k.textContent = p.kicker; note.appendChild(k); }
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); note.appendChild(h2); }
        note.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        note.appendChild(body);
        inner.appendChild(note);
        pg.appendChild(inner);
        return pg;
    }

    /* PAGE 4 creative-arts scrapbook, 5 layers (reference: painting/makeup/sketch collage):
       L1 graph paper + watercolor washes (CSS) / L2 kraft + staff-paper scraps /
       L3 3 polaroids / L4 galaxy washi + clip + pins / L5 rainbow titles + doodles */
    function buildHobbiesLeft(p) {
        const pg = el("div", "page page--hobbies-left");
        const inner = el("div", "page-inner");
        const stage = el("div", "art-stage");
        // L2: torn kraft sheet + staff-paper scraps + check-grid scrap (behind photos)
        stage.appendChild(el("div", "art-kraft"));
        stage.appendChild(el("div", "art-staff st1"));
        stage.appendChild(el("div", "art-staff st2"));
        stage.appendChild(el("div", "art-check"));
        // L2: scattered staff notes on the scraps
        [["♪", 56, 30, -8], ["♫", 66, 62, 6], ["♩", 48, 70, -6]].forEach(([ch, x, y, r]) => {
            const n = el("span", "art-note");
            n.textContent = ch;
            n.style.left = x + "%"; n.style.top = y + "%";
            n.style.setProperty("--r", r + "deg");
            stage.appendChild(n);
        });
        // L5: rainbow titles + script accents (behind photos so cards overlap them)
        const rainbow = (txt, cls) => {
            const t = el("div", cls);
            const cols = ["#e8546d", "#f0903a", "#e8c53a", "#58b368", "#4a9de0", "#9b6dd6", "#e8546d", "#f0903a", "#e8c53a", "#58b368", "#4a9de0", "#9b6dd6", "#e8546d"];
            [...txt].forEach((ch, i) => {
                if (ch === " ") { t.appendChild(document.createTextNode(" ")); return; }
                const s = el("span", "rb");
                s.textContent = ch;
                s.style.color = cols[i % cols.length];
                t.appendChild(s);
            });
            return t;
        };
        stage.appendChild(rainbow("CREATIVE", "art-rainbow r1"));
        stage.appendChild(rainbow("ARTS!", "art-rainbow r2"));
        stage.appendChild(rainbow("CREATIVE", "art-rainbow r3"));
        stage.appendChild(rainbow("ARTS!", "art-rainbow r4"));
        [["Inspire!", "i1"], ["Inspire!", "i2"]].forEach(([txt, c]) => {
            const s = el("div", "art-inspire " + c); s.textContent = txt; stage.appendChild(s);
        });
        const dodie = el("div", "art-dodie"); dodie.textContent = "DODIE"; stage.appendChild(dodie);
        const ink = el("div", "art-ink"); ink.textContent = "INK"; stage.appendChild(ink);
        [["Creative note!", "m1"], ["PALIST STAJES", "m2"]].forEach(([txt, c]) => {
            const s = el("div", "art-margin " + c); s.textContent = txt; stage.appendChild(s);
        });
        const dotes = el("div", "art-dotes");
        dotes.textContent = "Dotes • kink and notes • civilated ink dirot sketching or orals";
        stage.appendChild(dotes);
        // L3: 3 polaroids with handwritten captions
        (p.images || []).slice(0, 3).forEach((img, i) => {
            const ph = el("div", "art-photo ap" + (i + 1));
            const im = document.createElement("img");
            im.src = img.src; im.alt = img.caption || ""; im.loading = "lazy";
            ph.appendChild(im);
            if (img.caption) { const c = el("span", "art-cap"); c.textContent = img.caption; ph.appendChild(c); }
            // L4: galaxy washi strip across the top of each photo (real star-washi art)
            const w = el("div", "art-washi w" + (i + 1));
            const wi = document.createElement("img");
            wi.src = assetPath("assets/resources/png/music/star washi.png");
            wi.alt = ""; wi.loading = "lazy"; wi.draggable = false;
            w.appendChild(wi);
            ph.appendChild(w);
            // L4: paperclip on painting photo, pushpins on makeup photo
            if (i === 0) {
                const clip = el("div", "shot-clip c1");
                const ci = document.createElement("img");
                ci.src = assetPath("assets/resources/svg/random/paper-clip-svgrepo-com.svg");
                ci.alt = ""; ci.loading = "lazy"; ci.draggable = false;
                clip.appendChild(ci);
                ph.appendChild(clip);
            }
            if (i === 1) {
                ["pin-svgrepo-com.svg", "pin-02-svgrepo-com.svg"].forEach((ps, k) => {
                    const pin = el("div", "art-pin p" + (k + 1));
                    const pi = document.createElement("img");
                    pi.src = assetPath("assets/resources/svg/random/" + ps);
                    pi.alt = ""; pi.loading = "lazy"; pi.draggable = false;
                    pin.appendChild(pi);
                    ph.appendChild(pin);
                });
            }
            stage.appendChild(ph);
        });
        // L5: hollow outline stars like the reference margins
        for (let s = 1; s <= 6; s++) {
            const star = el("span", "art-star s" + s);
            star.textContent = "★";
            stage.appendChild(star);
        }
        inner.appendChild(stage);
        pg.appendChild(inner);
        return pg;
    }

    function buildHobbiesRight(p) {
        const pg = el("div", "page page--hobbies-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        const card = el("div", "paper-card");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); card.appendChild(h2); }
        card.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        card.appendChild(body);
        inner.appendChild(card);
        pg.appendChild(inner);
        return pg;
    }

    /* PAGE 6 arcade collage, 5 layers (reference: gaming scrapbook):
       L2 ink doodles / L3 photo cards / L4 gold clip / L5 dpad + pad + wire + badges */
    function buildEditorialLeft(p) {
        const pg = el("div", "page page--editorial-left");
        const inner = el("div", "page-inner");
        const stage = el("div", "arcade-stage");
        // L2: thin hand-drawn ink music notes, tucked behind the photos
        const _ink = [["♪", 44, 27, -8], ["♫", 59, 43, 6], ["♩", 16, 55, -6], ["♪", 64, 64, 8], ["♩", 26, 84, -10]];
        _ink.forEach(([ch, x, y, r]) => {
            const n = el("span", "arcade-ink");
            n.textContent = ch;
            n.style.left = x + "%"; n.style.top = y + "%";
            n.style.setProperty("--r", r + "deg");
            stage.appendChild(n);
        });
        // L3: photo cards with caption banners
        (p.images || []).slice(0, 4).forEach((img, i) => {
            const ph = el("div", "arcade-photo ap" + (i + 1));
            const im = document.createElement("img");
            im.src = img.src; im.alt = img.caption || ""; im.loading = "lazy";
            ph.appendChild(im);
            if (img.caption) { const c = el("span", "arcade-cap"); c.textContent = img.caption; ph.appendChild(c); }
            stage.appendChild(ph);
        });
        // L2b: cropped sky-card peeking from behind the co-op photo (night-sky BG, clouds crop)
        stage.appendChild(el("div", "arcade-skycard"));
        // L2c: platformer ground strip along the bottom (grass + tiles crop)
        stage.appendChild(el("div", "arcade-ground"));
        // L2d: second night-sky crop (upper star field), layered above the cloud card
        stage.appendChild(el("div", "arcade-skycard top"));
        // L5b: headset hanging on the anchor photo's top-right corner
        const hs = el("div", "arcade-headset");
        const him = document.createElement("img");
        him.src = assetPath("assets/resources/png/gaming/new/headset.png");
        him.alt = ""; him.loading = "lazy"; him.draggable = false;
        hs.appendChild(him);
        stage.appendChild(hs);
        // L4: gold paperclip on the anchor photo's left edge
        const clip = el("div", "shot-clip c5");
        const cim = document.createElement("img");
        cim.src = assetPath("assets/resources/svg/random/paper-clip-svgrepo-com.svg");
        cim.alt = ""; cim.loading = "lazy"; cim.draggable = false;
        clip.appendChild(cim);
        stage.appendChild(clip);
        // L5: pixel text badges
        const up = el("div", "arcade-badge up"); up.textContent = "+1UP"; stage.appendChild(up);
        const st = el("div", "arcade-badge start"); st.textContent = "START"; stage.appendChild(st);
        const lv = el("div", "arcade-level"); lv.textContent = "LEVEL UP!"; stage.appendChild(lv);
        // L5: action button cluster (real 4-button art) bottom-left
        const dp = el("div", "arcade-dpad");
        const dpm = document.createElement("img");
        dpm.src = assetPath("assets/resources/svg/gaming/game-controller-2.svg");
        dpm.alt = ""; dpm.loading = "lazy"; dpm.draggable = false;
        dp.appendChild(dpm);
        stage.appendChild(dp);
        // L5: retro controller + wire, bottom-center
        const pad = el("div", "arcade-pad");
        const pim = document.createElement("img");
        pim.src = assetPath("assets/resources/png/gaming/new/controller 2.png");
        pim.alt = ""; pim.loading = "lazy"; pim.draggable = false;
        pad.appendChild(pim);
        stage.appendChild(pad);
        const wNS = "http://www.w3.org/2000/svg";
        const wire = document.createElementNS(wNS, "svg");
        wire.setAttribute("class", "arcade-wire");
        wire.setAttribute("viewBox", "0 0 100 40");
        const wp = document.createElementNS(wNS, "path");
        wp.setAttribute("d", "M4 32 Q 50 2 96 26");
        wp.setAttribute("fill", "none");
        wp.setAttribute("stroke", "#3a3a5a");
        wp.setAttribute("stroke-width", "3");
        wp.setAttribute("stroke-linecap", "round");
        wire.appendChild(wp);
        stage.appendChild(wire);
        // scattered sparkles
        const _sp = [[3, 32, "#ffb3d6", 13], [47, 14, "#8adcff", 12], [68, 34, "#ffd76b", 12],
                     [18, 68, "#c8a8ff", 11], [62, 58, "#ffffff", 11]];
        _sp.forEach((sd, idx) => {
            const s = el("span", "arcade-star");
            s.textContent = "★";
            s.style.left = sd[0] + "%"; s.style.top = sd[1] + "%";
            s.style.color = sd[2]; s.style.fontSize = sd[3] + "px";
            s.style.setProperty("--sr", ((idx * 53) % 30 - 15) + "deg");
            stage.appendChild(s);
        });
        inner.appendChild(stage);
        pg.appendChild(inner);
        return pg;
    }

    function buildEditorialRight(p) {
        const pg = el("div", "page page--editorial-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        const card = el("div", "paper-card");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); card.appendChild(h2); }
        card.appendChild(accentDivider());
        const body = el("div", "text-large");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        card.appendChild(body);
        inner.appendChild(card);
        pg.appendChild(inner);
        return pg;
    }

    function buildCollageLeft(p) {
        const pg = el("div", "page page--collage-left");
        const inner = el("div", "page-inner");
        const stage = el("div", "collage-stage");

        // twinkle star layer (premade parallax-star technique) + micro glowing dots + torn edge + torn lavender
        stage.appendChild(el("div", "collage-twinkle"));
        stage.appendChild(el("div", "collage-micro"));
        stage.appendChild(el("div", "collage-torn-edge"));
        stage.appendChild(el("div", "collage-torn"));

        // script-scattered glow dust, one element per dot — seeded RNG so the layout
        // stays identical across flips/reloads (stable while you tweak positions)
        let _seed = 20260815;
        const _rnd = () => { _seed = (_seed * 1664525 + 1013904223) >>> 0; return _seed / 4294967296; };
        const _dotCols = ["#ffffff", "#ffffff", "#ffd76b", "#ff9ec8", "#8adcff", "#c8a8ff"];
        // keep dust OFF the photos: negative space around each polaroid (shot rects + margin)
        const _excl = [[53, 2, 98, 34], [3, 31, 59, 66], [48, 64, 94, 99], [1, 66, 45, 97]];
        const _inExcl = (x, y) => _excl.some(r => x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]);
        for (let d = 0; d < 70; d++) {
            const dot = el("span", "collage-dot");
            let dx = 0, dy = 0;
            for (let tries = 0; tries < 8; tries++) {
                dx = 1.5 + _rnd() * 95;
                dy = 1.5 + _rnd() * 95;
                if (!_inExcl(dx, dy)) break;
            }
            dot.style.left = dx.toFixed(1) + "%";
            dot.style.top = dy.toFixed(1) + "%";
            dot.style.setProperty("--d", (2 + _rnd() * 3.6).toFixed(1) + "px");
            dot.style.setProperty("--c", _dotCols[Math.floor(_rnd() * _dotCols.length)]);
            dot.style.setProperty("--t", (1.8 + _rnd() * 3.2).toFixed(2) + "s");
            dot.style.animationDelay = (-_rnd() * 4).toFixed(2) + "s";
            stage.appendChild(dot);
        }

        // script outline stars for the emptier middle band (positions hand-picked, style from .collage-star)
        const _starDefs = [
            [1, 64, "#ffd76b", 14, "#ffc845"], [30, 63, "#ffffff", 11, "#9ecfff"],
            [50, 58, "#8adcff", 12, "#5ab8ff"], [62, 68, "#ffd76b", 13, "#ffc845"],
            [63, 62, "#ffb3d6", 12, "#ff7ab6"], [76, 52, "#ffffff", 14, "#9ecfff"],
            [50, 14, "#ffd76b", 11, "#ffc845"], [8, 64, "#ffb3d6", 11, "#ff7ab6"],
            [48, 70, "#8adcff", 12, "#5ab8ff"], [60, 97, "#ffd76b", 11, "#ffc845"],
            [46, 94, "#ffffff", 12, "#9ecfff"], [76, 97, "#ffb3d6", 10, "#ff7ab6"]
        ];
        _starDefs.forEach((sd, idx) => {
            const st = el("span", "collage-star");
            st.textContent = "★";
            st.style.left = sd[0] + "%";
            st.style.top = sd[1] + "%";
            st.style.fontSize = sd[3] + "px";
            st.style.webkitTextStrokeColor = sd[2];
            st.style.textShadow = "0 0 2px #fff, 0 0 8px " + sd[4] + ", 0 0 18px " + sd[4];
            st.style.setProperty("--sr", ((idx * 47) % 30 - 15) + "deg");
            st.style.animationDelay = (-idx * 0.4).toFixed(2) + "s";
            stage.appendChild(st);
        });

        // jelly balloons with bow + star confetti (reference top)
        (p.notes || []).forEach((note, i) => {
            const balloon = el("div", "collage-balloon balloon-" + (i + 1));
            const txt = el("span", "balloon-text");
            // allow \n line breaks from content.js
            txt.innerHTML = String(note).replace(/\n/g, "<br>");
            balloon.appendChild(txt);
            balloon.appendChild(el("span", "balloon-bow"));
            balloon.appendChild(el("span", "balloon-string"));
            stage.appendChild(balloon);
        });

        // pastel watercolor frame behind the karaoke focal (shot-2)
        const pfr = el("div", "collage-framebg");
        const pfi = document.createElement("img");
        pfi.src = assetPath("assets/resources/bg layer/pastel-frame.png");
        pfi.alt = ""; pfi.loading = "lazy"; pfi.draggable = false;
        pfr.appendChild(pfi);
        stage.appendChild(pfr);

        // 3 holographic polaroids with clips
        (p.images || []).forEach((img, i) => {
            const cell = el("div", "collage-shot shot-" + (i + 1));
            const im = document.createElement("img");
            im.src = img.src; im.alt = img.caption || ""; im.loading = "lazy";
            cell.appendChild(im);
            if (img.caption) { const c = el("span", "collage-cap"); c.textContent = img.caption; cell.appendChild(c); }
            // real paperclip art on the photo corners
            const _clipCls = ["c1", "c2", "c3", "c1"][i] || "c1";
            const _clip = el("div", "shot-clip " + _clipCls);
            const _cim = document.createElement("img");
            _cim.src = assetPath("assets/resources/svg/random/paper-clip-svgrepo-com.svg");
            _cim.alt = ""; _cim.loading = "lazy"; _cim.draggable = false;
            _clip.appendChild(_cim);
            cell.appendChild(_clip);
            stage.appendChild(cell);
        });

        // holographic headphone center — SVG version (crisp, no baked glow), glow removed per review
        const hp = el("div", "collage-headphone");
        const hpi = document.createElement("img");
        hpi.src = assetPath("assets/resources/png/music/headphone colorful.svg");
        hpi.alt = "Headphones";
        hpi.loading = "lazy";
        hp.appendChild(hpi);
        stage.appendChild(hp);

        // sound bars above headphone
        const bars = el("div", "collage-bars");
        for (let b = 0; b < 5; b++) bars.appendChild(el("span", "bar-" + b));
        stage.appendChild(bars);

        // scattered gradient music notes like reference
        const notes = ["♪", "♫", "♩", "♪", "♫", "♩", "♪"];
        const noteClasses = ["n1", "n2", "n3", "n4", "n5", "n6", "n7"];
        notes.forEach((ch, idx) => {
            const n = el("span", "collage-note " + noteClasses[idx]);
            n.textContent = ch;
            stage.appendChild(n);
        });

        // pink crystal mic bottom left
        const mic = el("div", "collage-mic");
        const mi = document.createElement("img");
        mi.src = assetPath("assets/resources/png/music/karaoke mic.png");
        mi.alt = "Mic";
        mi.loading = "lazy";
        mic.appendChild(mi);
        stage.appendChild(mic);

        // notebook + sheet music on right edge (uses your music page.png)
        const nb = el("div", "collage-notebook");
        const nbi = document.createElement("img");
        nbi.src = assetPath("assets/resources/png/music/music page.png");
        nbi.alt = "Sheet music";
        nbi.loading = "lazy";
        nb.appendChild(nbi);
        stage.appendChild(nb);

        // starry washi tapes — only corner anchors (strays removed)
        [1, 2, 4].forEach((w) => {
            stage.appendChild(el("div", "collage-washi w" + w));
        });

        // hollow glowing outline stars like reference (outlined ★ with neon halo)
        for (let s = 1; s <= 10; s++) {
            const star = el("span", "collage-star s" + s);
            star.textContent = "★";
            stage.appendChild(star);
        }

        // film grain over everything so bg + paper feel printed, not digital
        stage.appendChild(el("div", "collage-grain"));

        // ticket stub + moon sticker like reference
        const ticket = el("div", "collage-ticket");
        ticket.textContent = "Sing your heart out!";
        stage.appendChild(ticket);
        stage.appendChild(el("div", "collage-moon"));

        // bottom fairy lights on torn paper
        stage.appendChild(el("div", "collage-lights-b"));

        // extra draped light wires like the reference (diagonal strands across the page)
        for (let w = 1; w <= 3; w++) {
            stage.appendChild(el("div", "collage-wire w" + w));
        }

        // real pushpin art (alternating pin styles)
        const _pinSrc = ["pin-svgrepo-com.svg", "pin-02-svgrepo-com.svg", "pin-svgrepo-com.svg"];
        for (let pp = 1; pp <= 3; pp++) {
            const _pin = el("div", "collage-pin p" + pp);
            const _pim = document.createElement("img");
            _pim.src = assetPath("assets/resources/svg/random/" + _pinSrc[pp - 1]);
            _pim.alt = ""; _pim.loading = "lazy"; _pim.draggable = false;
            _pin.appendChild(_pim);
            stage.appendChild(_pin);
        }

        inner.appendChild(stage);
        pg.appendChild(inner);
        return pg;
    }

    function buildCollageRight(p) {
        const pg = el("div", "page page--collage-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        const card = el("div", "paper-card");
        if (p.kicker) { const k = el("span", "text-subtitle"); k.textContent = p.kicker; card.appendChild(k); }
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); card.appendChild(h2); }
        card.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        card.appendChild(body);
        if (p.tags && p.tags.length) {
            const wrap = el("div", "wish-categories");
            p.tags.forEach(t => { const tag = el("span", "wish-tag"); tag.textContent = t; wrap.appendChild(tag); });
            card.appendChild(wrap);
        }
        inner.appendChild(card);
        pg.appendChild(inner);
        return pg;
    }

    function buildGamingLeft(p) {
        const pg = el("div", "page page--gaming-left");
        const inner = el("div", "page-inner");
        // torn paper pieces layered behind the grid (irregular deckled scraps)
        for (let s = 1; s <= 3; s++) {
            inner.appendChild(el("div", "gaming-scrap s" + s));
        }
        const grid = el("div", "gaming-grid");
        (p.images || []).forEach(img => grid.appendChild(imgCellTag(img.src, img.tag, "gaming-cell", img)));
        inner.appendChild(grid);
        // central gold gutter with stars, like the reference divider
        inner.appendChild(el("div", "gaming-gutter"));
        pg.appendChild(inner);
        return pg;
    }

    function buildGamingRight(p) {
        const pg = el("div", "page page--gaming-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        const card = el("div", "paper-card");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); card.appendChild(h2); }
        if (p.date) { const d = el("span", "date-tag"); d.textContent = p.date; card.appendChild(d); }
        card.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        card.appendChild(body);
        inner.appendChild(card);
        pg.appendChild(inner);
        return pg;
    }

    function buildCinematicLeft(p) {
        const pg = el("div", "page page--cinematic-left");
        // watercolor galaxy blobs (bg layer 4, above dot + grid layers)
        pg.appendChild(el("div", "cine-blob tr"));
        pg.appendChild(el("div", "cine-blob bl"));
        // bg-layer experiment: real gradient art as blended layers (corner/blob/shape)
        const _bgl = [
            ["can be used on corener partially or by croping  gradiant.png", "bgl-corner"],
            ["Abstract Fluid Gradient Blob in Purple and Blue.png", "bgl-blob"],
            ["gradiant color shape.png", "bgl-shape"]
        ];
        _bgl.forEach(([file, cls]) => {
            const im = document.createElement("img");
            im.src = assetPath("assets/resources/bg layer/" + file);
            im.alt = ""; im.loading = "lazy"; im.draggable = false;
            im.className = "bg-layer " + cls;
            pg.appendChild(im);
        });
        // backing paper stock: kraft / book page / dot memo / ledger (bg layers 5-8)
        const inner = el("div", "page-inner");
        const stage = el("div", "cinema-stage");
        const imgs = p.images || [];

        for (let s = 1; s <= 4; s++) {
            stage.appendChild(el("div", "cine-paper p" + s));
        }

        /* torn hero photo (top-left) with taped corners + handwritten title */
        if (imgs[0]) {
            const hero = el("div", "cinema-hero");
            const him = document.createElement("img");
            him.src = imgs[0].src; him.alt = imgs[0].caption || ""; him.loading = "lazy";
            hero.appendChild(him);
            if (imgs[0].caption) { const hc = el("span", "cinema-hero-cap"); hc.textContent = imgs[0].caption; hero.appendChild(hc); }
            const mic = el("span", "cinema-micdoodle"); mic.textContent = "♪";
            hero.appendChild(mic);
            stage.appendChild(hero);
        }

        /* vertical film strip with 3 frames (top-right) */
        const strip = el("div", "cinema-strip");
        for (let i = 0; i < 3; i++) {
            const fr = el("div", "cinema-frame");
            const src = imgs[i] ? imgs[i].src : (imgs[0] ? imgs[0].src : "");
            if (src) {
                const fim = document.createElement("img");
                fim.src = src; fim.alt = ""; fim.loading = "lazy";
                fr.appendChild(fim);
            }
            strip.appendChild(fr);
        }
        stage.appendChild(strip);

        /* big 3D marquee letters */
        if (p.marquee) {
            const mq = el("div", "cinema-marquee");
            [...p.marquee].forEach((ch) => {
                const s = el("span", "cinema-letter" + (ch === " " ? " sp" : ""));
                s.textContent = ch === " " ? "\u00A0" : ch;
                mq.appendChild(s);
            });
            stage.appendChild(mq);
        }

        /* gold star sticker */
        const starNS = "http://www.w3.org/2000/svg";
        const starSvg = document.createElementNS(starNS, "svg");
        starSvg.setAttribute("class", "cinema-star");
        starSvg.setAttribute("viewBox", "0 0 100 100");
        const starPath = document.createElementNS(starNS, "polygon");
        starPath.setAttribute("points", "50,4 63,36 97,36 70,56 80,90 50,70 20,90 30,56 3,36 37,36");
        starSvg.appendChild(starPath);
        stage.appendChild(starSvg);

        /* hibiscus flower sticker */
        const flSvg = document.createElementNS(starNS, "svg");
        flSvg.setAttribute("class", "cinema-flower");
        flSvg.setAttribute("viewBox", "0 0 100 100");
        const petalCols = ["#f06a8a", "#ef7ba0", "#f492b4", "#ef7ba0", "#f06a8a"];
        for (let i = 0; i < 5; i++) {
            const pet = document.createElementNS(starNS, "ellipse");
            const ang = (i * 72 - 90) * Math.PI / 180;
            pet.setAttribute("cx", 50 + Math.cos(ang) * 26);
            pet.setAttribute("cy", 50 + Math.sin(ang) * 26);
            pet.setAttribute("rx", 17);
            pet.setAttribute("ry", 26);
            pet.setAttribute("fill", petalCols[i]);
            pet.setAttribute("transform", `rotate(${i * 72} 50 50)`);
            flSvg.appendChild(pet);
        }
        const stamen = document.createElementNS(starNS, "circle");
        stamen.setAttribute("cx", 50); stamen.setAttribute("cy", 50);
        stamen.setAttribute("r", 9); stamen.setAttribute("fill", "#ffd94d");
        flSvg.appendChild(stamen);
        stage.appendChild(flSvg);

        /* bottom-right polaroid with pin + hearts (reference) */
        if (imgs[2] || imgs[0]) {
            const pol = el("div", "cinema-polaroid");
            const pim = document.createElement("img");
            const psrc = imgs[2] ? imgs[2].src : imgs[0].src;
            pim.src = psrc; pim.alt = ""; pim.loading = "lazy";
            pol.appendChild(pim);
            pol.appendChild(el("div", "shot-clip c3"));
            const hearts = el("div", "cinema-hearts");
            ["#ff6b8a", "#4db8ff", "#b06bff"].forEach((hc) => {
                const h = el("span", "cinema-heart");
                h.textContent = "♥";
                h.style.color = hc;
                hearts.appendChild(h);
            });
            pol.appendChild(hearts);
            if (imgs[2] && imgs[2].caption) { const c = el("span", "cinema-cap"); c.textContent = imgs[2].caption; pol.appendChild(c); }
            else { const c = el("span", "cinema-cap"); c.textContent = "Memories with you ✦"; pol.appendChild(c); }
            stage.appendChild(pol);
        }

        /* cinema ticket stub (mid-left, distressed) */
        const ticket = el("div", "cinema-ticket");
        const t1 = el("span", "ticket-big"); t1.textContent = "ADMIT ONE";
        const t2 = el("span", "ticket-small"); t2.textContent = p.ticket || "DolIa x Heino";
        ticket.appendChild(t1); ticket.appendChild(t2);
        stage.appendChild(ticket);

        /* handwritten SHARED MEMORIES note (mid-right) */
        const shared = el("div", "cinema-shared");
        const sh1 = el("span", "shared-l1"); sh1.textContent = "SHARED";
        const sh2 = el("span", "shared-l2"); sh2.textContent = "MEMORIES";
        const sh3 = el("span", "shared-l3"); sh3.textContent = "GG WP!";
        const pad = document.createElement("img");
        pad.src = assetPath("assets/resources/svg/gaming/game-controller-svgrepo-com.svg");
        pad.alt = ""; pad.loading = "lazy"; pad.className = "shared-pad";
        shared.append(sh1, sh2, sh3, pad);
        stage.appendChild(shared);

        /* added drawing: photo-stamp tucked on the ticket's edge */
        if (imgs[3]) {
            const sk = el("div", "cinema-sketch");
            const sim = document.createElement("img");
            sim.src = imgs[3].src; sim.alt = ""; sim.loading = "lazy";
            sk.appendChild(sim);
            stage.appendChild(sk);
        }

        /* bottom-left game polaroid */
        if (imgs[4]) {
            const gm = el("div", "cinema-game");
            const gim = document.createElement("img");
            gim.src = imgs[4].src; gim.alt = imgs[4].caption || ""; gim.loading = "lazy";
            gm.appendChild(gim);
            if (imgs[4].caption) { const c = el("span", "cinema-cap"); c.textContent = imgs[4].caption; gm.appendChild(c); }
            const gp = document.createElement("img");
            gp.src = assetPath("assets/resources/svg/gaming/game-controller-svgrepo-com.svg");
            gp.alt = ""; gp.loading = "lazy"; gp.className = "game-pad";
            gm.appendChild(gp);
            stage.appendChild(gm);
        }

        inner.appendChild(stage);
        pg.appendChild(inner);
        return pg;
    }

    function buildCinematicRight(p) {
        const pg = el("div", "page page--cinematic-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        const card = el("div", "paper-card");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); card.appendChild(h2); }
        card.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        card.appendChild(body);
        inner.appendChild(card);
        pg.appendChild(inner);
        return pg;
    }

    function buildWishesLeft(p) {
        const pg = el("div", "page page--wishes-left");
        const inner = el("div", "page-inner");
        inner.appendChild(plate(p.art, { cls: "plate--full" }));
        pg.appendChild(inner);
        return pg;
    }

    function buildWishesRight(p) {
        const pg = el("div", "page page--wishes-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        const card = el("div", "paper-card");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); card.appendChild(h2); }
        card.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        card.appendChild(body);
        if (p.tags && p.tags.length) {
            const tags = el("div", "wish-categories");
            p.tags.forEach(t => { const tag = el("span", "wish-tag"); tag.textContent = t; tags.appendChild(tag); });
            card.appendChild(tags);
        }
        inner.appendChild(card);
        pg.appendChild(inner);
        return pg;
    }

    function buildClosing(p) {
        const pg = el("div", "page page--closing page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        inner.appendChild(plate(p.art, { cls: "closing-art" }));
        inner.appendChild(divider());
        const body = el("div", "closing-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        inner.appendChild(body);
        const row = el("div", "closing-row");
        const seal = el("span", "seal"); seal.setAttribute("aria-hidden", "true");
        seal.textContent = "\u751F\u8FB0";
        row.appendChild(seal);
        inner.appendChild(row);
        pg.appendChild(inner);
        return pg;
    }

    function buildEnd(p) {
        const pg = el("div", "page page--end");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        inner.appendChild(use("crest", "end-crest"));
        const note = el("p", "end-note"); note.appendChild(tok(p.note)); inner.appendChild(note);
        const mark = el("span", "end-mark"); mark.textContent = "\u2726"; inner.appendChild(mark);
        const sig = el("p", "end-sig"); sig.textContent = "From Heino"; inner.appendChild(sig);
        pg.appendChild(inner);
        return pg;
    }

    function buildBackCover(p) {
        const pg = el("div", "page page--back-cover");
        const inner = el("div", "page-inner");
        const mark = el("div", "back-cover-mark");
        mark.textContent = p.mark || "";
        inner.appendChild(mark);
        const bottle = el("div", "bottle-wrap");
        const bottleImg = document.createElement("img");
        bottleImg.src = assetPath("assets/resources/bottle message.png");
        bottleImg.alt = "Message in a bottle";
        bottleImg.loading = "lazy";
        bottle.appendChild(bottleImg);
        const secret = el("div", "bottle-secret");
        secret.textContent = p.secret || "";
        bottle.appendChild(secret);
        bottle.addEventListener("click", () => {
            bottle.classList.toggle("bottle-open");
        });
        inner.appendChild(bottle);
        const link = el("span", "back-cover-link");
        link.textContent = "Read again";
        link.setAttribute("role", "button");
        link.setAttribute("tabindex", "0");
        inner.appendChild(link);
        pg.appendChild(inner);
        return pg;
    }

    function buildBlank() {
        const pg = el("div", "page page--blank");
        pg.appendChild(use("crest"));
        pg.appendChild(grain());
        return pg;
    }

    function buildEmpty() {
        const pg = el("div", "page");
        pg.appendChild(grain());
        return pg;
    }

    /* ---------- scrapbook decorations ----------
       decor: [{src, x, y, w, rot, behind, flip, o, tape}]
       x/y = % left/top of page, w = % of page width.
       behind=true tucks it behind photos/text, otherwise it sits on top. */
    function renderDecor(pg, decor) {
        (decor || []).forEach((d) => {
            if (!d || !d.src) return;
            const w = el("div", "page-decor" + (d.behind ? " behind" : "") + (d.tape ? " taped" : ""));
            w.style.setProperty("--x", (d.x || 0) + "%");
            w.style.setProperty("--y", (d.y || 0) + "%");
            w.style.setProperty("--w", (d.w || 10) + "%");
            w.style.setProperty("--rot", (d.rot || 0) + "deg");
            w.style.setProperty("--flip", d.flip ? "-1" : "1");
            w.style.setProperty("--o", d.o != null ? d.o : 1);
            if (d.z != null) w.style.zIndex = d.z;
            const im = document.createElement("img");
            im.src = d.src; im.alt = ""; im.loading = "lazy";
            im.draggable = false;
            w.appendChild(im);
            pg.appendChild(w);
        });
    }

    function makePage(model) {
        if (model == null) return buildBlank();
        let pg;
        switch (model.type) {
            case "cover": pg = buildCover(model); break;
            case "intro-left": pg = buildIntroLeft(model); break;
            case "intro-right": pg = buildIntroRight(model); break;
            case "hobbies-left": pg = buildHobbiesLeft(model); break;
            case "hobbies-right": pg = buildHobbiesRight(model); break;
            case "editorial-left": pg = buildEditorialLeft(model); break;
            case "editorial-right": pg = buildEditorialRight(model); break;
            case "collage-left": pg = buildCollageLeft(model); break;
            case "collage-right": pg = buildCollageRight(model); break;
            case "gaming-left": pg = buildGamingLeft(model); break;
            case "gaming-right": pg = buildGamingRight(model); break;
            case "cinematic-left": pg = buildCinematicLeft(model); break;
            case "cinematic-right": pg = buildCinematicRight(model); break;
            case "wishes-left": pg = buildWishesLeft(model); break;
            case "wishes-right": pg = buildWishesRight(model); break;
            case "closing": pg = buildClosing(model); break;
            case "end": pg = buildEnd(model); break;
            case "back-cover": pg = buildBackCover(model); break;
            case "empty": pg = buildEmpty(); break;
            default: pg = buildBlank();
        }
        pg.appendChild(grain());
        if (model && model.sticker) {
            const s = stickerImg(model.sticker, "page-accent-sticker");
            if (s) pg.appendChild(s);
        }
        if (model && model.decor) renderDecor(pg, model.decor);
        if (model && model.texture) pg.classList.add("tex-" + model.texture);
        return pg;
    }
    /* ---------- views & layout ---------- */
    function buildViews() {
        views = [];
        if (mode === "double") {
            views.push([null, 0]);                    // closed book: cover on the right
            for (let i = 1; i < PAGES.length; i += 2) {
                views.push([i, i + 1 < PAGES.length ? i + 1 : null]);
            }
        } else {
            for (let i = 0; i < PAGES.length; i++) views.push([i, null]);
        }
    }

    function renderView(idx) {
        const v = views[idx];
        if (mode === "single") {
            slotLeft.replaceChildren();
            const sp = makePage(pageModel(v[0]));
            sp.classList.add("tex-side-r");
            slotRight.replaceChildren(sp);
            anchor = v[0];
        } else {
            if (v[0] === null) {
                const mark = el("div", "empty-mark"); mark.appendChild(use("crest"));
                slotLeft.replaceChildren(mark);
            } else {
                slotLeft.replaceChildren(makePage(pageModel(v[0])));
            }
            const rp = makePage(pageModel(v[1]));
            rp.classList.add("tex-side-r");
            slotRight.replaceChildren(rp);
            anchor = v[0] !== null ? v[0] : v[1];
        }
        book.classList.toggle("is-closed", mode === "double" && v[0] === null);
        _savePersist(); // DEV PERSIST: remember page after render (revertable) — saved here, not in updateUI
    }

    function updateUI() {
        const v = views[cursor];
        const nums = v.filter(x => x !== null).map(x => x + 1);
        counterEl.textContent = nums.length === 2
            ? `Pages ${nums[0]} \u00B7 ${nums[1]} / ${PAGES.length}`
            : `Page ${nums[0]} / ${PAGES.length}`;
        progressEl.style.width = (views.length > 1 ? (cursor / (views.length - 1)) * 100 : 0) + "%";
        btnPrev.disabled = cursor === 0;
        btnNext.disabled = cursor === views.length - 1;
    }

    function layout() {
        mode = mqDouble.matches ? "double" : "single";
        buildViews();
        // DEV PERSIST: restore last page on reload (revertable block)
        const _persisted = _loadPersist();
        if (_persisted !== null && _persisted >= 0 && _persisted < PAGES.length) anchor = _persisted;
        let idx = views.findIndex(v => v[0] === anchor || v[1] === anchor);
        cursor = idx < 0 ? 0 : idx;
        book.classList.toggle("mode-double", mode === "double");
        book.classList.toggle("mode-single", mode === "single");
        renderView(cursor);
        updateUI();
    }

    /* ---------- page turning ---------- */
    function hideHint() { hint.classList.add("gone"); stage.classList.add("seen"); }

    function fadeSwap(target) {
        book.classList.add("is-fading");
        setTimeout(() => {
            cursor = target;
            renderView(cursor);
            book.classList.remove("is-fading");
            updateUI();
            lock = false;
        }, 200);
    }

    function buildSheet(dir, target) {
        const cur = views[cursor], tgt = views[target];
        let frontIdx, backIdx;
        if (mode === "single") { frontIdx = cur[0]; backIdx = tgt[0]; }
        else if (dir > 0) { frontIdx = cur[1]; backIdx = tgt[0]; }
        else { frontIdx = cur[0]; backIdx = tgt[1]; }

        const sheet = el("div", "sheet " + (dir > 0 ? "dir-fwd" : "dir-bwd"));
        const frontPg = makePage(pageModel(frontIdx));
        const backPg = makePage(pageModel(backIdx));
        /* keep right-side texture phase stable mid-flip: the sheet lives
           outside .slot-right, so the side must ride on the page itself */
        const frontIsRight = mode === "single" || (mode === "double" && dir > 0);
        const backIsRight = mode === "single" || (mode === "double" && dir < 0);
        if (frontIsRight) frontPg.classList.add("tex-side-r");
        if (backIsRight) backPg.classList.add("tex-side-r");
        const front = el("div", "face face--front"); front.appendChild(frontPg);
        const back = el("div", "face face--back"); back.appendChild(backPg);
        sheet.append(front, back);
        return sheet;
    }

    function flip(dir) {
        if (lock) return;
        const target = cursor + dir;
        if (target < 0 || target >= views.length) return;
        hideHint();
        lock = true;
        if (mqReduce.matches) { fadeSwap(target); return; }
        const sheet = buildSheet(dir, target);
        /* Pre-render ONLY the slot the sheet covers â€” the other
           slot must stay unchanged until the flip completes. */
        const v = views[target];
        if (mode === "single") {
            slotRight.replaceChildren(makePage(pageModel(v[0])));
        } else if (dir > 0) {
            /* forward: sheet covers right half */
            slotRight.replaceChildren(makePage(pageModel(v[1])));
        } else {
            /* backward: sheet covers left half */
            if (v[0] !== null) slotLeft.replaceChildren(makePage(pageModel(v[0])));
            else slotLeft.replaceChildren(el("div", "empty-mark"));
        }
        cursor = target;
        updateUI();
        book.appendChild(sheet);
        book.classList.add("is-flipping");
        requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("turning")));
        const cleanup = () => {
            sheet.remove();
            book.classList.remove("is-flipping");
            /* Now update the OTHER slot that we didn't touch yet */
            renderView(cursor);
            lock = false;
        };
        sheet.addEventListener("transitionend", cleanup, { once: true });
        setTimeout(cleanup, getFlipMs() + 200);
    }

    const AUTO_FLIP_TOTAL_MS = 200;

    function autoFlipToFront() {
        if (lock || cursor <= 0) return;
        const steps = cursor;
        const autoDur = Math.max(40, Math.floor(AUTO_FLIP_TOTAL_MS / steps));
        function step() {
            if (cursor <= 0) return;
            if (lock) { setTimeout(step, 10); return; }
            const target = cursor - 1;
            const sheet = buildSheet(-1, target);
            sheet.style.setProperty("--flip-dur", autoDur + "ms");
            sheet.style.setProperty("--flip-ease", "linear");
            const v = views[target];
            if (mode === "single") {
                slotRight.replaceChildren(makePage(pageModel(v[0])));
            } else {
                if (v[0] !== null) slotLeft.replaceChildren(makePage(pageModel(v[0])));
                else slotLeft.replaceChildren(el("div", "empty-mark"));
            }
            cursor = target;
            updateUI();
            book.appendChild(sheet);
            book.classList.add("is-flipping");
            requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("turning")));
            let cleaned = false;
            const cleanup = () => {
                if (cleaned) return;
                cleaned = true;
                sheet.remove();
                book.classList.remove("is-flipping");
                renderView(cursor);
                lock = false;
                if (cursor > 0) setTimeout(step, 20);
            };
            sheet.addEventListener("transitionend", cleanup, { once: true });
            setTimeout(cleanup, autoDur + 100);
            lock = true;
        }
        step();
    }

    function goTo(target) {
        if (lock || target === cursor || target < 0 || target >= views.length) return;
        hideHint();
        lock = true;
        fadeSwap(target);
    }

    /* ---------- input: buttons, keyboard, swipe/tap ---------- */
    btnPrev.addEventListener("click", () => flip(-1));
    btnNext.addEventListener("click", () => flip(1));

    /* ---------- music toggle ---------- */
    (function initMusicToggle() {
        const btn = $("#btnMusic");
        const music = document.getElementById("bgMusic");
        if (!btn || !music) return;
        btn.addEventListener("click", function () {
            if (music.paused) {
                music.play().catch(function () { });
                btn.classList.remove("muted");
                btn.setAttribute("aria-pressed", "true");
            } else {
                music.pause();
                btn.classList.add("muted");
                btn.setAttribute("aria-pressed", "false");
            }
        });
    })();

    document.addEventListener("click", (e) => {
        if (e.target.closest(".back-cover-link")) {
            e.preventDefault();
            e.stopPropagation();
            autoFlipToFront();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.closest(".back-cover-link")) {
            e.preventDefault();
            autoFlipToFront();
        }
    });

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowRight": case "PageDown": e.preventDefault(); flip(1); break;
            case "ArrowLeft": case "PageUp": e.preventDefault(); flip(-1); break;
            case "Home": e.preventDefault(); goTo(0); break;
            case "End": e.preventDefault(); goTo(views.length - 1); break;
        }
    });

    let px = 0, py = 0, tracking = false;
    stage.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch") return;
        if (e.target.closest("button, .back-cover-link, .bottle-wrap")) return;
        tracking = true; px = e.clientX; py = e.clientY;
        try { stage.setPointerCapture(e.pointerId); } catch (_) { }
    });
    stage.addEventListener("pointerup", (e) => {
        if (e.pointerType === "touch") return;
        if (!tracking) return;
        tracking = false;
        const dx = e.clientX - px, dy = e.clientY - py;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            flip(dx < 0 ? 1 : -1);
        } else if (Math.hypot(dx, dy) < 12) {
            const r = stage.getBoundingClientRect();
            const xr = (e.clientX - r.left) / r.width;
            if (xr > 0.72) flip(1);
            else if (xr < 0.28) flip(-1);
        }
    });
    stage.addEventListener("pointercancel", () => { tracking = false; });

    /* ---------- touch swipe (mobile) ---------- */
    let tsX = 0, tsY = 0, tsT = 0, tTracking = false;
    stage.addEventListener("touchstart", (e) => {
        if (e.target.closest("button, .back-cover-link, .bottle-wrap")) return;
        const t = e.touches[0];
        tsX = t.clientX; tsY = t.clientY; tsT = Date.now();
        tTracking = true;
    }, { passive: true });

    stage.addEventListener("touchend", (e) => {
        if (!tTracking) return;
        tTracking = false;
        const t = e.changedTouches[0];
        const dx = t.clientX - tsX, dy = t.clientY - tsY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            flip(dx < 0 ? 1 : -1);
        } else if (Math.hypot(dx, dy) < 12 && Date.now() - tsT < 400) {
            const r = stage.getBoundingClientRect();
            const xr = (t.clientX - r.left) / r.width;
            if (xr > 0.72) flip(1);
            else if (xr < 0.28) flip(-1);
        }
    }, { passive: true });

    stage.addEventListener("touchcancel", () => { tTracking = false; }, { passive: true });

    mqDouble.addEventListener("change", layout);

    /* ---------- ambient motes ---------- */
    (function spawnMotes() {
        const host = $("#motes");
        for (let i = 0; i < 16; i++) {
            const m = el("span", "mote");
            m.style.left = (4 + Math.random() * 92) + "%";
            m.style.setProperty("--sz", (6 + Math.random() * 8).toFixed(1) + "px");
            m.style.setProperty("--d", (9 + Math.random() * 9).toFixed(1) + "s");
            m.style.setProperty("--delay", (-Math.random() * 18).toFixed(1) + "s");
            m.style.setProperty("--sx", (Math.random() * 60 - 30).toFixed(0) + "px");
            m.style.setProperty("--o", (0.6 + Math.random() * 0.35).toFixed(2));
            m.style.setProperty("--c", "rgba(190,230,255,.85)");
            host.appendChild(m);
        }
    })();

    setTimeout(hideHint, 9000);

    /* ---------- lightbox ---------- */
    (function initLightbox() {
        const lightbox = $("#lightbox");
        const lightboxImg = $("#lightboxImg");
        const lightboxClose = $("#lightboxClose");
        if (!lightbox || !lightboxImg || !lightboxClose) return;

        function openLightbox(src, alt) {
            lightboxImg.src = src;
            lightboxImg.alt = alt || "";
            lightbox.classList.add("active");
        }

        function closeLightbox() {
            lightbox.classList.remove("active");
            lightboxImg.src = "";
        }

        /* Delegate click on any clickable image */
        document.addEventListener("click", (e) => {
            const img = e.target.closest(".plate-media img, .hobby-cell img, .art-photo > img, .editorial-cell img, .gaming-cell img, .arcade-photo > img, .collage-shot img, .cinema-hero img, .cinema-frame img, .cinema-polaroid img, .cinema-game img, .cinema-sketch img");
            if (img && img.src) {
                e.stopPropagation();
                openLightbox(img.src, img.alt);
            }
        });

        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    })();

    /* ---------- init ---------- */
    /* Preload every image into browser cache so flips are instant */
    PAGES.forEach(p => {
        if (p && p.art && p.art.src) {
            const im = new Image();
            im.src = String(p.art.src).replace(/\\/g, "/");
        }
    });
    layout();
})();
