/* ================================================================
   ✦  EDIT THIS FILE ONLY  ✦

   PAGE TYPES:
     "cover"        — title page with art, title, recipient, date
     "opening"      — prologue text page
     "spread-left"  — left page of a 2-page spread (image only)
     "spread-right" — right page of a 2-page spread (text + corner image)
     "full"         — full-page image
     "message"      — special wish/message page
     "closing"      — closing page with art + text
     "end"          — final end-paper

   ART OBJECT:
     { token, src, scale(1-9), fit("cover"|"contain") }

   CORNER IMAGE (right page top-right corner):
     cornerImg: "assets/resources/filename.png"
     Set to null or omit to skip.

   ADDING PAGES:
     Just add more entries to the PAGES array below.
     Spread pairs: put spread-left then spread-right in sequence.
=============================================================== */
const IMG = (file) => `assets/images/${file}`;
const RES = (file) => `assets/resources/${file}`;

/* Corner images — randomly assigned or explicitly set */
const CORNERS = [
    RES("adorable dolia heart.png"),
    RES("Dolia-celebrating.png"),
    RES("Dolia-crying.png"),
    RES("Dolia-determined.png"),
    RES("Dolia-hi.png"),
    RES("Dolia-lying.png"),
    RES("Dolia-surprised.png"),
    RES("Dolia-thinking.png"),
    RES("dolia resisting.png"),
    RES("Dolia-crying 2.png"),
    RES("Dolia-valantine day.png"),
];
let _cornerIdx = 0;
const nextCorner = () => CORNERS[_cornerIdx++ % CORNERS.length];

const PAGES = [

    /* 1 · COVER ─────────────────────────────────────────────── */
    {
        type: "cover",
        art: { token: "COVER_ART", src: IMG("lovers.jpg"), scale: 10 },
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

    /* (blank page to align spreads correctly) */
    null,

    /* ─── SPREAD 1: Karate ────────────────────────────────── */
    {
        type: "spread-left",
        art: { token: "HOBBY_KARATE", src: IMG("dolia doing karate.png"), scale: 5 }
    },
    {
        type: "spread-right",
        title: "Karate",
        body: ["Write your wishes for this hobby here..."],
        cornerImg: nextCorner()
    },

    /* ─── SPREAD 2: Makeup ────────────────────────────────── */
    {
        type: "spread-left",
        art: { token: "HOBBY_MAKEUP", src: IMG("dolia doing makup.png"), scale: 6 }
    },
    {
        type: "spread-right",
        title: "Makeup",
        body: ["Write your wishes for this hobby here..."],
        cornerImg: nextCorner()
    },

    /* ─── SPREAD 3: Makeup Day ────────────────────────────── */
    {
        type: "spread-left",
        art: { token: "HOBBY_MAKEUP_DAY", src: IMG("dolia doing makeup day.png"), scale: 4 }
    },
    {
        type: "spread-right",
        title: "Makeup Day",
        body: ["Write your wishes for this hobby here..."],
        cornerImg: nextCorner()
    },

    /* ─── SPREAD 4: Music ─────────────────────────────────── */
    {
        type: "spread-left",
        art: { token: "HOBBY_MUSIC", src: IMG("dolia listening to music.png"), scale: 7 }
    },
    {
        type: "spread-right",
        title: "Music",
        body: ["Write your wishes for this hobby here..."],
        cornerImg: nextCorner()
    },

    /* ─── SPREAD 5: Karaoke ───────────────────────────────── */
    {
        type: "spread-left",
        art: { token: "HERO_MEMORY", src: IMG("dolia singing on karoke heino sitting behind.png"), scale: 5 }
    },
    {
        type: "spread-right",
        title: "Karaoke",
        body: ["Write your wishes for this hobby here..."],
        cornerImg: nextCorner()
    },

    /* ─── CLOSING ─────────────────────────────────────────── */
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

    /* ─── END PAPER ───────────────────────────────────────── */
    {
        type: "end",
        note: "Made with love, for Dolia — 15 August 2026"
    },
];
