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
        art: { token: "COVER", src: IMG("Dolia.jpg"), scale: 6 },
        title: "あと一戦だけ —— コハクのPvEな一日",
        recipient: "Kohakutou",
        date: "18/09/2026"
    },

    /* ═══ SPREAD 1: Birthday Introduction ════════════════════ */
    {
        type: "intro-left",
        texture: "dots",
        art: { token: "BIRTHDAY", src: RES("bday.jpg"), scale: 5, fit: "contain" },
        decor: [
            { src: RES("png/birthday/garland.png"), x: -4, y: -3, w: 34, rot: 0 },
            { src: RES("png/birthday/balloon.png"), x: 74, y: 2, w: 22, rot: 6 },
            { src: RES("png/birthday/birthday-cake.png"), x: 72, y: 78, w: 22, rot: -6 },
            { src: RES("png/birthday/party-hat.png"), x: 4, y: 76, w: 18, rot: -14 }
        ]
    },
    {
        type: "intro-right",
        texture: "dots",
        kicker: "Happy Birthday",
        title: "これはあなたのです",
        body: [
            "実はこれ、随分前から計画していて、時間が空いたときに少しずつ進めていたんです。",
            "「特別な人」と呼ぶときはいつも本心からそう思っていますが、実際にその言葉を直接伝えた相手はたった一人だけでした。",
            "だから、その大切な友人に何か特別なものを贈りたいと思ったんです。",
            "正直なところ、これをしたからといって何かが変わるとは期待していません。ただ自分に正直でありたい、そして自分自身との約束を守りたい、それだけなんです。",
            "気に入ってもらえるかは分かりませんが、これを受け取ってください。"
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
            { src: IMG("dolia sketching.jpg"), caption: "Dress-Up Art" },
            { src: IMG("dolia lazying around.jpg"), caption: "Creative Makeup" },
            { src: IMG("dolia drawing heino.jpg"), caption: "Digital Sketching!" }
        ],
        decor: [
            { src: RES("png/art/color-palette.png"), x: 15, y: 45, w: 19, rot: -8 },
            { src: RES("png/art/paint-tube.png"), x: -2, y: 10, w: 20, rot: -28 },
            { src: RES("png/art/paint-brush.png"), x: 44, y: 52, w: 18, rot: 28 },
            { src: RES("png/art/drawing.png"), x: 67, y: 76, w: 18, rot: -8 },
            { src: RES("png/art/pencil-case.png"), x: 24, y: 0, w: 14, rot: -10 },
            { src: RES("svg/art/pencil.svg"), x: 80, y: 68, w: 9, rot: 32 },
            { src: RES("png/art/crayons.png"), x: 1, y: 70, w: 12, rot: 8 }
        ]
    },
    {
        type: "hobbies-right",
        texture: "stars",
        title: "あなたの中のアーティスト",
        body: [
            "あなたが描いた作品はどれも覚えています。特に、初めて「ドリア（Dolia）」の絵を見せてくれた時のことは本当に嬉しかったです。あなたが「誰だかわかる？」と尋ねてきたとき、その絵があまりにも特徴を捉えていたので、一目見ただけで彼女だとすぐにわかりました。私自身はこれまで絵を描こうとしたことがないので描けませんが、あなたのドリアやハイノ（Heino）の絵を見て、もし自分も絵が描けたら、あなたと作品を共有できたのになあと思いました。最後にシェアしてくれたディアディア（Dyadia）とドリアの絵も素晴らしかったです。ラフスケッチではありましたが、まさに「こうあるべき」という姿で描かれていました."

        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("svg/art/art-brush-general-svgrepo-com.svg"), x: 64, y: 5, w: 9, rot: 12, behind: true },
            { src: RES("svg/art/art-palette-svgrepo-com.svg"), x: 2, y: 86, w: 10, rot: -6 },
            { src: RES("svg/art/colors.svg"), x: 4, y: 30, w: 13, rot: -10, behind: true },
            { src: RES("svg/art/pencil3.svg"), x: 86, y: 30, w: 11, rot: 14 },
            { src: RES("png/art/paint-brush.png"), x: 4, y: 64, w: 16, rot: -14 },
            { src: RES("svg/art/pencil2.svg"), x: 30, y: 86, w: 10, rot: 10 }
        ]
    },

    /* ═══ SPREAD 3: GAMING — Your Player Two ═════════════════
       PAGE 6 arcade collage, 5 layers: grid paper + washes / ink doodles /
       4 photo cards / washi + gold clip / dpad + consoles + badges. */
    {
        type: "editorial-left",
        texture: "",
        images: [
            { src: IMG("crying.png"), caption: "bots are so strong" },
            { src: IMG("dolia playing pve.jpg"), caption: "In My Zone" },
            { src: IMG("Dolia-determined.png"), caption: "must win next match" },
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
        title: "PvE",
        body: [
            "他にも何かゲームをプレイしているのか気になっていたんですが、なかなか聞く機会がありませんでした。私たちの関係はあくまで『HOK』に限ったものでしたからね。でも、一緒に500戦以上もプレイしましたよね。かなりの数ですが、私としてはそれでも足りないくらいでした（笑）。最近すごく練習されていましたよね。ピークポイント1500に到達したらお祝いしようと思っていたんですが、あのひどいマッチングシステムのせいで阻まれてしまったようで……。ピークトーナメントを戦うのがどれほど大変か、そして運の要素が50%を占めることもよく分かります。ところで、結局1500ポイントには到達できたんでしょうか？ここ1週間ほどゲームにログインしていないので状況が分からなくて……。もし達成できていたらおめでとうございます！まだなら、気にしないでください。次のシーズンにはきっと到達できるはずですよ"
            
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("svg/gaming/game-controller-svgrepo-com.svg"), x: 82, y: 66, w: 14, rot: 8 },
            { src: RES("svg/gaming/game heart.svg"), x: 5, y: 5, w: 8, rot: -10 },
            { src: RES("svg/gaming/game.svg"), x: 5, y: 30, w: 13, rot: -8, behind: true },
            { src: RES("png/level up/level-up.png"), x: 64, y: 5, w: 13, rot: 8, behind: true },
            { src: RES("png/level up/cheer.png"), x: 6, y: 78, w: 13, rot: -10 },
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
        title: "あなたの中にある音楽",
        body: [
            "本当に音楽がお好きなんですね。送ってくれた曲は全部聴きましたよ。特に、ゲームでうまくいかなかった後にリラックスするために送ってくれた曲が印象に残っています。本当に心が落ち着きました。ありがとうございます。あと、Gigaさんの「Getcha」や、なとりさんの曲も2曲ほどすごく気に入りました。どれも素晴らしかったですし、おっしゃる通り、なとりさんの曲は本当に落ち着く雰囲気がありますね。それから、もちろんカラオケについてもですね。何度も話題に出されていましたから。以前、その日の出来事を聞いたときも、よく「カラオケに行った」とおっしゃっていましたし、本当にカラオケがお好きなんですね。"
        ],
        tags: ["Playlists", "Karaoke", "Singing", "Daydreams"],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("svg/music/music3.svg"), x: 5, y: 64, w: 13, rot: -10, o: 0.85 },
            { src: RES("svg/music/music4.svg"), x: 18, y: 82, w: 10, rot: -6, o: 0.85 },
            { src: RES("svg/music/music2.svg"), x: 4, y: 42, w: 9, rot: 8, o: 0.85 },
            { src: RES("png/music/music note violet.png"), x: 82, y: 82, w: 9, rot: 12, o: 0.9 },
            { src: RES("png/music/new/violen.png"), x: 2, y: 10, w: 14, rot: -10 },
            { src: RES("png/music/new/mp3.png"), x: 86, y: 46, w: 12, rot: 8 },
            { src: RES("svg/music/music1.svg"), x: 46, y: 88, w: 9, rot: 6, o: 0.85 }
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
        title: "大好きな、ささやかなこと",
        date: "2024 - 2026",
        body: [
            "以前、ゲーム以外に何が好きなのか尋ねたことがありましたよね。それまで個人的な好みやプライベートな話はしたことがなかったので、実は少しためらいながら聞いたんです。でも、あなたはたくさんのことを話してくれました。その興味の対象からは、あなたがどんな女性なのかがよく伝わってきましたし、それらすべてが「あなたらしさ」を形作っているんだなと感じました。以前、ゲーム以外に何が好きなのか聞いたとき、あなたがたくさんのことを話してくれたのを覚えています。"
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("png/music/music note violet.png"), x: 68, y: 5, w: 8, rot: 12 },
            { src: RES("png/food/sushi-roll.png"), x: 48, y: 85, w: 12, rot: 6 },
            { src: RES("svg/gaming/game heart.svg"), x: 3, y: 87, w: 9, rot: -8 },
            { src: RES("png/food/cupcakes.png"), x: 3, y: 26, w: 13, rot: -8 },
            { src: RES("png/cute/star.png"), x: 88, y: 28, w: 8, rot: 12 },
            { src: RES("png/lazying around/sleeping cat.png"), x: 79, y: 64, w: 14, rot: 8 }
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
            { src: IMG("shared/Screenshot_20260810-151956_1.webp"), caption: "1%" },
            { src: IMG("shared/Screenshot 2026-09-17 104357.png") },
            { src: IMG("shared/IMG_9543.webp") },
            { src: IMG("shared/gift.webp") },
            { src: IMG("shared/deeper.webp"), caption: "..." }
        ],
        decor: [
            { src: RES("svg/music/music2.svg"), x: 57, y: 7, w: 6, rot: -8 },
            { src: RES("svg/music/music3.svg"), x: 61, y: 13, w: 5, rot: 10 },
            { src: RES("png/cute/star.png"), x: 79, y: 1, w: 8, rot: 12 },
            { src: RES("png/sea elements/pearl.png"), x: 47, y: 1, w: 9, rot: -6 },
            { src: RES("sea shell.png"), x: 45, y: 89, w: 9, rot: -8 },
            { src: RES("png/random/discord sticker.png"), x: 69, y: 62, w: 9, rot: 6 },
            { src: RES("png/random/christmas.png"), x: 50, y: -2, w: 14, rot: 8 },
            { src: RES("png/random/leaf-insect.png"), x: 0, y: 12, w: 7, rot: -10 },
            { src: RES("png/random/discord.png"), x: 45, y: 62, w: 15, rot: 6 },
            { src: RES("png/random/cicada.png"), x: 5, y: 62, w: 9, rot: 15 }
        ]
    },
    {
        type: "cinematic-right",
        texture: "sparkles",
        title: "共有された思い出の数々",
        body: [
            "この本には自分自身のことはあまり書かないでおこうと思っていたのですが、どうしても共有したい思い出がいくつかありました。実際には数え切れないほどありますが、特に二人で成し遂げたこと、例えば「トップ1%」のバッジを獲得したことや、あの「マスターマインド」のアルティメット技をあなたが決死のブロックで防いでくれた場面は今でも鮮明に覚えています。これまでも100回は言ったと思いますが、改めて言わせてください。あなたは私にとって最高の、そして一番お気に入りのサポートプレイヤーでした。私はもともとランク戦にはあまり熱心ではありませんでしたが、あなたと一緒にプレイするのは本当に楽しかったです。私たちの関係は少し丁寧すぎて、本当はもっと冗談を言い合ったりしたかったのですが、それでもあなたという友人ができたことは本当に幸運だったと思っています。あ、それから、プレゼントしてくれた「ハイノ（Heino）」のスキン、本当にありがとう。あれは、私にとっていつまでも一番大切なプレゼントの一つであり続けるでしょう。"
        ],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("png/seaweed/green sea weed.png"), x: 85, y: 90, w: 12, rot: 4 },
            { src: RES("png/music/new/notw.png"), x: 4, y: 6, w: 12, rot: -8 },
            { src: RES("png/cute/star.png"), x: 70, y: 10, w: 8, rot: 10 },
            { src: RES("png/lazying around/moon.png"), x: 72, y: 72, w: 12, rot: 8 },
            { src: RES("svg/random/featherpen.svg"), x: 5, y: 78, w: 12, rot: 24 }
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
        title: "これからの1年が素晴らしいものとなりますように",
        body: [
            "さて、ここからが本題です。",
"今日、あなたに願うことはただ一つだけ。この8ヶ月近くの間、私があなたに送ってきたすべての願いが叶うことを願っています。なぜなら、それらはすべて本物であり、私の心の底からのものだったからです。"
        ],
        tags: ["Happiness", "Creativity", "Adventure", "Fun", "Memories", "Growth"],
        cornerImg: nextCorner(),
        decor: [
            { src: RES("png/coral/blue coral.png"), x: 84, y: 50, w: 15, rot: 5 },
            { src: RES("svg/starfish.svg"), x: 5, y: 28, w: 12, rot: -12 },
            { src: RES("png/sea elements/octopus.png"), x: 3, y: 6, w: 13, rot: -8 },
            { src: RES("png/sea elements/pearl.png"), x: 66, y: 6, w: 9, rot: 10, behind: true },
            { src: RES("png/sea elements/palm.png"), x: 1, y: 74, w: 13, rot: -6 },
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
            "何か特別なことを企んでいるわけではありません。今日はあなたにとって大切な日ですから、私にとって本当に特別な存在であるあなたのために、何か自分で形にしたいと思っただけなんです。完璧な出来とは言えませんし、あなたが気に入ってくれるかどうかも分かりません。デザインも得意ではないので、ネット上のアイデアを参考にしました。掲載している画像の多くはAIで生成したものですが、それらは私が知る限り、あなた自身やあなたの趣味、情熱を表現しています。もっと手軽な方法やツールもありましたが、自分の思い通りにカスタマイズしたかったので、手持ちのWeb制作スキルを活かしてゼロから作ってみました。気に入っていただけると嬉しいです。もっと良くしたかったのですが、直前になって熱を出してしまい、これが今の私にできる精一杯でした。不完全な点があることを、どうかお許しください。",

"改めて、お誕生日おめでとうございます、コハクさん。"
        ],
        note: ""
    },

    /* ═══ BACK COVER ═════════════════════════════════════════ */
    {
        type: "back-cover",
        mark: "Iroyu",
        secret: "You're the best"
    },
];
