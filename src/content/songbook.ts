/**
 * Read-only access to the bundled songbook. Everything here works offline.
 *
 * Phase 0 searches in memory, which is instant for a few hundred songs.
 * Phase 1 swaps this for SQLite full-text search with the same function shapes.
 */
import data from './generated/songbook.json';
import type { Moment, Song, Songbook } from './types';

const songbook = data as unknown as Songbook;

export const moments: Moment[] = songbook.moments;
export const songs: Song[] = songbook.songs;

const byId = new Map(songs.map((s) => [s.id, s]));
const momentById = new Map(moments.map((m) => [m.id, m]));

export const getSong = (id: string): Song | undefined => byId.get(id);
export const getMoment = (id: string): Moment | undefined => momentById.get(id);

/** Clean mode hides explicit songs everywhere; cheeky songs still show. */
export const isVisible = (song: Song, cleanMode: boolean) => !cleanMode || song.rating !== 'explicit';

const LENGTH_ORDER = { quick: 0, standard: 1, epic: 2 } as const;
const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 } as const;

/**
 * Songs for a moment, ranked for circle: songs made for this exact moment first
 * (fewest other moments), then easier and quicker songs, then by title.
 */
export function songsForMoment(momentId: string, cleanMode: boolean, pool: Song[] = songs): Song[] {
  return pool
    .filter((s) => s.moments.includes(momentId) && isVisible(s, cleanMode))
    .sort(
      (a, b) =>
        a.moments.length - b.moments.length ||
        DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] ||
        LENGTH_ORDER[a.length] - LENGTH_ORDER[b.length] ||
        a.title.localeCompare(b.title),
    );
}

/** Lowercase, strip accents and punctuation so "Comin'" matches "comin" and "à" matches "a". */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function lyricText(song: Song): string {
  return song.sections
    .flatMap((s) => s.lines)
    .map((l) => l.segments.filter((seg) => seg.kind === 'lyric').map((seg) => seg.text).join(''))
    .join(' ');
}

const index = new Map(
  songs.map((s) => [
    s.id,
    {
      title: normalize([s.title, ...s.alt_titles].join(' ')),
      body: normalize(`${s.tune ?? ''} ${lyricText(s)}`),
    },
  ]),
);

/**
 * Every word of the query must start a word in the song (so "swing lo" finds Swing Low).
 * Title matches rank above lyric matches.
 */
export function searchSongs(query: string, cleanMode: boolean, pool: Song[] = songs): Song[] {
  const words = normalize(query).split(' ').filter(Boolean);
  const visible = pool.filter((s) => isVisible(s, cleanMode));
  if (words.length === 0) return visible;

  const matches = (haystack: string) =>
    words.every((w) => haystack.startsWith(w) || haystack.includes(` ${w}`));

  const scored: { song: Song; score: number }[] = [];
  for (const song of visible) {
    const entry = index.get(song.id);
    if (!entry) continue;
    if (matches(entry.title)) scored.push({ song, score: 0 });
    else if (matches(`${entry.title} ${entry.body}`)) scored.push({ song, score: 1 });
  }
  return scored.sort((a, b) => a.score - b.score || a.song.title.localeCompare(b.song.title)).map((x) => x.song);
}

/** Moments that have at least one visible song, for the given group. */
export function momentsWithCounts(group: Moment['group'], cleanMode: boolean) {
  return moments
    .filter((m) => m.group === group)
    .map((m) => ({ moment: m, count: songsForMoment(m.id, cleanMode).length }));
}
