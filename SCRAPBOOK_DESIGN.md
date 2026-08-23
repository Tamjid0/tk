# Birthday Scrapbook Design

## Goal

Redesign the birthday book as a premium fantasy-ocean scrapbook rather than a conventional greeting card or a sequence of generic image grids.

The visual story should progress through three ideas:

1. I remembered what Dolia shared.
2. We have shared memories.
3. I wish her a wonderful year ahead.

The exact wording will be edited later in `js/content.js`. The design must not invent memories that are not represented by supplied material.

## Planned Structure

The approved structure is six visual spreads, twelve pages total, plus a separate front cover.

| Section | Left page | Right page | Visual purpose |
|---|---|---|---|
| Cover | Minimal birthday cover | N/A | Establish the gift and recipient |
| 1. Birthday Introduction | One strong birthday image | Large birthday message | Clean opening chapter |
| 2. Her Interests | Hobby scrapbook composition | Short connected reflections | Show that her interests were remembered |
| 3. More of Her World | Editorial, asymmetrical composition | Larger combined message | Continue discovery without repeating Spread 2 |
| 4. Shared Gaming Memories | Achievement or timeline composition | Captions and short message | Documentary shared experiences |
| 5. Favorite Shared Moments | Cinematic layered composition | Observations and captions | More intimate, still natural |
| 6. Year Ahead | One strong final image | Final wishes and categories | Positive birthday ending |

An optional back/end paper can be added later, but it is not part of the required twelve-page count.

## Visual Direction

The book uses a consistent visual language, but no two spreads should use the same composition.

- Ocean-fantasy palette: deep navy, Dolia sky blue, teal, pearl, coral, lavender, and shell gold.
- Background: supplied underwater artwork with restrained overlays, not a CSS-generated reef scene.
- Page surface: soft paper tones, subtle grain, and controlled contrast.
- Images: physical scrapbook prints with tape, pins, shadows, rotation, and varied scale where appropriate.
- Text: consistent serif display and readable body typography, with handwritten accents used sparingly.
- Decorations: supplied stickers, coral, shells, and line art are optional blocks, never automatic clutter.
- Whitespace: empty space is intentional and should not be filled just to use every asset.

## Freeform Page Model

Each page is an independent artboard. Pages should be composed from blocks rather than forced into one shared grid.

Supported block concepts:

- `photo`: image with position, size, rotation, fit, tape, and caption controls.
- `text`: title, body, position, width, alignment, and style controls.
- `sticker`: transparent PNG or SVG positioned independently.
- `paper`: torn-paper or note backing behind text.
- `doodle`: decorative line art or ocean element.
- `rule`: restrained divider or date marker.

Coordinates should be percentages of the page so the composition remains responsive. Layer order should be explicit so photos, tape, text, and stickers can overlap predictably.

Example future page definition:

```js
{
    type: "custom-page",
    theme: "lavender-paper",
    blocks: [
        {
            kind: "photo",
            src: IMG("photo-a.png"),
            x: 8, y: 10, width: 42,
            rotate: -6,
            fit: "cover",
            tape: true,
            z: 2
        },
        {
            kind: "text",
            title: "A small memory",
            body: ["Replace this text later."],
            x: 12, y: 58, width: 40,
            style: "handwritten",
            z: 3
        }
    ]
}
```

## Pilot Pages

The first implementation contains only these three redesigned pages:

### Pilot 1: Front Cover

- Minimal birthday-focused hierarchy.
- One prominent rounded or polaroid-style image.
- Strong readable title and recipient name.
- Ocean navy background with visible aqua and pearl contrast.
- One optional sticker accent, not a collection of decorations.

### Pilot 2: Birthday Introduction, Image Page

- One strong birthday image.
- Image treated as a physical scrapbook print with tape and a soft shadow.
- No collage and no unrelated text blocks.
- Enough surrounding space for the image to feel deliberate.

### Pilot 3: Birthday Introduction, Message Page

- Large birthday message with generous whitespace.
- One small sticker in the upper-right corner.
- Optional paper-note backing for the message.
- No additional image grid.

## Acceptance Criteria For Pilot

- The cover is immediately readable at desktop and mobile sizes.
- The first interior spread clearly reads as image left, message right.
- The pages feel designed individually, not like repeated cards.
- Photos have believable physical depth without excessive shadows.
- Stickers are visible but do not compete with the main content.
- No page unexpectedly scrolls because of decorative positioning.
- Existing page-turn behavior and image lightbox remain unchanged.
- No changes are pushed until the pilot is accepted.

## Editing Rules

- Content and asset choices belong in `js/content.js`.
- Layout and visual treatment belong in `css/styles.css` and page builders.
- Every page-specific option should have a documented field.
- Missing assets must show the existing placeholder instead of silently breaking the book.
- Do not reuse placeholder hobby images for gaming or shared-memory sections once real assets are supplied.

## Back Cover

After the final wishes spread, the user turns one normal page. The back cover is index 13, so the existing spread engine places it on the left side with a blank partner page on the right. There is no special closing animation or extra button. Normal previous-page navigation remains available from the back-cover view.
