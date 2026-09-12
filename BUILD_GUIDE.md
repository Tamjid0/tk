# Build Guide — Single-File Gift Version

The project ships in two forms:

1. **Hosted site** (`index.html` + `css/` + `js/` + `assets/`) — what GitHub Pages serves. Edit files here.
2. **Gift file** (`dist/dolia-book.html`) — one self-contained HTML file with all images and music embedded. Open anywhere, works offline forever.

## One-time setup

Install [Node.js](https://nodejs.org) (LTS), then in the project folder:

```powershell
npm install
```

This installs the two build tools (`sharp` for image compression, `ffmpeg-static` for audio).

## Building the gift file

```powershell
npm run build:gift
```

Output: `dist/dolia-book.html`

That's it. The build:

- Scans every asset reference in `index.html`, `css/styles.css`, `js/content.js`, `js/flipbook.js`
- Compresses images to WebP (quality 88, max 1400px; stickers quality 96) and audio to 192kbps
- Embeds everything as base64 and inlines the CSS/JS into one HTML

## After changing content or code

Just re-run `npm run build:gift`. New images you add through `IMG()` or `RES()` in `js/content.js` are picked up automatically.

The build stops with a clear message if:

- A referenced image or audio file **does not exist** (it lists the missing file and where it's used)
- Code accesses an asset **without** going through `assetPath()` / `IMG()` / `RES()` (it lists the spot to fix)

## Adding new assets safely

1. Put the file in the right folder (`assets/images/` for photos, `assets/resources/` for stickers/props, `assets/audio/` for music)
2. Reference it with `IMG("file.png")`, `RES("file.png")`, or `assetPath("assets/...")`
3. Re-run the build

Do **not** write raw paths like `img.src = "assets/images/x.png"` — the build will refuse to produce the gift file until it's wrapped in `assetPath()`.

## Hosted version

Nothing to build. Push to GitHub and the site works as before. The embedded-assets lookup only activates inside the gift file.

## Notes

- `dist/` and `node_modules/` are gitignored — the gift file is not committed.
- Typical result: ~38 MB of source assets compress to a ~12 MB single file.
- If you want to tune quality/size, edit the numbers at the top of `build-single.js`.
