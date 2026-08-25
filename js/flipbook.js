/* ================================================================
   Flipbook engine â€” vanilla JS, no dependencies, no network.
   You should not need to edit this file.
================================================================ */
(() => {
    "use strict";

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
    const RES = "assets/resources/";

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

    function imgCellTag(src, tag, cls) {
        const cell = el("div", cls);
        cell.style.setProperty("--rot", randRot() + "deg");
        cell.style.setProperty("--tape-rot", (Math.random() * 6 - 3).toFixed(1) + "deg");
        const im = document.createElement("img");
        im.src = src; im.alt = ""; im.loading = "lazy";
        cell.appendChild(im);
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
        const POOL = 50;
        const bubbles = [];
        let bx = [], by = [], bvx = [], bvy = [], bsize = [], live = [];
        const colors = [
            "rgba(91,181,224,0.55)",
            "rgba(78,205,196,0.50)",
            "rgba(232,238,248,0.45)",
            "rgba(192,184,224,0.40)",
            "rgba(255,255,255,0.50)"
        ];

        for (let i = 0; i < POOL; i++) {
            const d = document.createElement("div");
            d.className = "cur-bubble";
            d.style.cssText = "position:fixed;border-radius:50%;pointer-events:none;z-index:9999;display:none;";
            document.body.appendChild(d);
            bubbles.push(d);
            bx[i] = by[i] = bvx[i] = bvy[i] = bsize[i] = 0;
            live[i] = false;
        }

        function spawn(cx, cy, count) {
            let spawned = 0;
            for (let i = 0; i < POOL && spawned < count; i++) {
                if (!live[i]) {
                    const sz = 10 + Math.random() * 18;
                    bx[i] = cx - sz / 2 + (Math.random() - 0.5) * 20;
                    by[i] = cy - sz / 2 + (Math.random() - 0.5) * 20;
                    bvx[i] = (Math.random() - 0.5) * 1.5;
                    bvy[i] = -(1.5 + Math.random() * 2.5);
                    bsize[i] = sz;
                    live[i] = true;
                    const b = bubbles[i];
                    b.style.width = sz + "px";
                    b.style.height = sz + "px";
                    b.style.background = "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), " + colors[Math.floor(Math.random() * colors.length)] + " 60%, transparent)";
                    b.style.border = "1px solid rgba(255,255,255,0.25)";
                    b.style.left = bx[i] + "px";
                    b.style.top = by[i] + "px";
                    b.style.display = "block";
                    b.style.opacity = "1";
                    spawned++;
                }
            }
        }

        let lastMx = 0, lastMy = 0, frameId = null;
        function tick() {
            for (let i = 0; i < POOL; i++) {
                if (!live[i]) continue;
                by[i] += bvy[i];
                bx[i] += bvx[i];
                bvy[i] *= 0.98;
                bsize[i] *= 0.995;
                const b = bubbles[i];
                const op = parseFloat(b.style.opacity) - 0.012;
                if (op <= 0 || by[i] < -50) {
                    b.style.display = "none";
                    live[i] = false;
                    continue;
                }
                b.style.opacity = op;
                b.style.left = bx[i] + "px";
                b.style.top = by[i] + "px";
                b.style.width = bsize[i] + "px";
                b.style.height = bsize[i] + "px";
            }
            frameId = requestAnimationFrame(tick);
        }
        tick();

        document.addEventListener("mousemove", function(e) {
            const dx = e.clientX - lastMx, dy = e.clientY - lastMy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 12) {
                spawn(e.clientX, e.clientY, 1);
                lastMx = e.clientX;
                lastMy = e.clientY;
            }
        });

        document.addEventListener("mousedown", function(e) {
            spawn(e.clientX, e.clientY, 5);
        });

        window.spawnBubbles = function(x, y, count) {
            spawn(x, y, count || 8);
        };
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

    function buildHobbiesLeft(p) {
        const pg = el("div", "page page--hobbies-left");
        const inner = el("div", "page-inner");
        const grid = el("div", "hobby-grid " + (p.gridClass || "cols-2"));
        (p.images || []).forEach(img => grid.appendChild(imgCell(img.src, img.caption, "hobby-cell")));
        inner.appendChild(grid);
        pg.appendChild(inner);
        return pg;
    }

    function buildHobbiesRight(p) {
        const pg = el("div", "page page--hobbies-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); inner.appendChild(h2); }
        inner.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        inner.appendChild(body);
        pg.appendChild(inner);
        return pg;
    }

    function buildEditorialLeft(p) {
        const pg = el("div", "page page--editorial-left");
        const inner = el("div", "page-inner");
        const grid = el("div", "editorial-grid");
        (p.images || []).forEach(img => grid.appendChild(imgCellSpan(img.src, img.span2, "editorial-cell")));
        inner.appendChild(grid);
        pg.appendChild(inner);
        return pg;
    }

    function buildEditorialRight(p) {
        const pg = el("div", "page page--editorial-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); inner.appendChild(h2); }
        inner.appendChild(accentDivider());
        const body = el("div", "text-large");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        inner.appendChild(body);
        pg.appendChild(inner);
        return pg;
    }

    function buildGamingLeft(p) {
        const pg = el("div", "page page--gaming-left");
        const inner = el("div", "page-inner");
        const grid = el("div", "gaming-grid");
        (p.images || []).forEach(img => grid.appendChild(imgCellTag(img.src, img.tag, "gaming-cell")));
        inner.appendChild(grid);
        pg.appendChild(inner);
        return pg;
    }

    function buildGamingRight(p) {
        const pg = el("div", "page page--gaming-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); inner.appendChild(h2); }
        if (p.date) { const d = el("span", "date-tag"); d.textContent = p.date; inner.appendChild(d); }
        inner.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        inner.appendChild(body);
        pg.appendChild(inner);
        return pg;
    }

    function buildCinematicLeft(p) {
        const pg = el("div", "page page--cinematic-left");
        const inner = el("div", "page-inner");
        const grid = el("div", "cinema-grid");
        (p.images || []).forEach(img => grid.appendChild(imgCellSpan(img.src, img.span2, "cinema-cell")));
        inner.appendChild(grid);
        pg.appendChild(inner);
        return pg;
    }

    function buildCinematicRight(p) {
        const pg = el("div", "page page--cinematic-right page--text-page page--framed");
        if (p.cornerImg) { const c = cornerImg(p.cornerImg); if (c) pg.appendChild(c); }
        const inner = el("div", "page-inner");
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); inner.appendChild(h2); }
        inner.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        inner.appendChild(body);
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
        if (p.title) { const h2 = el("h2", "text-title"); h2.appendChild(tok(p.title)); inner.appendChild(h2); }
        inner.appendChild(accentDivider());
        const body = el("div", "text-body");
        (p.body || []).forEach(line => { const para = el("p"); para.appendChild(tok(line)); body.appendChild(para); });
        inner.appendChild(body);
        if (p.tags && p.tags.length) {
            const tags = el("div", "wish-categories");
            p.tags.forEach(t => { const tag = el("span", "wish-tag"); tag.textContent = t; tags.appendChild(tag); });
            inner.appendChild(tags);
        }
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
        bottleImg.src = RES + "bottle message.png";
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
            slotRight.replaceChildren(makePage(pageModel(v[0])));
            anchor = v[0];
        } else {
            if (v[0] === null) {
                const mark = el("div", "empty-mark"); mark.appendChild(use("crest"));
                slotLeft.replaceChildren(mark);
            } else {
                slotLeft.replaceChildren(makePage(pageModel(v[0])));
            }
            slotRight.replaceChildren(makePage(pageModel(v[1])));
            anchor = v[0] !== null ? v[0] : v[1];
        }
        book.classList.toggle("is-closed", mode === "double" && v[0] === null);
    }

    function updateUI() {
        const v = views[cursor];
        const nums = v.filter(x => x !== null).map(x => x + 1);
        counterEl.textContent = nums.length === 2
            ? `Pages ${nums[0]} Â· ${nums[1]} / ${PAGES.length}`
            : `Page ${nums[0]} / ${PAGES.length}`;
        progressEl.style.width = (views.length > 1 ? (cursor / (views.length - 1)) * 100 : 0) + "%";
        btnPrev.disabled = cursor === 0;
        btnNext.disabled = cursor === views.length - 1;
    }

    function layout() {
        mode = mqDouble.matches ? "double" : "single";
        buildViews();
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
        const front = el("div", "face face--front"); front.appendChild(makePage(pageModel(frontIdx)));
        const back = el("div", "face face--back"); back.appendChild(makePage(pageModel(backIdx)));
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
        if (typeof spawnBubbles === "function") {
            const r = book.getBoundingClientRect();
            spawnBubbles(r.left + r.width / 2, r.top + r.height / 2, 8);
        }
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
            if (typeof spawnBubbles === "function") {
                const r = book.getBoundingClientRect();
                spawnBubbles(r.left + r.width / 2, r.top + r.height / 2, 6);
            }
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
        if (e.target.closest("button, .back-cover-link, .bottle-wrap")) return;
        tracking = true; px = e.clientX; py = e.clientY;
        try { stage.setPointerCapture(e.pointerId); } catch (_) { }
    });
    stage.addEventListener("pointerup", (e) => {
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

    mqDouble.addEventListener("change", layout);

    /* ---------- ambient motes ---------- */
    (function spawnMotes() {
        const host = $("#motes");
        for (let i = 0; i < 14; i++) {
            const m = el("span", "mote");
            const aqua = i % 3 === 0;
            m.style.left = (4 + Math.random() * 92) + "%";
            m.style.setProperty("--sz", (2.5 + Math.random() * 3.5).toFixed(1) + "px");
            m.style.setProperty("--d", (12 + Math.random() * 12).toFixed(1) + "s");
            m.style.setProperty("--delay", (-Math.random() * 22).toFixed(1) + "s");
            m.style.setProperty("--sx", (Math.random() * 40 - 20).toFixed(0) + "px");
            m.style.setProperty("--o", (0.45 + Math.random() * 0.4).toFixed(2));
            m.style.setProperty("--c", aqua ? "rgba(78,205,196,.9)" : "rgba(91,181,224,.9)");
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
            const img = e.target.closest(".plate-media img, .hobby-cell img, .editorial-cell img, .gaming-cell img, .cinema-cell img");
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
