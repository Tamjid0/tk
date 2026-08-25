# Progress Tracker

## Completed

### Core Framework
- [x] Flipbook engine (page turns, double/single mode, keyboard/swipe/tap input)
- [x] Image lightbox (tap any photo to zoom, ESC/click to close)
- [x] Responsive layout (mobile single-page, desktop double-page spread)
- [x] Ocean-themed color palette (Dolia mermaid: sky blue, teal, coral, gold, pearl)
- [x] Ocean background image (`ocean-bg.jpg`)
- [x] Image `fit` parameter (cover/contain per image in content.js)
- [x] Image `scale` parameter (1-9 zoom per image in content.js)

### Design System
- [x] Freeform scrapbook page model defined (photo, text, sticker, paper, doodle, rule blocks)
- [x] Each spread has a unique layout composition (no repeated grids)
- [x] Polaroid sticky-note photo style (white border, tape, rotation, shadow)
- [x] Corner stickers from chibi Dolia images (11 variations, auto-cycled)
- [x] Book depth improvements (spine shadow, page edges, paper texture)

### Pages — 6 Spreads + Cover + Back Cover
- [x] **Cover**: Ocean navy background, circular art, title, recipient, date, sticker
- [x] **Spread 1 — Birthday Introduction**: Left = single photo with tape, Right = message card with sticker
- [x] **Spread 2 — Her Interests**: Left = 4 scattered photo prints, Right = reflections text
- [x] **Spread 3 — More of Her World**: Left = editorial dominant-photo layout, Right = combined message
- [x] **Spread 4 — Shared Gaming Memories**: Left = notebook-style achievement timeline, Right = captions + date tag
- [x] **Spread 5 — Favorite Shared Moments**: Left = cinematic film-strip layout, Right = memory cards
- [x] **Spread 6 — Year Ahead**: Left = postcard-style hero photo, Right = final wishes + category tags
- [x] **Back Cover**: Dark ocean panel on left side, "Read again" link, blank right side

### Interactions
- [x] Normal page flip (keyboard arrows, swipe, edge tap, prev/next buttons)
- [x] Back cover "Read again" auto-flips all pages back to front cover
- [x] Auto-flip speed controlled by `AUTO_FLIP_TOTAL_MS` (default 1000ms)
- [x] Reduced motion support (fades instead of flips)

### Content
- [x] `content.js` template with all page types documented
- [x] 5 hobby images used across spreads
- [x] Placeholder text for all pages (user fills in real content)

---

## Not Yet Done

### Content (User)
- [ ] Fill in real birthday wishes text for each spread
- [ ] Add real gaming screenshots / shared memory images
- [ ] Add real shared moments images (video call, karaoke, etc.)
- [ ] Replace placeholder closing message

### Visual Polish
- [ ] Paper texture/noise on all pages
- [ ] Consistent border-frame style across all spread types
- [ ] Page edge stack effect (visible page thickness)
- [ ] Gold foil text effect on cover title
- [ ] Cover redesign with stickers (user collecting)
- [ ] Reduce/eliminate repeating placeholder images across spreads

### Interactive Features
- [ ] Background music toggle (ocean ambience)
- [ ] Page flip sound effect
- [ ] Auto-play mode (hands-free reading)
- [ ] Confetti/sparkle burst on back cover
- [ ] Share button (generate shareable link)
- [ ] PWA support (offline, add to home screen)

### Single Page Mode
- [ ] Fix single-mode spread layout (currently shows half-spread)
- [ ] Ensure back cover works correctly in single mode

---

## Notes

- Branch: `redesign` (pushed to origin)
- Design doc: `SCRAPBOOK_DESIGN.md`
- Flipbook engine: `js/flipbook.js`
- Content definitions: `js/content.js`
- Styles: `css/styles.css`
- Assets: `assets/images/` (hobby + ocean bg), `assets/resources/` (stickers, coral, shells)
- Auto-flip speed: `AUTO_FLIP_TOTAL_MS` in flipbook.js (line ~541)
