# H5 songbook content

Every song is one Markdown file in `songs/`. Songmeisters add or fix songs with a pull request, and Git history shows who changed what. `moments.yml` is the list of occasions shown as tiles on the Circle tab. The main tiles follow the DeMon H3 ending-circle running order (Circle up, Hares, Virgins, Visitors, FRB, Accusations, Hashy birthdays, Backsliders, May the hash go in peace); a tile can `include` finer-grained moments, so Accusations also lists trail-mishap, hash-crime and too-drunk songs.

After editing, run:

```
npm run content
```

That validates every file and rebuilds `src/content/generated/songbook.json`, which ships inside the app so everything works offline. CI fails if a song is invalid or the JSON wasn't rebuilt.

## The seed songbook

79 songs from the Motown Ann Arbor H3 Hymnal PDF (rev. 20 April 2009), plus "Here's to Fellow Hashers" from the DeMon H3 RA cheat sheet. The default bundled list is the songs sung at MoA2H3 and DeMonH3, and it will change over time.

## The November 2026 import

310 more songs came from three hymnals scavenged from other kennels:

- 306 from Flying Booger's Hash Hymns III (Summit H3 songbook, January 1994).
- 4 from the Ibaraki H3 Hash Hymnal.
- None from the Memphis H3 hymnal yet, because only its title index came through.

Songs that were misogynist, racist, ableist, homophobic or transphobic were left out, along with any that sexualise children or are built around rape. A few otherwise-fine songs had single verses removed. Bestiality, incest and necrophilia songs are on hold for the kennel to decide. [import-review-2026-11.md](import-review-2026-11.md) lists every exclusion, hold, duplicate and flag, with the reasons.

How the imported songs were tagged:

- **Rating:** none of them is rated `clean`. Each one is either `explicit` (it contains a sexual word) or `cheeky`, so clean mode hides them all until a songmeister promotes the genuinely clean ones.
- **Moments:** most are tagged `any-time`.
- **Hooks:** all are `null`.
- **Stanzas:** the Summit text lost its stanza breaks, so verses were re-split into 4-line blocks. Some will be split in the wrong place.

**All metadata is provisional.** Moments, ratings, length, difficulty and hooks are rough placeholders to show the format. Real values come from hashers. Every file says `metadata_status: provisional` until someone reviews it.

## File format

```
---
id: short-down-down          # must match the file name
title: "Short Down-Down"
alt_titles: []               # optional; searchable
tune: null                   # "to the tune of", if a parody
hook: "One-line pitch shown in lists"   # or null
moments: [any-down-down]     # ids from moments.yml; at least one
style: [down-down]           # down-down, chant, sing-along, call-and-response, actions, round, take-turns, spoken
rating: clean                # clean | cheeky | explicit (only drives clean mode; the whole app is 18+)
length: quick                # quick | standard | epic
difficulty: easy             # easy | medium | hard
pronoun_variants: false      # lyrics use he/she/they or him/her swaps
fill_in: []                  # placeholders to fill, e.g. [name, age]
ends_with_down_down: true
review_flags: []             # things a kennel should decide on before publishing
origin: ...                  # credit a source only where one is known
source_title: ...            # heading exactly as in the source
notes: null
recordings: []               # see docs/recording-guide.md
metadata_status: provisional # provisional | reviewed
---

[verse]
lyric lines...

[chorus]
lyric lines...

[chorus]
                             # an empty [chorus] = "sing the chorus again"
[note]
Performance instructions shown as a side note.
```

Lyric conventions:

- `[verse]`, `[chorus]` and `[note]` start a section. Lines before any header count as the first verse.
- `Leader:` and `All:` prefixes mark call-and-response parts. The app shows the leader's part in the accent colour.
- `(text in parentheses)` is a gesture or performance note, shown in smaller secondary text.

## Things to review

These came up during the import. Toledo Down-Down, Yogi Bear and Twenty Toes were removed at the kennel's request and may come back later; nothing else has been removed or reworded.

- **Swing Low** was rebuilt from a gesture grid; check the word-to-gesture pairing.
- Two songs were both titled "Alternate Birthday Song"; they're now "May You Live 100 Years" and "Here's to (Name) Birthday Song".
- 21 songs have no hook yet (`hook: null`); lists show the first line instead.
- Imported songs flagged `verses-left-out`, `check-content`, `stereotypes`, `copyright`, `names-a-person`, `kennel-specific` or `bestiality` show a KENNEL REVIEW line until someone clears the flag. The song's `notes` say why.
- Lyrics are otherwise kept as written (including original spellings), with page headers and footers removed.

## Ideas the songbook surfaced for later phases

- **Growing lists** (Alouette body parts, Chicago extra verses) want a "more verses" list rather than full verses.
- **Pronoun swaps and fill-ins** (he/she/they, (name), (age)) suggest a "who's in the middle?" toggle on the song screen.
- **Kennel-specific lines** ("Motown – Ann Arbor") should become a kennel-name placeholder, and later part of Custom Hymnals.
