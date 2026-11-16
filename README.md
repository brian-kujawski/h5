# H5: Harry's Hash House Harrier Hymnal

H5 puts the right song, and every word of it, in the hand of whoever is leading circle. Pick the moment, get a short list of songs that fit, and sing along with big, readable lyrics. Everything works offline.

iOS and Android from one codebase: React Native + Expo (SDK 58, TypeScript, Expo Router).

## Run it

```
npm install
npm start          # then press i, a or w; or scan the QR code with Expo Go
```

The web preview (`npm run web`) is handy for a quick look in a browser.

## Project layout

```
content/
  songs/*.md         one song per file (Markdown + YAML header)
  moments.yml        the occasions on the Circle tab
  README.md          file format and the review list for the seed songbook
scripts/
  build-content.ts   validates songs and compiles the bundled songbook
src/
  app/               screens (Expo Router): Circle, Songs, Saved, More, moment and song pages
  components/        lyrics renderer, song rows, age gate, ...
  content/           song types, parser, compiled songbook and in-memory search
  lib/               settings (clean mode, theme, saved songs) stored on device
  theme/tokens.ts    colours, type and spacing from the style bible
tests/               parser and songbook tests (node:test)
docs/                recording guide
```

## Everyday commands

| Command | What it does |
| --- | --- |
| `npm run content` | Validate every song and rebuild `src/content/generated/songbook.json` |
| `npm run verify` | Everything CI runs: songbook check, typecheck, lint, tests |
| `npm test` | Parser and songbook tests |

## Adding or fixing a song

Edit or add a file in `content/songs/`, run `npm run content`, and open a pull request with both changes. The format is in [content/README.md](content/README.md).

## Decisions baked in

- **18+ app.** One age check on first launch, plus the right store rating (Apple 18+, Google Play Mature 17+). There are no per-song age badges.
- **Clean mode** hides explicit songs everywhere, for circles with kids around. It starts on and lives in More.
- **Default songbook** is the songs sung at MoA2H3 and DeMonH3. Custom kennel hymnals are a later phase.
- **Credits** only where a source is known.

## Phases

From the H5 plan:

- **Phase 0, foundations** (this repo's starting point): songs in the content repo, moment taxonomy, mock-ups of the four key screens, about 10 recordings.
- **Phase 1, lyrics MVP:** the four tabs for real, song screen and circle mode, search and filters, light and dark, everything offline.
- **Phase 2, recordings:** streaming, downloads, mini player, background playback.
- **Phase 3, public launch:** store listings, age ratings, crash reporting, over-the-air content updates.
- **Phase 4, community:** in-app song submissions, Custom Hymnals; first phase with accounts and a backend.
