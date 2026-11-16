/**
 * Read-only access to the bundled songbook. Everything here works offline.
 *
 * Search runs in memory over a prebuilt word index. For a songbook of a few hundred
 * songs that is instant, works the same on iOS, Android and the web preview, and
 * (unlike SQLite FTS) tolerates misspellings. If the songbook grows into the
 * thousands, or content updates start downloading a database (Phase 3), swap the
 * internals for SQLite FTS behind these same function shapes.
 */
import data from './generated/songbook.json';
import type { Difficulty, Moment, Rating, Song, Songbook, Style } from './types';

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
 * Songs for a moment, ranked for circle: songs tagged with this moment first,
 * then songs from moments it includes (see `includes` in moments.yml).
 * Within each, songs made for fewer moments first, then easier and quicker, then by title.
 */
export function songsForMoment(momentId: string, cleanMode: boolean, pool: Song[] = songs): Song[] {
  const included = new Set(getMoment(momentId)?.includes ?? []);
  const tier = (s: Song) => (s.moments.includes(momentId) ? 0 : s.moments.some((m) => included.has(m)) ? 1 : -1);
  return pool
    .filter((s) => tier(s) >= 0 && isVisible(s, cleanMode))
    .sort(
      (a, b) =>
        tier(a) - tier(b) ||
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

type IndexEntry = {
  title: string;
  body: string;
  /** Every distinct word in the title and lyrics, for typo-tolerant matching. */
  words: string[];
};

function buildEntry(s: Song): IndexEntry {
  const title = normalize([s.title, ...s.alt_titles].join(' '));
  const body = normalize(`${s.tune ?? ''} ${lyricText(s)}`);
  return { title, body, words: [...new Set(`${title} ${body}`.split(' ').filter(Boolean))] };
}

const index = new Map(songs.map((s) => [s.id, buildEntry(s)]));
const entryFor = (song: Song) => index.get(song.id) ?? buildEntry(song);

/** Edit distance counting a swap of two neighbouring letters as one typo; gives up once it exceeds `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], prev2[j - 2] + 1);
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

/** How many typos a query word may have: none for short words, one from 4 letters, two from 8. */
const typoBudget = (word: string) => (word.length >= 8 ? 2 : word.length >= 4 ? 1 : 0);

const startsAWord = (haystack: string, w: string) => haystack.startsWith(w) || haystack.includes(` ${w}`);

/** True when some word starts with `w`, or (allowing typos) is within the typo budget of it or of its prefix. */
function fuzzyHit(words: string[], w: string): boolean {
  const budget = typoBudget(w);
  if (budget === 0) return false;
  return words.some(
    (word) => editDistance(w, word, budget) <= budget || (word.length > w.length && editDistance(w, word.slice(0, w.length), budget) <= budget),
  );
}

/**
 * Every word of the query must start a word in the song (so "swing lo" finds Swing Low).
 * If nothing matches exactly, misspelled words are allowed ("chicgo" finds Chicago).
 * Title matches rank above lyric matches, and exact matches above fuzzy ones.
 */
export function searchSongs(query: string, cleanMode: boolean, pool: Song[] = songs): Song[] {
  const words = normalize(query).split(' ').filter(Boolean);
  const visible = pool.filter((s) => isVisible(s, cleanMode));
  if (words.length === 0) return [...visible].sort(byTitle);

  const scored: { song: Song; score: number }[] = [];
  for (const song of visible) {
    const entry = entryFor(song);
    const all = `${entry.title} ${entry.body}`;
    if (words.every((w) => startsAWord(entry.title, w))) scored.push({ song, score: 0 });
    else if (words.every((w) => startsAWord(all, w))) scored.push({ song, score: 1 });
    else if (words.every((w) => startsAWord(all, w) || fuzzyHit(entry.words, w))) scored.push({ song, score: 2 });
  }
  // Only fall back to fuzzy matches when there are no exact ones, so typo tolerance never adds noise.
  const best = scored.some((x) => x.score < 2) ? scored.filter((x) => x.score < 2) : scored;
  return best.sort((a, b) => a.score - b.score || byTitle(a.song, b.song)).map((x) => x.song);
}

const byTitle = (a: Song, b: Song) => a.title.localeCompare(b.title);

/**
 * How big a song is at a glance, from how many lines get sung (repeated choruses count):
 * S up to 6 lines (a chant or down-down), M up to 16, L up to 32, XL beyond.
 */
export const SIZES = ['S', 'M', 'L', 'XL'] as const;
export type Size = (typeof SIZES)[number];

export const SIZE_NAMES: Record<Size, string> = { S: 'Short', M: 'Medium', L: 'Long', XL: 'Extra long' };

export const sungLines = (song: Song) =>
  song.sections.filter((s) => s.type !== 'note').reduce((n, s) => n + s.lines.length, 0);

export function songSize(song: Song): Size {
  const n = sungLines(song);
  return n <= 6 ? 'S' : n <= 16 ? 'M' : n <= 32 ? 'L' : 'XL';
}

/** Songs tab filters. An empty list means "any". */
export type SongFilters = {
  moments: string[];
  ratings: Rating[];
  sizes: Size[];
  styles: Style[];
  difficulties: Difficulty[];
  hasRecording: boolean;
};

export const NO_FILTERS: SongFilters = {
  moments: [],
  ratings: [],
  sizes: [],
  styles: [],
  difficulties: [],
  hasRecording: false,
};

export const activeFilterCount = (f: SongFilters) =>
  f.moments.length + f.ratings.length + f.sizes.length + f.styles.length + f.difficulties.length + (f.hasRecording ? 1 : 0);

/** True when the song fits a moment directly or through that moment's `includes`, same as the Circle tiles. */
export function fitsMoment(song: Song, momentId: string): boolean {
  const ids = [momentId, ...(getMoment(momentId)?.includes ?? [])];
  return song.moments.some((m) => ids.includes(m));
}

/** Within a category any selected value matches (OR); across categories all must match (AND). */
export function matchesFilters(song: Song, f: SongFilters): boolean {
  return (
    (f.moments.length === 0 || f.moments.some((m) => fitsMoment(song, m))) &&
    (f.ratings.length === 0 || f.ratings.includes(song.rating)) &&
    (f.sizes.length === 0 || f.sizes.includes(songSize(song))) &&
    (f.styles.length === 0 || f.styles.some((s) => song.style.includes(s))) &&
    (f.difficulties.length === 0 || f.difficulties.includes(song.difficulty)) &&
    (!f.hasRecording || song.recordings.length > 0)
  );
}

/** Search plus filters, as used by the Songs tab. */
export function findSongs(query: string, filters: SongFilters, cleanMode: boolean, pool: Song[] = songs): Song[] {
  return searchSongs(query, cleanMode, pool).filter((s) => matchesFilters(s, filters));
}

/** Style values that at least one song uses, so the filter never offers a dead end. */
export const stylesInUse: Style[] = [...new Set(songs.flatMap((s) => s.style))].sort() as Style[];
export const anyRecordings = songs.some((s) => s.recordings.length > 0);

/** Moments that have at least one visible song, for the given group. */
export function momentsWithCounts(group: Moment['group'], cleanMode: boolean) {
  return moments
    .filter((m) => m.group === group)
    .map((m) => ({ moment: m, count: songsForMoment(m.id, cleanMode).length }));
}
