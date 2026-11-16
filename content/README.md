# H5 songbook content

Every song is one Markdown file in `songs/`. Songmeisters add or fix songs with a pull request, and Git history shows who changed what. `moments.yml` is the list of occasions shown as tiles on the Circle tab.

After editing, run:

```
npm run content
```

That validates every file and rebuilds `src/content/generated/songbook.json`, which ships inside the app so everything works offline. CI fails if a song is invalid or the JSON wasn't rebuilt.

## The seed songbook

82 songs imported from the Motown Ann Arbor H3 Hymnal PDF (rev. 20 April 2009). The default bundled list is the songs sung at MoA2H3 and DeMonH3, and it will change over time.

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

These came up during the import. Nothing has been removed or reworded; that call belongs to the kennel.

- **Toledo Down-Down Song** contains an anti-gay slur (`review_flags: [slur]`).
- **Yogi Bear Song** has a racial-reference verse and an HIV song-ender.
- **Twenty Toes** is only two lines and may be incomplete.
- **Swing Low** was rebuilt from a gesture grid; check the word-to-gesture pairing.
- Two songs were both titled "Alternate Birthday Song"; they're now "May You Live 100 Years" and "Here's to (Name) Birthday Song".
- 23 songs have no hook yet (`hook: null`); lists show the first line instead.
- Lyrics are otherwise kept as written (including original spellings), with page headers and footers removed.

## Ideas the songbook surfaced for later phases

- **Growing lists** (Alouette body parts, Chicago and Yogi Bear extra verses) want a "more verses" list rather than full verses.
- **Pronoun swaps and fill-ins** (he/she/they, (name), (age)) suggest a "who's in the middle?" toggle on the song screen.
- **Kennel-specific lines** ("Motown – Ann Arbor") should become a kennel-name placeholder, and later part of Custom Hymnals.
