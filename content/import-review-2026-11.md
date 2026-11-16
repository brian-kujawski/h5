# Hymnal import review (November 2026)

This is what happened to every song in the three hymnals you sent. The songbook went from 80 to 390 songs. Every new song is marked `metadata_status: provisional`.

| Source | Songs in it | Imported | Already had it | Excluded | Held for you | Skipped |
|---|---|---|---|---|---|---|
| Flying Booger's Hash Hymns III (Summit H3, Jan 1994) | 428 | 306 | 28 | 74 (plus half of 252) | 8 | 12 |
| Ibaraki H3 Hash Hymnal | 34 | 4 new (10 were Summit songs too) | 19 | 1 | 0 | 0 |
| Memphis H3 hymnal | ~69 | 0 | – | – | – | all |

**Memphis:** the PDF only had its two-page title index, not the lyrics, and memphish3.com blocks automated access. There's a list of Memphis-only titles at the bottom. Send the full PDF or the lyrics and I'll run them through the same screen.

## How the tags were set

These are rough placeholders, as you asked.

- **Moments:** most songs are tagged `any-time`. More specific moments (too-drunk, hares, visitor, trail-complaint, etc.) were used only where the song is obviously about that.
- **Rating:**
  - `explicit` if the lyrics contain a sexual word.
  - Otherwise `cheeky`. Nothing imported is rated `clean`, because innuendo songs ("One-Eyed Trouser Snake") can't be caught by keywords. Clean mode will hide every new song until someone promotes the genuinely clean ones.
- **Length, difficulty, style, down-down ending, pronoun swaps and fill-ins** were all worked out from the lyrics.
- **Hooks** are all `null`, so lists show the first line instead.
- **Stanza breaks:** the Summit text lost its stanza breaks in the PDF conversion. Long blocks were split into 4-line verses, and choruses were found by their "Chorus:" label. Expect some verses to be split in the wrong place.
- **Source notes:** credits from the book (for example "Contributed by ZiPpy, Pikes Peak H4") went into `notes`.

## Excluded (not in the PR)

### Misogynist
- **23 Why Was She Born a Bitch?**
- **71 Don't That Bastard Get Any Bigger:** gold-digger nag, plus "cripple".
- **93 I'll Never Piss Again:** the woman is a lying whore who gave him the clap. Borderline.
- **136 When the End of the Month Comes:** mocks menstruation.
- **158 Fuckin' Hell She's Ugly:** also ableist.
- **159 Girl from Baltimore:** misogynist chorus. Borderline, and it has some hash verses.
- **172 My Mother-in-Law:** "dirty old whore", plus an Al Jolson "Mammy" bit.
- **175 Nellie Darling**
- **252 Hasher Men and Women:** the women half only. The men half was imported as `hasher-men`.
- **IH3 20 Hasher Women:** same song as the women half of 252.
- **372 Harriettes, They Play One**
- **407 Vanessa Picklegin:** mocks an old sex worker. Borderline.
- **411 Be My Guest:** "be my slave", pimping. Borderline.

### Racist or ethnic caricature
- **27 Zulu Warrior:** also has a "poofta" verse.
- **149 Twelve Days of Ramadan**
- **151 All the Nice Girls:** "yellow girls" and "white man", plus a choirboy verse.
- **157 Dying Harlot:** slurs.
- **163 Lupe:** also a minor.
- **185 Suckanya:** Thai bargirl stereotype.
- **312 Irian Jaya:** "natives" caricature.
- **320 Little Red Train:** porter and "black cigar" innuendo.
- **327 Old Irish State:** Irish jokes, a rape joke and a verse about Jews.
- **352 You Won't Find Any Country:** ethnic stereotypes.
- **360 Napalm Sticks to Kids:** "gooks", plus an atrocity against children.
- **391 Miss Lee's Hoochie:** Korean sex-worker caricature.
- **399 Yu Wee Flung Le Wee:** mock Chinese.
- **400 Bengali One So Long:** racial penis stereotypes.
- **401 Who Is in the Kitchen With...:** mock-Chinese names.

### Homophobic or transphobic
- **46 All Queers Together:** unnumbered, tacked onto Sexual Life of the Camel. Also has a little-boy verse.
- **124 Seven Nervous Days:** transphobic punchline.
- **130 Supercallousflagellisticsexpectcunnilingus:** homophobic chorus, plus minors.
- **132 The Triangle:** lumps gay people in with "pervs", plus a child.
- **195 Clinton's Queen Berets**
- **203 He's a Cunt:** "poof", plus a line about a daughter.
- **208 Ivan Skavinsky Scavar:** gay-panic and anal-rape punchline.
- **213 Men**
- **230 A Mouthful of Singha:** transphobic, plus sex tourism.
- **246 Bagpipe Song:** "queerie" is part of the cumulative chain. It could come back if that link is reworded.
- **277 Monster Hash:** "poofters" refrain.
- **282 White Hashmas:** transphobic punchline. Borderline.
- **310 I'll Take the Left Leg:** "we're all queers together", plus "sharing her".
- **366 There Are No Fighter Pilots Down in Hell:** "full of queers" refrain.
- **412 Big Jess:** the punchline is outing someone as gay.

### Ableist
- **135 Wedding Song (Side by Side):** mocks the wife's prosthetics. Borderline.
- **171 My Girl's a Vegetable:** also non-consent.

### Minors (sexualised children or under-age sex)
- **31 Cats on the Rooftops:** also has a homophobic verse.
- **61 Ali Boogie:** also incest.
- **179 Poor Little Angeline:** also sexual assault.
- **189 You Take the Legs Off Betty:** "ass off a baby boy". Borderline.
- **194 Christopher Robin**
- **200 Fuck the Giant Penis:** a 16-year-old.
- **225 This Old Man:** "just eleven".
- **226 Three German Officers:** an under-age daughter, plus non-consent.
- **285 Arseholes for Sale**
- **293 Chandler's Shop**
- **318 Life Presents a Dismal Picture:** both versions. Also bestiality and incest verses.
- **334 Roedean School:** schoolgirls.
- **410 Christopher and Alice**

### Rape, non-consent or violence against women
- **30 Bye Bye Blackbird**
- **74 Fondle Me with Care:** non-consensual flashing.
- **103 Keyhole Song:** voyeurism.
- **121 Rawhide:** "catch and grope and bang her". Borderline.
- **155 Dead Whore:** also necrophilia.
- **160 Harlot of Jerusalem:** the woman is tied up and "rending her womb". Borderline.
- **196 Colombo / Good Ship Venus:** cabin-boy abuse, "young girls he did ravish", and a homophobic verse. It could return heavily pruned.
- **199 Friar of Great Renown:** also necrophilia.
- **206 Inbred Man:** the Klan, incest and violence.
- **217 One-Eyed Riley:** a shooting, plus a necrophilia ending.
- **221 S & M Man:** violence against women, plus child-abuse verses.
- **257 Pikes Peak Hashers:** "fuck our wives with butcher knives", plus bestiality.
- **258 She Ain't Gonna Fuck No More:** gang sex until the woman dies.
- **262 Three Visiting Hashers:** "tied her to the bed".
- **295 Chisholm Trail:** also the "squaw" slur.
- **296 Clean Song:** gang rape of a mermaid.
- **364 Strafe the Town:** atrocities against children and pregnant women.

### Other
- **280 Twelve Days of Christmas:** choirboys and boy scouts sit alongside "pervert". Borderline.

## Held for you to decide (not in the PR)

These aren't covered by your four categories, but bestiality, incest and necrophilia are as much the whole premise of these songs as any slur would be. Say which ones (if any) you want, and I'll add them.

- **28 Bestiality's Best:** "rape with an ape", "queer with a deer".
- **95 Incest Is Best:** a niece.
- **96 Incest Time in Texas**
- **111 Necrophilia Song (My Name Is Jack):** also has little-girl, strangling and "swishy" verses, so it would need pruning even if kept.
- **152 Carolina:** bestiality.
- **218 Pioneers:** bestiality.
- **281 While the Kiwis Shagged:** bestiality.
- **325 Necrophilia's Best**

These ones are bestiality jokes but were imported with a flag, because the animal is the gag rather than the premise: Fuck (a Duck), Moose Song, I Like a Moose, Mayor of Bayswater's Daughter. They're in the flagged list below.

## Skipped

- **51 Yogi and 396 Twenty Toes:** your kennel removed these, so no variants were added either.
- **52–58, the "Spoken Word" section:** jokes, limericks, poetry, recitals, the shit list and toasts. These aren't songs, and several of the toasts to women are misogynist.
- **414:** listed in the index but missing from the body.
- **418:** a variant of 386 (Song to Wanky Doodle).
- **420:** a poem by a named author, not a hash song.

## Already in the songbook (not re-imported)

The variants listed here may be worth merging by hand.

### Summit
- **6:** Here's to the Hare. Has a second version, "damn fine gal".
- **25:** You Are My Hashit. Much longer, with harriette verses.
- **97/98:** different "wooden box" endings to an existing song.
- **268:** an "a-humpin'" variant.
- **294:** Chicago. Many extra verses, including a "rape" pun verse that would need to go.
- **330:** Soldier Song.
- Plain duplicates: 2, 5, 7, 9, 10, 14, 17, 20–22, 26, 110, 118, 141, 150, 190, 234, 261, 274, 288, 374.

### Ibaraki
- Already in the songbook: 1–7, 11, 16, 17, 19, 23, 25 and 29–34. Shiggy Shaggy is Ziggy Zaggy, and 6 is a "she" version.
- Same as a Summit import:
  - 8 = The Restroom Door Said "Gentlemen"
  - 9 = My Grandfather's Cock
  - 12 = Who Needs Sex?
  - 14 = Do Your Balls Hang Low?
  - 15 = The Old Brown Cow
  - 18 = Yesterday
  - 21 = Hasher Men
  - 24 = Oh My Darling (Don't Say No)
  - 26 is a variant of The Hairs of Her Dickey Di-Do
  - 28 = The Lumberjack Song (IH3's edit is hashier)
- New from Ibaraki: Drunken Hasher, Do Your Tits Hang Low?, Ode to a Hasher, I'm a Little Hasher.

## Imported with verses left out

The rest of each of these songs was fine. Each is flagged `verses-left-out`, and the notes say what was removed.

- **The Ball of Kerrymuir** `ball-of-kerrymuir` [verses-left-out, check-content]: Left out four verses: the village cripple, Giles's non-consensual anal verse, and two verses about young boys (Little Jimmy, Little Tommy). Two "village idiot" verses kept; flag if that reads as ableist.
- **Big Bamboo** `big-bamboo` [verses-left-out]: Left out the "chinaman ... chopstick" verse.
- **Daylight Come** `daylight-come` [verses-left-out]: Left out the katoey verse.
- **A Few of My Favorite Things** `favorite-things-hash` [verses-left-out]: Left out the "rugby mob ... they're queer" verse.
- **Give Me a Clone** `give-me-a-clone` [verses-left-out]: Last verse (clones that "each ravish her") left out.
- **Glorious, Victorious (Beer, Beer, Beer)** `glorious-victorious` [verses-left-out, check-content]: Left out the "no serious hashers by the Bay ... bunch of queers" verse. Long run of "no serious hashers in ..." verses; swap in local rivals.
- **Hasher Men (and Women)** `hasher-men` [verses-left-out]: Harriers' half of the song only. The harriettes' "*** women" half was left out as misogynistic (same as Ibaraki's "Hasher Women").
- **When Lady Jane Became a Tart** `lady-jane-became-a-tart` [verses-left-out]: Left out the "Lord St. Clancy became a nancy" verse.
- **Marriage a La Mode** `marriage-a-la-mode` [verses-left-out]: Left out the "Pervert/molests children" and "Pimp/beats whores" lines.
- **Mobile** `mobile` [verses-left-out]: Left out the "virgins ... when they get their pubic hair ... deflowered by the mayor" verse.
- **My God How the Money Rolls in** `money-rolls-in` [verses-left-out]: Left out the "girls' seminary" verse.
- **Sammy Small (Vietnam Version)** `sammy-small-vietnam` [verses-left-out]: Left out the "strafed Hanoi, killed every girl and boy" verse.
- **These Foolish Things** `these-foolish-things` [verses-left-out]: Left out the Liberace verse.
- **Vegetables Are the Best** `vegetables-are-the-best` [verses-left-out]: Left out the "dyke" and "fairy" lines.
- **The Wild West Show** `wild-west-show` [verses-left-out, check-content]: Left out five gags: Prince/Little Richard/Liberace, the "ate before she was seven" pun, the Homosexual Sparrow, the Fuccari tribe and the Indonesian "private school". Mostly spoken patter between choruses.

## Imported with a flag to check

Each of these shows a "KENNEL REVIEW" line in the app until the flag is cleared. The flags are:

- `check-content`: borderline, needs your call.
- `stereotypes`: mock accents or national ribbing.
- `copyright`: a Monty Python or other commercial song.
- `names-a-person`: about a named hasher.
- `kennel-specific`: names another kennel.
- `bestiality`

- **(I Want a) Gang Bang** `gang-bang` [stereotypes]: A few pun verses lean on ethnic names (Tijuana, Kenya) and "Charlie Pride pried her legs apart".
- **A Prayer** `a-prayer` [names-a-person, stereotypes]: "Mr. Benglestein" may read as a Jewish caricature.
- **As I Was Walking** `as-i-was-walking` [check-content]: Borderline: one verse is a non-consent gag ("some bastard rammed it up my ass").
- **Austin Hash Song** `austin-hash-song` [kennel-specific]: Kennel-specific (Austin H3).
- **Barnacle Bill** `barnacle-bill` [check-content]: Borderline: "we'll drown the bugger" (the baby) and "dirty old whore".
- **Beneath a Korean Waterfall** `korean-waterfall` [check-content]: Fighter-pilot song.
- **Boom, Oooh, Yakatata** `boom-oooh-yakatata` [check-content]: Ends on "Ya bitch."
- **Born Dead** `born-dead` [check-content]: Dead-baby joke.
- **Bruces' Philosophers Song** `philosophers-song` [copyright]: Monty Python song (copyrighted); check before shipping.
- **Can You Walk a Little Way?** `can-you-walk-a-little-way` [check-content]: Harriers sing questions, harriettes answer.
- **Come and Join the Air Force** `join-the-air-force` [check-content]: Fighter-pilot song.
- **Country Sunday School** `country-sunday-school` [stereotypes]: Source calls this the "politically correct" rewrite of a racist original; these lyrics are fine, but the kennel may not want the association.
- **Dashing Through the Sky** `dashing-through-the-sky` [check-content]: Fighter-pilot song about bombing Vietnam ("what fun it is to watch things burn").
- **Dear Mom** `dear-mom` [check-content]: Fighter-pilot song.
- **Dinah** `dinah` [check-content]: Borderline: Dinah verses are rich-girl/poor-girl slut-shaming.
- **Ft. Eustis Hash Songs** `fort-eustis-hash-songs` [kennel-specific]: Kennel-specific (Fort Eustis); "We'll fuck all your women" line treats women as property, check you're happy with it.
- **Fuck (a Duck)** `fuck-a-duck` [bestiality]: Bestiality is the joke; decide whether the kennel wants it.
- **Give Me Operations** `give-me-operations` [check-content]: Fighter-pilot song.
- **Give Me That Good Old Vino** `good-old-vino` [check-content]: Mock-Spanish chorus ("my seester Belinda").
- **Gomez the Chihuahua** `gomez-the-chihuahua` [stereotypes]: Mexican-stereotype jokes (sombrero, cajones, squashed tamale); check you're comfortable.
- **Great Big Wheel** `great-big-wheel` [check-content]: Borderline: like Engineer's Dream, the wife is "split in two".
- **Hallelujah, I'm a Bum** `hallelujah-im-a-bum` [check-content]: Borderline: "you will eat when I'm screwed ... her ass it was tore".
- **Has Anybody Seen J. C.?** `has-anybody-seen-jc` [check-content]: Religious humour ("five foot Jew").
- **Hello Penis** `hello-penis` [check-content]: Sex-tourism line ("five hundred baht ... whore").
- **Hitler, He Only Had One Ball** `hitler-one-ball` [check-content]: Has a fill-in verse for a short hasher.
- **Hot Vagina** `hot-vagina` [check-content]: Includes "go eat your mom".
- **How to Handle a Date (Duet)** `how-to-handle-a-date` [check-content]: Duet: harriers and harriettes alternate.
- **I Don't Want to Join the Army** `dont-want-to-join-the-army` [check-content]: Borderline: narrator lives off a woman's earnings (pimping). Old WWI song.
- **I Don't Want to Join the Convent** `dont-want-to-join-the-convent` [kennel-specific]: Kennel-specific (Phuket).
- **I Like a Moose** `i-like-a-moose` [bestiality]: Bestiality is the joke; decide whether the kennel wants it.
- **I'm a Little Hasher** `im-a-little-hasher` [check-content]: "I bend her over and make her shout" doesn't say she's into it; decide if it stays. Close cousin of Little Penis.
- **I've Got the Clap Again** `got-the-clap-again` [kennel-specific]: Kennel-specific (Jakarta bars).
- **If I Were the Marrying Kind** `if-i-were-the-marrying-kind` [kennel-specific]: Rugby positions; kennel may want hashing positions instead.
- **Isn't It Awfully Nice to Have a Penis (the Penis Song)** `penis-song` [copyright]: Monty Python song (copyrighted); check before shipping.
- **It's Hard to Be Humble** `hard-to-be-humble` [check-content]: Fighter-pilot song; could be swapped to brag about the FRBs.
- **Itazuke Tower** `itazuke-tower` [check-content]: Fighter-pilot song.
- **Jonestown** `jonestown` [check-content]: Jokes about the Jonestown mass deaths.
- **Leaver's Song** `leavers-song` [kennel-specific]: Kennel-specific (Jakarta).
- **Let Me Ball You Sweetheart** `let-me-ball-you-sweetheart` [check-content]: "Pinch your boobies till they're black and blue" line.
- **Little Bit Off the Top** `little-bit-off-the-top` [stereotypes]: Jewish-accent humour ("goil").
- **Lulu** `lulu` [check-content]: One verse has a bulldog and a lamb.
- **Madeline Schmidt** `madeline-schmidt` [check-content]: Second half is a hash version about hares leading the pack into a shit pit.
- **Masturbation (Fornication)** `masturbation-fornication` [check-content]: Different lyrics from the existing Masturbation songs; check whether it's really a third song.
- **Mayor of Bayswater's Daughter** `mayor-of-bayswater` [bestiality]: Long growing list of extra lines; one ("went down on cattle") is bestiality.
- **Mister Blue Balls** `mister-blue-balls` [check-content]: Written for calling the hares to the ice.
- **Moonshadow** `moonshadow` [check-content]: Performance piece; needs a bare-assed volunteer.
- **Moose Song** `moose-song` [bestiality]: Bestiality is the joke; decide whether the kennel wants it.
- **Morgan's Pies** `morgans-pies` [names-a-person]: About a named hasher; template for roasting whoever brought bad food.
- **Mother Hash** `mother-hash` [kennel-specific]: Kennel-specific (Kuala Lumpur, the Mother Hash).
- **Mount Bonnell** `mount-bonnell` [kennel-specific]: Kennel-specific (Austin).
- **My Little Pink Panties** `my-little-pink-panties` [check-content]: Harriette version of Big Red Rose.
- **My Sombrero** `my-sombrero` [check-content]: Mock-Spanish.
- **Nancy Brown** `nancy-brown` [check-content]: Borderline: slut-shaming arc.
- **Once a Bloody Hashman** `once-a-bloody-hashman` [stereotypes]: Mock-Japanese "papa-san ... tak-san yen" verse.
- **One Twat** `one-twat` [stereotypes]: Mock-Spanish accent.
- **Or Would You Rather Be** `would-you-rather-be` [stereotypes]: National ribbing (Poms, Yanks, Ockers, Kiwis).
- **Red River Valley** `red-river-valley` [check-content]: Fighter-pilot song.
- **Redneck Mother** `redneck-mother` [copyright]: Real song by Ray Wylie Hubbard (copyrighted); check before shipping.
- **Salutations** `salutations` [check-content]: Calls on someone to sing; good for putting a hasher on the spot.
- **Singha Cock** `singha-cock` [check-content]: Harriette's view.
- **Sit on My Face and Tell Me That You Love Me** `sit-on-my-face-python` [copyright]: Monty Python song (copyrighted); check before shipping.
- **Skippy the Squirrel** `skippy-the-squirrel` [check-content]: Line about licking "a girl whose father called a cop" is ambiguous about age.
- **Song to Cuming Mutha** `song-to-cuming-mutha` [check-content]: Written for a named departing GM; a template for farewells. Calls someone "an Irishman of little wit".
- **Song to Wanky Doodle** `wanky-doodle` [names-a-person]: About a named hasher.
- **Spam Skit** `spam-skit` [copyright]: Monty Python sketch (copyrighted); check before shipping.
- **Tchepone** `tchepone` [check-content]: Fighter-pilot song.
- **Teddy the Red-Nosed Senator** `teddy-red-nosed-senator` [check-content]: Political (Ted Kennedy).
- **The Ballad of the Bobbitt Hillbillies** `bobbitt-hillbillies` [check-content]: Topical 1990s song about the Bobbitt case (domestic violence, a rape acquittal mentioned).
- **The Engineer's Dream** `engineers-dream` [check-content]: Borderline: punchline is the wife being "split from ass to tit" by the machine. Classic, but decide if it stays.
- **The Gay Caballero** `gay-caballero` [stereotypes]: Mexican setting with mock-Spanish words; "gay" is the old sense.
- **The Lumberjack Song** `lumberjack-song` [copyright]: Monty Python song (copyrighted); check before shipping. Cross-dressing verses are the joke.
- **The Pub with No Beer** `pub-with-no-beer` [check-content]: Borderline: "give me a poke or I'll shoot".
- **The Rajah of Astrakhan** `rajah-of-astrakhan` [check-content]: Borderline: the punchline injures the concubine.
- **The Seamstress' Song** `seamstress-song` [check-content]: Gender-swapped Engineer's Dream.
- **The Sexual Life of the Camel** `sexual-life-of-the-camel` [check-content]: "All Queers Together" verses that followed in the source were left out (homophobic, plus a verse about a little boy). Harem verse ("a hundred dusky maidens") may read as exoticising.
- **The Tinker** `the-tinker` [check-content]: Borderline: the mistress dies.
- **Three Chinese Crackers** `three-chinese-crackers` [check-content]: "Chinese crackers" are firecrackers, but check it doesn't land badly.
- **Throw a Nickel on the Grass (Korea Version)** `throw-a-nickel-korea` [check-content]: Fighter-pilot song.
- **Throw a Nickel on the Grass (Vietnam Version)** `throw-a-nickel-vietnam` [check-content]: Fighter-pilot song.
- **Tonight We March Against England** `tonight-we-march-against-england` [stereotypes]: Nazi-voice parody ("sieg Heil").
- **Twinkie, Twinkie, Little Hasher** `twinkie-little-hasher` [names-a-person]: About a named Austin hasher.
- **Vlad** `vlad` [check-content]: Tongue-twister list includes animal words.
- **Walkin' 'Round in Womens' Underwear** `womens-underwear` [check-content]: Cross-dressing is the joke; check it doesn't read as mocking trans people.
- **Waves and Waves** `waves-and-waves` [check-content]: Borderline: ends with the narrator charging men to look at his girlfriend.
- **Will You Marry Me? (Duet)** `will-you-marry-me` [check-content]: Duet. Ends "Get out of the door, you lousy whore, my money was all you were lookin' for".
- **Woodpecker Song** `woodpecker-song` [check-content]: Uses "RETARD IT!" (meaning slow down); some kennels may want to swap that line.
- **Yankee Air Pirate** `yankee-air-pirate` [check-content]: Fighter-pilot song.
- **Yellow Ryder Truck** `yellow-ryder-truck` [kennel-specific]: Kennel-specific (Houston H3).

## Memphis-only titles (need lyrics)

These are in the Memphis index but not in Summit or Ibaraki:

Dinah Won't You Blow Me · Fuck Off · Give Me an A! · He's a Hasher, He's True Blue · Her Right Tit Hangs Down (probably a variant of Her Left Tit) · Last Night · My Asshole Is Sore · The Nipples on Her Tits · No One Wants to Fuck Grandma · Thank God You Finally Shut Up · She's a Little Sexpot · Skeeter on My Peter · With an F... · Would You Like a Finger? · Hash House Quartet · The Jesus Song · Yo Ho · Rodriguez the Mexican Pervert (the title alone suggests it would fail the screen)
