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
        date: "15/08/2026"
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
            { src: RES("png/paste color sea squid.png"), x: 4, y: 6, w: 10, rot: -10 },
            { src: RES("png/sea elements/pearl.png"), x: 66, y: 5, w: 9, rot: 8, behind: true },
            { src: RES("png/sea elements/seahorse.png"), x: 2, y: 40, w: 11, rot: -8, behind: true },
            { src: RES("png/cute/star.png"), x: 12, y: 76, w: 8, rot: 12 },
            { src: RES("png/sea elements/sailboat.png"), x: 24, y: 85, w: 11, rot: -6 }
        ]
    },

    /* ═══ SPREAD 2: ART — Creative Arts scrapbook (reference: painting/makeup/sketch collage) ===
       PAGE 4 art-stage, 5 layers: graph paper + watercolor washes / kraft + staff-paper
       scraps / 3 polaroids / galaxy washi + clip + pins / rainbow titles + art stickers. */
    {
        type: "hobbies-left",
        texture: "",
        images: [
            { src: IMG("dolia cute dress.jpg"), caption: "Dress-Up Art" },
            { src: IMG("dolia doing makup.png"), caption: "Creative Makeup" },
            { src: IMG("dolia drawing heino.jpg"), caption: "Digital Sketching!" }
        ],
        decor: [
            { src: RES("png/art/color-palette.png"), x: 40, y: 30, w: 19, rot: -8 },
            { src: RES("png/art/paint-tube.png"), x: -2, y: 10, w: 20, rot: -28 },
            { src: RES("png/art/paint-brush.png"), x: 44, y: 52, w: 18, rot: 28 },
            { src: RES("png/art/paint-tube.png"), x: 52, y: 82, w: 17, rot: 24 },
            { src: RES("png/art/crayons.png"), x: 1, y: 70, w: 12, rot: 8 }
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
            { src: RES("svg/art/art-brush-general-svgrepo-com.svg"), x: 64, y: 5, w: 9, rot: 12, behind: true },
            { src: RES("svg/art/art-palette-svgrepo-com.svg"), x: 2, y: 88, w: 8, rot: -6 },
            { src: RES("svg/art/colors.svg"), x: 5, y: 32, w: 10, rot: -10, behind: true },
            { src: RES("svg/art/pencil3.svg"), x: 88, y: 32, w: 8, rot: 14 },
            { src: RES("png/art/paint-brush.png"), x: 8, y: 70, w: 12, rot: -14 },
            { src: RES("svg/art/pencil2.svg"), x: 30, y: 86, w: 9, rot: 10 }
        ]
    },

    /* ═══ SPREAD 3: GAMING — Your Player Two ═════════════════
       PAGE 6 arcade collage, 5 layers: grid paper + washes / ink doodles /
       4 photo cards / washi + gold clip / dpad + consoles + badges. */
    {
        type: "editorial-left",
        texture: "",
        images: [
            { src: IMG("dolia lazying around.jpg"), caption: "Sweet Dreams" },
            { src: IMG("dolia playing pve.jpg"), caption: "In My Zone" },
            { src: IMG("Dolia-determined.png"), caption: "Hi-yah! Karate Master!" },
            { src: RES("png/gaming/dolia x heino gaming dolia crying.png"), caption: "Co-op Mode!" }
        ],
        decor: [
            { src: RES("svg/gaming/game heart.svg"), x: 76, y: 1, w: 13, rot: -6 },
            { src: RES("svg/gaming/game heart.svg"), x: 87, y: 5, w: 9, rot: 8 },
            { src: RES("png/gaming/new/psv.png"), x: 70, y: 50, w: 25, rot: 5 },
            { src: RES("png/gaming/new/game 3.png"), x: 31, y: 70, w: 19, rot: -5 },
            { src: RES("png/gaming/grandmaster must use.png"), x: 44, y: 1, w: 14, rot: 4 },
            { src: RES("png/gaming/new/rpg-game.png"), x: 44, y:44, w: 13, rot: -8 },
            { src: RES("png/gaming/new/videogame.png"), x: 44, y: 77, w: 13, rot: 5 },
            { src: RES("png/gaming/new/buttons.png"), x: 3, y: 67, w: 17, rot: -4 }
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
            { src: RES("svg/gaming/game heart.svg"), x: 5, y: 5, w: 7, rot: -10 },
            { src: RES("svg/gaming/game.svg"), x: 6, y: 30, w: 10, rot: -8, behind: true },
            { src: RES("png/level up/level-up.png"), x: 66, y: 6, w: 12, rot: 8, behind: true },
            { src: RES("png/level up/cheer.png"), x: 8, y: 80, w: 11, rot: -10 },
            { src: RES("svg/gaming/ipad.svg"), x: 70, y: 84, w: 11, rot: -6 }
        ]
    },

    /* ═══ SPREAD 4: The Music In You — GALAXY (reference 1:1) ═══ */
    {
        type: "collage-left",
        texture: "", // galaxy handled in CSS, no paper texture
        images: [
            { src: IMG("dolia listening to music.png"), caption: "Always listening ♡" },
            { src: IMG("dolia singing on karoke heino sitting behind.png"), caption: "Karaoke nights!" },
            { src: IMG("little dolia.webp"), caption: "Lost in a melody ☆" },
            { src: IMG("dolia listening.jpg"), caption: "On repeat ♪" }
        ],
        notes: [
            "Always humming\na tune",
            "Karaoke\nnights!"
        ],
        // mic/headphone/washi/notebook are built inside buildCollageLeft itself (galaxy scrapbook), not via generic decor
        decor: [
            { src: RES("png/music/new/mp3.png"), x: 44, y: 1, w: 10, rot: -6 },
            { src: RES("png/music/new/notw.png"), x: 85,y: 25, w: 8, rot: -8 },
            { src: RES("svg/random/featherpen.svg"), x: 37, y: 50, w: 8, rot: 30 }
        ]
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
            { src: RES("svg/music/music4.svg"), x: 18, y: 82, w: 10, rot: -6, o: 0.85 },
            { src: RES("svg/music/music2.svg"), x: 4, y: 42, w: 9, rot: 8, o: 0.85 },
            { src: RES("png/music/music note violet.png"), x: 82, y: 82, w: 7, rot: 12, o: 0.9 },
            { src: RES("png/music/new/violen.png"), x: 3, y: 12, w: 9, rot: -10 },
            { src: RES("png/music/new/mp3.png"), x: 87, y: 48, w: 9, rot: 8 },
            { src: RES("svg/music/music1.svg"), x: 46, y: 88, w: 8, rot: 6, o: 0.85 }
        ]
    },

    /* ═══ SPREAD 5 left = PAGE 10: Little-Things grid (reference: watercolor + kraft labels) ===
       stickers[] per photo: {src, x, y, w, rot} in % of the cell; y can be negative to overlap the frame. */
    {
        type: "gaming-left",
        texture: "confetti",
        images: [
            {
                src: IMG("dolia doing karate.png"), tag: "KARATE", burst: "POW!",
                stickers: [
                    { src: RES("png/cute/star.png"), x: 76, y: -9, w: 27, rot: 12 },
                    { src: RES("png/level up/cheer.png"), x: -9, y: 60, w: 35, rot: -10 }
                ]
            },
            {
                src: IMG("dolia cute dress.jpg"), tag: "CUTE DRESS",
                stickers: [
                    { src: RES("png/cute/dress.png"), x: 66, y: 12, w: 36, rot: 6 },
                    { src: RES("png/cute/clothes.png"), x: -11, y: 56, w: 39, rot: -8 },
                    { src: RES("png/cute/rose.png"), x: 80, y: -13, w: 21, rot: 10 }
                ]
            },
            {
                src: IMG("dolia doing makeup day.png"), tag: "GLAMOUR", mini: "ZUP",
                stickers: [
                    { src: RES("png/makeup/makeup-brush.png"), x: 80, y: 26, w: 18, rot: 14 },
                    { src: RES("png/makeup/mirror.png"), x: -5, y: -7, w: 25, rot: -8 },
                    { src: RES("png/makeup/blush.png"), x: -5, y: 64, w: 31, rot: -10 }
                ]
            },
            {
                src: IMG("dolia lazying around.jpg"), tag: "SLEEPING",
                stickers: [
                    { src: RES("png/lazying around/moon.png"), x: 68, y: -13, w: 33 },
                    { src: RES("png/lazying around/sleeping cat.png"), x: -7, y: 70, w: 35, rot: -6 },
                    { src: RES("png/lazying around/sleeping penguine.png"), x: 72, y: 64, w: 33, rot: 8 }
                ]
            },
            {
                src: IMG("dolia eating delicious food.jpg"), tag: "DELICIOUS",
                stickers: [
                    { src: RES("png/food/cupcakes.png"), x: -9, y: -11, w: 35, rot: -8 },
                    { src: RES("png/food/sushi-roll.png"), x: 73, y: 68, w: 31, rot: 8 },
                    { src: RES("png/food/sushi-pair.png"), x: 68, y: -13, w: 31, rot: 8 }
                ]
            },
            {
                src: RES("Dolia-celebrating.png"), tag: "LEVEL UP!",
                stickers: [
                    { src: RES("png/gaming/new/controller 2.png"), x: 66, y: 66, w: 37, rot: -10,behind: false },
                    { src: RES("png/gaming/new/game 3.png"), x:-5, y: -30, w: 45, rot: -3 },
                    { src: RES("png/cute/star.png"), x: -7, y: 28, w: 23, rot: -12 }
                ]
            }
        ],
        decor: [
            { src: RES("png/sea elements/pearl.png"), x: 1, y: 86, w: 13, rot: -6 },
            { src: RES("png/random/flower.png"), x: 43, y: 0, w: 11, rot: 0 },
            { src: RES("png/sea elements/single starfish.png"), x: 86, y: 1, w: 9, rot: 12 },
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
            { src: RES("png/music/music note violet.png"), x: 68, y: 5, w: 8, rot: 12 },
            { src: RES("png/food/sushi-roll.png"), x: 50, y: 86, w: 10, rot: 6 },
            { src: RES("svg/gaming/game heart.svg"), x: 3, y: 87, w: 9, rot: -8 },
            { src: RES("png/food/cupcakes.png"), x: 4, y: 28, w: 11, rot: -8 },
            { src: RES("png/cute/star.png"), x: 88, y: 28, w: 8, rot: 12 },
            { src: RES("png/lazying around/sleeping cat.png"), x: 80, y: 66, w: 12, rot: 8 }
        ]
    },

    /* ═══ SPREAD 6 left = PAGE 12: dense memory board (reference layout).
       karaoke hero + film strip + distressed ticket + game polaroid + sketch stamp. */
    {
        type: "cinematic-left",
        texture: "",
        marquee: "",
        ticket: "DolIa x Heino",
        images: [
            { src: IMG("shared/Screenshot_20260810-151956_1.webp"), caption: "KARAOKE NIGHTS" },
            { src: IMG("shared/Screenshot 2026-09-17 104357.png") },
            { src: IMG("shared/IMG_9543.webp") },
            { src: IMG("dolia drawing heino.jpg") },
            { src: RES("png/gaming/dolia x heino gaming dolia crying.png"), caption: "GAME TIME" }
        ],
        decor: [
            { src: RES("svg/music/music2.svg"), x: 57, y: 7, w: 6, rot: -8 },
            { src: RES("svg/music/music3.svg"), x: 61, y: 13, w: 5, rot: 10 },
            { src: RES("png/cute/star.png"), x: 79, y: 1, w: 8, rot: 12 },
            { src: RES("png/sea elements/pearl.png"), x: 47, y: 1, w: 9, rot: -6 },
            { src: RES("sea shell.png"), x: 45, y: 89, w: 9, rot: -8 },
            { src: RES("png/random/discord sticker.png"), x: 69, y: 62, w: 9, rot: 6 },
            { src: RES("png/random/christmas.png"), x: 50, y: -2, w: 14, rot: 8 },
            { src: RES("png/random/leaf-insect.png"), x: 0, y: 12, w: 7, rot: -10 }
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
            { src: RES("png/seaweed/green sea weed.png"), x: 85, y: 90, w: 12, rot: 4 },
            { src: RES("png/music/new/notw.png"), x: 5, y: 8, w: 9, rot: -8 },
            { src: RES("png/cute/star.png"), x: 70, y: 10, w: 8, rot: 10 },
            { src: RES("png/lazying around/moon.png"), x: 74, y: 76, w: 10, rot: 8 },
            { src: RES("svg/random/featherpen.svg"), x: 6, y: 80, w: 9, rot: 24 }
        ]
    },

    /* ═══ SPREAD 7: Wishes for the Year Ahead ════════════════ */
    {
        type: "wishes-left",
        texture: "wishes",
        art: { token: "WISHES", src: IMG("dolia-black hair.jpg"), scale: 5 },
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
            { src: RES("svg/starfish.svg"), x: 6, y: 29, w: 10, rot: -12 },
            { src: RES("png/sea elements/octopus.png"), x: 4, y: 8, w: 11, rot: -8 },
            { src: RES("png/sea elements/pearl.png"), x: 66, y: 6, w: 9, rot: 10, behind: true },
            { src: RES("png/sea elements/palm.png"), x: 2, y: 76, w: 11, rot: -6 },
            { src: RES("svg/turtule.svg"), x: 10, y: 60, w: 13, rot: -6, behind: true }
        ]
    },

    /* ═══ PAGE 16 — quiet breather facing the wishes ═══════════ */
    { type: "empty" },

    /* ═══ PAGE 17 — finale: final thoughts + signature ═══════ */
    {
        type: "end",
        texture: "dots",
        final: [
            "If this little book made you smile even once,",
            "then it did everything I hoped it would.",
            "",
            "You are my favorite artist, my player two,",
            "my karaoke partner, and my calmest sea.",
            "",
            "Wherever this year takes you, take all of it —",
            "happily, loudly, and entirely as yourself."
        ],
        note: "This book was made with love, just for you."
    },

    /* ═══ BACK COVER ═════════════════════════════════════════ */
    {
        type: "back-cover",
        mark: "DOLIA",
        secret: "You are the ocean's favorite princess. Happy Birthday, Dolia."
    },
];
