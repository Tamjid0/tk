/* ================================================================
   ✦  EDIT THIS FILE ONLY  ✦

   1. Replace every "[TOKEN]" string with your real text.
   2. Drop images into  assets/images/  using the filenames below
      (or change the filenames here). Until an image exists, an
      ornamental placeholder is shown automatically.
   3. Spread pairing is automatic: after the cover, pages pair up
      left/right on wide screens, one-by-one on phones.
   4. Each art object supports a "scale" property (integer 1-9).
      5 = default. Below 5 = zoomed out, above 5 = zoomed in.
=============================================================== */
const IMG = (file) => `assets/images/${file}`;

const PAGES = [

    /* 1 · COVER ─────────────────────────────────────────────── */
    {
        type: "cover",
        art: { token: "COVER_ART", src: IMG("lovers.jpg"), scale: 5 },
        title: "Heino x dolia",
        recipient: "Dolia",
        date: "15/08/2026"
    },

    /* 2 · OPENING ───────────────────────────────────────────── */
    {
        type: "opening",
        kicker: "Prologue",
        title: "Hello",
        body: [
            "This little book is a collection of moments —",
            "the hobbies you love, the memories we share,",
            "and all the little things that make you, you.",
            "Happy birthday, Dolia."
        ]
    },

    /* 3 · FRONTISPIECE — the mermaid art ────────────────────── */
    {
        type: "frontispiece",
        art: { token: "OPENING_ART", src: IMG("dolia x heino sitting on water dolia on marmaid form.jpg"), tint: "aqua", scale: 5 },
        caption: "Where the water meets the light"
    },

    /* 4 · PHOTO — karate (bold, active hobby) ───────────────── */
    {
        type: "photo",
        art: { token: "HOBBY_KARATE", src: IMG("dolia doing karate.png"), scale: 5 },
        caption: "Dolia doing what she does best"
    },

    /* 5 · VIGNETTE — makeup (quiet moment) ─────────────────── */
    {
        type: "vignette",
        art: { token: "HOBBY_MAKEUP", src: IMG("dolia doing makup.png"), tint: "aqua", scale: 6 },
        caption: "The art of getting ready",
        body: ["Some moments are quiet, intentional, and entirely yours."]
    },

    /* 6 · PHOTO — makeup day (fun, candid) ──────────────────── */
    {
        type: "photo",
        art: { token: "HOBBY_MAKEUP_DAY", src: IMG("dolia doing makeup day.png"), scale: 4 },
        caption: "Makeup day — every look tells a story"
    },

    /* 7 · VIGNETTE — music (introspective) ──────────────────── */
    {
        type: "vignette",
        art: { token: "HOBBY_MUSIC", src: IMG("dolia listening to music.png"), tint: "aqua", scale: 7 },
        caption: "Lost in the rhythm",
        body: ["Music says what words sometimes can't. This one's for the quiet times."]
    },

    /* 8 · FULL-IMAGE — karaoke (the hero shot) ──────────────── */
    {
        type: "full",
        art: { token: "HERO_MEMORY", src: IMG("dolia singing on karoke heino sitting behind.png"), tint: "aqua", scale: 5 },
        caption: "Sing like nobody's listening — but I always am"
    },

    /* 9 · MESSAGE ───────────────────────────────────────────── */
    {
        type: "message",
        kicker: "A Wish",
        body: [
            "May this new year bring you",
            "as much joy as you bring to everyone around you.",
            "Keep singing, keep fighting,",
            "keep being the wonderful person you are."
        ]
    },

    /* 10 · CLOSING ──────────────────────────────────────────── */
    {
        type: "closing",
        art: { token: "CLOSING_ART", src: IMG("lovers.jpg"), scale: 5 },
        body: [
            "This book is yours to keep —",
            "a small reminder of the big and small moments",
            "that make our friendship what it is.",
            "Happy birthday, dear Dolia."
        ]
    },

    /* 11 · END PAPER ────────────────────────────────────────── */
    {
        type: "end",
        note: "Made with love, for Dolia — 15 August 2026"
    },
];
