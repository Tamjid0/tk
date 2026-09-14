/* ================================================================
   BIRTHDAY BOOK — Content Template

    7 spreads (14 pages) + cover + end + back-cover = 18 entries

    PAGE TYPES:
      "cover"           — front cover
      "intro-left"      — Spread 1 left: birthday image
      "intro-right"     — Spread 1 right: birthday message
      "hobbies-left"    — Spread 2 left: image grid
      "hobbies-right"   — Spread 2 right: wishes
      "editorial-left"  — Spread 3 left: varied image layout
      "editorial-right" — Spread 3 right: combined message
      "collage-left"    — Spread 4 left: scattered collage, 3 photos + balloon notes
      "collage-right"   — Spread 4 right: message + tags
      "gaming-left"     — Spread 5 left: gaming screenshots grid
      "gaming-right"    — Spread 5 right: captions + message
      "cinematic-left"  — Spread 6 left: movie-night scrapbook (marquee + ticket)
      "cinematic-right" — Spread 6 right: observations
      "wishes-left"     — Spread 7 left: beautiful image
      "wishes-right"    — Spread 7 right: final wishes + tags
      "back-cover"      — final back cover, placed on the left

    FIELDS PER TYPE:
      All types:   cornerImg (optional), decor[] (optional scrapbook stickers)
      Left types:  art {token, src, scale, fit} OR images [{src, caption, tag, span2}]
      Right types: title, body[], kicker, date, tags[]
      decor item:  {src, x, y, w, rot, behind, flip, o, tape, z}
                   x/y = % left/top, w = % of page width, rot = degrees.
                   behind=true tucks behind photos/text; tape=true adds washi tape.
 =============================================================== */
const IMG = (file) => assetPath(`assets/images/${file}`);
const RES = (file) => assetPath(`assets/resources/${file}`);

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
        art: { token: "COVER", src: IMG("lovers.jpg"), scale: 6 },
        title: "Heino x Dolia",
        recipient: "Dolia",
        date: "15/08/2026",
        sticker: RES("adorable dolia heart.png")
    },

    /* ═══ SPREAD 1: Birthday Introduction ════════════════════ */
    {
        type: "intro-left",
        texture: "dots",
        art: { token: "BIRTHDAY", src: RES("Dolia-celebrating.png"), scale: 5, fit: "contain" },
        decor: [
            { src: RES("png/fish.png"), x: 82, y: 5, w: 12, rot: 12 },
            { src: RES("png/seaweed/yello coral.png"), x: 2, y: 82, w: 13, rot: -8 }
        ]
    },
    {
        type: "intro-right",
        texture: "dots",
        kicker: "Happy Birthday",
        title: "This Book Is For You",
        body: [
            "A collection of moments, memories,",
            "and the little things that make you, you.",
            "",
            "Happy birthday, Dolia."
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("png/shell/normal single shell.png"), x: 80, y: 82, w: 12, rot: 14 },
            { src: RES("png/paste color sea squid.png"), x: 4, y: 6, w: 10, rot: -10 }
        ]
    },

    /* ═══ SPREAD 2: ART — The Artist In You ══════════════════ */
    {
        type: "hobbies-left",
        texture: "stars",
        gridClass: "cols-2",
        images: [
            { src: IMG("dolia doing karate.png"), caption: "Karate" },
            { src: IMG("dolia doing makup.png"), caption: "Makeup" },
            { src: IMG("dolia doing makeup day.png"), caption: "Makeup Day" },
            { src: IMG("dolia listening to music.png"), caption: "Music" }
        ],
        decor: [
            { src: RES("svg/art/art-brush-general-svgrepo-com.svg"), x: -3, y: 2, w: 14, rot: -16, behind: true },
            { src: RES("svg/art/art-palette-svgrepo-com.svg"), x: 60, y: 40, w: 35, rot: -9 },
            { src: RES("svg/art/pencil.svg"), x: 75, y: 90, w: 17, rot: 24 }
        ]
    },
    {
        type: "hobbies-right",
        texture: "stars",
        title: "The Artist In You",
        body: [
            "Every blank page is a new little world,",
            "and you fill each one with color.",
            "",
            "Keep drawing — your imagination is",
            "my favorite gallery."
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("svg/art/art-brush-general-svgrepo-com.svg"), x: 84, y: 3, w: 9, rot: 12 },
            { src: RES("svg/art/art-palette-svgrepo-com.svg"), x: 2, y: 88, w: 8, rot: -6 }
        ]
    },

    /* ═══ SPREAD 3: GAMING — Your Player Two ═════════════════ */
    {
        type: "editorial-left",
        texture: "diamonds",
        images: [
            { src: IMG("dolia doing karate.png"), span2: false },
            { src: IMG("dolia listening to music.png"), span2: true },
            { src: IMG("dolia doing makup.png"), span2: false }
        ],
        decor: [
            { src: RES("svg/gaming/game-controller-2.svg"), x: -2, y: 78, w: 24, rot: -9, behind: true },
            { src: RES("svg/gaming/game heart.svg"), x: 86, y: 4, w: 10, rot: 12 },
            { src: RES("png/gaming/dolia x heino gaming dolia crying.png"), x: 2, y: 3, w: 26, rot: -5, tape: true }
        ]
    },
    {
        type: "editorial-right",
        texture: "diamonds",
        title: "Your Player Two",
        body: [
            "Side by side, controllers in hand —",
            "win or lose, every round with you is fun.",
            "",
            "Heino will always be your player two."
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("svg/gaming/game-controller-svgrepo-com.svg"), x: 82, y: 68, w: 12, rot: 8 },
            { src: RES("svg/gaming/game heart.svg"), x: 5, y: 5, w: 7, rot: -10 }
        ]
    },

    /* ═══ SPREAD 4: The Music In You — GALAXY (reference 1:1) ═══ */
    {
        type: "collage-left",
        texture: "", // galaxy handled in CSS, no paper texture
        images: [
            { src: IMG("dolia listening to music.png"), caption: "Always listening ♡" },
            { src: IMG("dolia singing on karoke heino sitting behind.png"), caption: "Karaoke nights!" },
            { src: IMG("little dolia.webp"), caption: "Lost in a melody ☆" }
        ],
        notes: [
            "Always humming\na tune",
            "Karaoke\nnights!"
        ],
        // mic/headphone/washi/notebook are built inside buildCollageLeft itself (galaxy scrapbook), not via generic decor
        decor: []
    },
    {
        type: "collage-right",
        texture: "notes",
        kicker: "Music",
        title: "The Music In You",
        body: [
            "Wherever you go, a melody follows —",
            "your headphones, your playlists, your quiet humming.",
            "",
            "You carry music with you like a little light.",
            "And of all the songs in the world,",
            "karaoke nights with you are my favorite."
        ],
        tags: ["Playlists", "Karaoke", "Singing", "Daydreams"],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("svg/music/music3.svg"), x: 6, y: 66, w: 11, rot: -10, o: 0.85 },
            { src: RES("svg/music/music4.svg"), x: 79, y: 20, w: 11, rot: -10, o: 0.85 },
            { src: RES("png/music/music note violet.png"), x: 82, y: 82, w: 7, rot: 12, o: 0.9 }
        ]
    },

    /* ═══ SPREAD 5: Mixed Hobbies — Little Things You Love ══ */
    {
        type: "gaming-left",
        texture: "confetti",
        images: [
            { src: IMG("dolia doing karate.png"), tag: "Achievement" },
            { src: IMG("dolia cute dress.jpg"), tag: "Cute Dress" },
            { src: IMG("dolia doing makeup day.png"), tag: "Makeup" },
            { src: IMG("dolia lazying around.jpg"), tag: "Lazying around" },
            { src: IMG("dolia eating delicious food.jpg"), tag: "Delicious food" },
            { src: RES("Dolia-celebrating.png"), tag: "Level Up" }
        ],
        decor: [
            { src: RES("svg/art/pencil.svg"), x: 0, y: 1, w: 9, rot: -12 },
            { src: RES("svg/gaming/game heart.svg"), x: 90, y: 2, w: 8, rot: 10 },
            { src: RES("png/music/music note purple.png"), x: 1, y: 90, w: 8, rot: -8 },
            { src: RES("png/shell/spiral shell and normal shell.png"), x: 88, y: 89, w: 10, rot: 13 }
        ]
    },
    {
        type: "gaming-right",
        texture: "confetti",
        title: "Little Things You Love",
        date: "2024 - 2026",
        body: [
            "Karaoke nights, little doodles,",
            "games, songs, and everything between —",
            "",
            "this page is a pocket full of",
            "your favorite things."
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("png/music/music note violet.png"), x: 84, y: 4, w: 8, rot: 12 },
            { src: RES("svg/gaming/game heart.svg"), x: 3, y: 87, w: 9, rot: -8 }
        ]
    },

    /* ═══ SPREAD 6: Favorite Shared Moments ══════════════════ */
    {
        type: "cinematic-left",
        texture: "sparkles",
        marquee: "",
        ticket: "DolIa x Heino",
        images: [
            { src: IMG("dolia singing on karoke heino sitting behind.png") },
            { src: RES("Dolia-celebrating.png") },
            { src: RES("dolia resisting.png") }
        ],
        decor: [
            { src: RES("png/fish.png"), x: 2, y: 1, w: 10, rot: -12 },
            { src: RES("sea shell.png"), x: 85, y: 86, w: 11, rot: 10 }
        ]
    },
    {
        type: "cinematic-right",
        texture: "sparkles",
        title: "Moments I Hold Close",
        body: [
            "The video call that turned into a three-hour conversation.",
            "The night we stayed up talking until sunrise.",
            "These moments are why I am grateful for you."
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("png/seaweed/green sea weed.png"), x: 85, y: 90, w: 12, rot: 4 }
        ]
    },

    /* ═══ SPREAD 7: Wishes for the Year Ahead ════════════════ */
    {
        type: "wishes-left",
        texture: "wishes",
        art: { token: "WISHES", src: IMG("dolia x heino sitting on water dolia on marmaid form.jpg"), scale: 5 },
        decor: [
            { src: RES("png/seaweed/long sea weed long pink.png"), x: 86, y: 5, w: 10, rot: -4 },
            { src: RES("anchor.png"), x: 2, y: 84, w: 13, rot: -10 }
        ]
    },
    {
        type: "wishes-right",
        texture: "wishes",
        title: "Wishes for Your Year Ahead",
        body: [
            "May this new year bring you everything you deserve.",
            "Happiness, creativity, adventure, and endless fun.",
            "Keep being the wonderful person you are."
        ],
        tags: ["Happiness", "Creativity", "Adventure", "Fun", "Memories", "Growth"],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("png/coral/blue coral.png"), x: 84, y: 50, w: 15, rot: 5 },
            { src: RES("svg/starfish.svg"), x: 6, y: 29, w: 10, rot: -12 }
        ]
    },

    /* ═══ END PAGE — signature ═══════════════════════════════ */
    {
        type: "end",
        texture: "dots",
        note: "This book was made with love, just for you.",
        decor: [
            { src: RES("png/coral/read corsal.png"), x: 82, y: 4, w: 11, rot: 12 }
        ]
    },

    /* Empty right page — add a photo here later */
    { type: "empty" },

    /* ═══ BACK COVER ═════════════════════════════════════════ */
    {
        type: "back-cover",
        mark: "DOLIA",
        secret: "You are the ocean's favorite princess. Happy Birthday, Dolia.",
        decor: [
            { src: RES("png/fish.png"), x: 4, y: 8, w: 9, rot: -8 }
        ]
    },
];
