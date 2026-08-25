/* ================================================================
   BIRTHDAY BOOK — Content Template

   6 spreads (12 pages) + cover + back-cover partner = 15 entries

   PAGE TYPES:
     "cover"           — front cover
     "intro-left"      — Spread 1 left: birthday image
     "intro-right"     — Spread 1 right: birthday message
     "hobbies-left"    — Spread 2 left: image grid
     "hobbies-right"   — Spread 2 right: wishes
     "editorial-left"  — Spread 3 left: varied image layout
     "editorial-right" — Spread 3 right: combined message
     "gaming-left"     — Spread 4 left: gaming screenshots grid
     "gaming-right"    — Spread 4 right: captions + message
     "cinematic-left"  — Spread 5 left: cinematic moments
     "cinematic-right" — Spread 5 right: observations
     "wishes-left"     — Spread 6 left: beautiful image
     "wishes-right"    — Spread 6 right: final wishes + tags
     "back-cover"      — final back cover, placed on the left

   FIELDS PER TYPE:
     All types:   cornerImg (optional)
     Left types:  art {token, src, scale, fit} OR images [{src, caption, tag, span2}]
     Right types: title, body[], kicker, date, tags[]
=============================================================== */
const IMG = (file) => `assets/images/${file}`;
const RES = (file) => `assets/resources/${file}`;

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
let _ci = 0;
const nextCorner = () => CORNERS[_ci++ % CORNERS.length];

const PAGES = [

    /* ═══ COVER ═══════════════════════════════════════════════ */
    {
        type: "cover",
        art: { token: "COVER", src: IMG("lovers.jpg"), scale: 10 },
        title: "Heino x Dolia",
        recipient: "Dolia",
        date: "15/08/2026",
        sticker: RES("adorable dolia heart.png")
    },

    /* ═══ SPREAD 1: Birthday Introduction ════════════════════ */
    {
        type: "intro-left",
        art: { token: "BIRTHDAY", src: RES("Dolia-celebrating.png"), scale: 5, fit: "contain" }
    },
    {
        type: "intro-right",
        kicker: "Happy Birthday",
        title: "This Book Is For You",
        body: [
            "A collection of moments, memories,",
            "and the little things that make you, you.",
            "",
            "Happy birthday, Dolia."
        ],
        cornerImg: nextCorner()
    },

    /* ═══ SPREAD 2: Her Interests / Hobbies ══════════════════ */
    {
        type: "hobbies-left",
        gridClass: "cols-2",
        images: [
            { src: IMG("dolia doing karate.png"), caption: "Karate" },
            { src: IMG("dolia doing makup.png"), caption: "Makeup" },
            { src: IMG("dolia doing makeup day.png"), caption: "Makeup Day" },
            { src: IMG("dolia listening to music.png"), caption: "Music" }
        ]
    },
    {
        type: "hobbies-right",
        title: "The Things You Love",
        body: [
            "I remembered the things you told me about.",
            "Every hobby, every passion — they all make you who you are."
        ],
        cornerImg: nextCorner()
    },

    /* ═══ SPREAD 3: More of Her World ════════════════════════ */
    {
        type: "editorial-left",
        images: [
            { src: IMG("dolia doing karate.png"), span2: false },
            { src: IMG("dolia listening to music.png"), span2: true },
            { src: IMG("dolia doing makup.png"), span2: false }
        ]
    },
    {
        type: "editorial-right",
        title: "Discovering Your World",
        body: [
            "There is always more to learn about the people we care about.",
            "Your interests paint a beautiful picture of who you are."
        ],
        cornerImg: nextCorner()
    },

    /* ═══ SPREAD 4: Shared Gaming Memories ═══════════════════ */
    {
        type: "gaming-left",
        images: [
            { src: IMG("dolia singing on karoke heino sitting behind.png"), tag: "Karaoke Night" },
            { src: IMG("dolia doing karate.png"), tag: "Achievement" },
            { src: IMG("dolia doing makeup day.png"), tag: "Screenshot" },
            { src: IMG("dolia listening to music.png"), tag: "Milestone" },
            { src: IMG("dolia doing makup.png"), tag: "Victory" },
            { src: IMG("Dolia-celebrating.png"), tag: "Level Up" }
        ]
    },
    {
        type: "gaming-right",
        title: "Our Shared Memories",
        date: "2024 - 2026",
        body: [
            "Every match, every win, every laugh —",
            "these are the experiences we built together."
        ],
        cornerImg: nextCorner()
    },

    /* ═══ SPREAD 5: Favorite Shared Moments ══════════════════ */
    {
        type: "cinematic-left",
        images: [
            { src: IMG("dolia singing on karoke heino sitting behind.png"), span2: true },
            { src: IMG("Dolia-celebrating.png"), span2: false },
            { src: IMG("dolia resisting.png"), span2: false }
        ]
    },
    {
        type: "cinematic-right",
        title: "Moments I Hold Close",
        body: [
            "The video call that turned into a three-hour conversation.",
            "The night we stayed up talking until sunrise.",
            "These moments are why I am grateful for you."
        ],
        cornerImg: nextCorner()
    },

    /* ═══ SPREAD 6: Wishes for the Year Ahead ════════════════ */
    {
        type: "wishes-left",
        art: { token: "WISHES", src: IMG("dolia x heino sitting on water dolia on marmaid form.jpg"), scale: 5 }
    },
    {
        type: "wishes-right",
        title: "Wishes for Your Year Ahead",
        body: [
            "May this new year bring you everything you deserve.",
            "Happiness, creativity, adventure, and endless fun.",
            "Keep being the wonderful person you are."
        ],
        tags: ["Happiness", "Creativity", "Adventure", "Fun", "Memories", "Growth"],
        cornerImg: nextCorner()
    },

    /* ═══ END PAGE — signature ═══════════════════════════════ */
    {
        type: "end",
        note: "This book was made with love, just for you."
    },

    /* Empty right page — add a photo here later */
    { type: "empty" },

    /* ═══ BACK COVER ═════════════════════════════════════════ */
    {
        type: "back-cover",
        mark: "DOLIA",
        secret: "You are the ocean's favorite princess. Happy Birthday, Dolia."
    },
];
