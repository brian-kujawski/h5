# Recording guide

Phase 0 asks for about 10 recorded songs so newcomers can learn the tunes. Playback lands in Phase 2; recordings collected now just need to be captured well and with consent.

## Which songs first

Start with the songs most circles need and most newcomers don't know the tune of:

1. Here's to the Hare (Basic Down-Down)
2. Short Down-Down
3. Why Are We Waiting
4. Swing Low (with gestures, ideally on video for reference)
5. Alouette (call and response)
6. Father Abraham
7. Hash Days of the Week
8. Amazing Beer
9. Sing a Song of Six Checks
10. Farewell Song

## How to record

- Any phone voice-memo app is fine. Record at circle or in a quiet room; a real circle sounds more fun, a quiet room is easier to learn from.
- One song per file, with a second or two of silence at each end.
- The app will ship AAC (`.m4a`), mono, about 64 kbps, so a 90-second song is under 1 MB. Send the original; it gets converted later.

## Consent and licence (required)

Every recording needs, before it ships:

- **Consent** from everyone clearly audible, to have it in a public app.
- **A licence.** Creative Commons BY 4.0 is suggested.
- **No commercial recordings.** Only hashers' own singing.

The content check refuses a recording whose `consent_confirmed` isn't `true`.

## Metadata

Once a file is hosted (Phase 2 sets up storage), add it to the song's front matter:

```yaml
recordings:
  - url: https://media.example.com/songs/short-down-down/moa2h3-2026.m4a
    duration_s: 42
    performer: MoA2H3 circle
    licence: CC BY 4.0
    consent_confirmed: true
    bytes: 340000
```
