/**
 * Pure parsing and validation for song files. No Node or React Native
 * imports, so it runs in the build script, in tests, and (if ever needed) in the app.
 *
 * File format (see content/README.md):
 *   ---            YAML front matter, parsed by the caller
 *   ---
 *   [verse]        starts a section; also [chorus] and [note]
 *   Leader: ...    call-and-response parts
 *   All: ...
 *   (gesture)      performance notes inline, shown as secondary text
 *   [chorus]       with no lines = "sing the chorus again"
 */
import {
  DIFFICULTIES,
  LENGTHS,
  type Line,
  type Moment,
  MOMENT_GROUPS,
  RATINGS,
  type Section,
  SECTION_TYPES,
  type SectionType,
  type Segment,
  type Song,
  STYLES,
} from './types';

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Split a song file into its raw YAML header and lyric body. */
export function splitFrontMatter(source: string): { yaml: string; body: string } {
  const match = FRONT_MATTER.exec(source);
  if (!match) throw new Error('missing YAML front matter (--- ... ---)');
  return { yaml: match[1], body: match[2] };
}

/** Split a line into lyric and (note) segments. Unbalanced parentheses are kept as lyric text. */
export function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const push = (kind: Segment['kind'], value: string) => {
    if (!value) return;
    const last = segments[segments.length - 1];
    if (last && last.kind === kind) last.text += value;
    else segments.push({ kind, text: value });
  };
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('(', i);
    if (open === -1) {
      push('lyric', text.slice(i));
      break;
    }
    const close = text.indexOf(')', open);
    if (close === -1) {
      push('lyric', text.slice(i));
      break;
    }
    push('lyric', text.slice(i, open));
    push('note', text.slice(open + 1, close).trim());
    i = close + 1;
  }
  // Tidy whitespace around notes: "Swing low (arms), sweet" -> ["Swing low", (arms), ", sweet"].
  return segments
    .map((s) => (s.kind === 'lyric' ? { ...s, text: s.text.replace(/\s+/g, ' ') } : s))
    .filter((s) => s.text.trim() !== '');
}

const PART_PREFIX = /^(Leader|All)\s*:\s*/i;

export function parseLine(raw: string): Line {
  const match = PART_PREFIX.exec(raw);
  if (!match) return { segments: parseSegments(raw) };
  return {
    part: match[1].toLowerCase() === 'leader' ? 'leader' : 'all',
    segments: parseSegments(raw.slice(match[0].length)),
  };
}

const SECTION_HEADER = /^\[([a-z]+)\]\s*$/;

/** Parse the lyric body into ordered sections. Throws on unknown section types. */
export function parseBody(body: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  let verseCount = 0;

  body.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    const header = SECTION_HEADER.exec(line.trim());
    if (header) {
      const type = header[1] as SectionType;
      if (!SECTION_TYPES.includes(type)) {
        throw new Error(`line ${index + 1}: unknown section [${header[1]}]`);
      }
      current = { type, lines: [] };
      if (type === 'verse') current.number = ++verseCount;
      sections.push(current);
      return;
    }
    if (line.trim() === '') return;
    if (!current) {
      // Lyrics before any header are treated as the first verse.
      current = { type: 'verse', lines: [], number: ++verseCount };
      sections.push(current);
    }
    current.lines.push(parseLine(line.trim()));
  });

  // An empty [chorus] means "sing the chorus again": point it at the first chorus with lines.
  const firstChorus = sections.find((s) => s.type === 'chorus' && s.lines.length > 0);
  for (const section of sections) {
    if (section.type === 'chorus' && section.lines.length === 0) {
      if (!firstChorus) throw new Error('empty [chorus] but the song has no chorus to repeat');
      section.repeat = true;
      section.lines = firstChorus.lines;
    }
  }
  return sections;
}

/** First line someone would actually sing, ignoring pure performance notes. */
export function firstSungLine(sections: Section[]): string {
  for (const section of sections) {
    if (section.type === 'note') continue;
    for (const line of section.lines) {
      const text = line.segments
        .filter((s) => s.kind === 'lyric')
        .map((s) => s.text)
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) return text;
    }
  }
  return '';
}

type Meta = Record<string, unknown>;

const isString = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
const isStringOrNull = (v: unknown) => v === null || v === undefined || typeof v === 'string';
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');
const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T =>
  typeof v === 'string' && (list as readonly string[]).includes(v);

/** Validate front matter. Returns a list of human-readable problems; empty means valid. */
export function validateMeta(meta: Meta, fileId: string, momentIds: Set<string>): string[] {
  const errors: string[] = [];
  const need = (ok: boolean, message: string) => {
    if (!ok) errors.push(message);
  };

  need(meta.id === fileId, `id "${String(meta.id)}" must match the file name "${fileId}"`);
  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(meta.id)), 'id must be kebab-case');
  need(isString(meta.title), 'title is required');
  need(meta.hook === null || meta.hook === undefined || isString(meta.hook), 'hook must be text or null');
  need(isStringOrNull(meta.tune), 'tune must be text or null');
  need(meta.alt_titles === undefined || isStringArray(meta.alt_titles), 'alt_titles must be a list');

  if (!isStringArray(meta.moments) || meta.moments.length === 0) {
    errors.push('moments must be a non-empty list');
  } else {
    for (const m of meta.moments) {
      need(momentIds.has(m), `unknown moment "${m}" (add it to content/moments.yml or fix the tag)`);
    }
  }
  if (!isStringArray(meta.style) || meta.style.length === 0) {
    errors.push('style must be a non-empty list');
  } else {
    for (const s of meta.style) need(isOneOf(STYLES, s), `unknown style "${s}"`);
  }

  need(isOneOf(RATINGS, meta.rating), `rating must be one of ${RATINGS.join(', ')}`);
  need(isOneOf(LENGTHS, meta.length), `length must be one of ${LENGTHS.join(', ')}`);
  need(isOneOf(DIFFICULTIES, meta.difficulty), `difficulty must be one of ${DIFFICULTIES.join(', ')}`);
  need(typeof meta.pronoun_variants === 'boolean', 'pronoun_variants must be true or false');
  need(typeof meta.ends_with_down_down === 'boolean', 'ends_with_down_down must be true or false');
  need(isStringArray(meta.fill_in), 'fill_in must be a list');
  need(isStringArray(meta.review_flags), 'review_flags must be a list');
  need(isOneOf(['provisional', 'reviewed'] as const, meta.metadata_status), 'metadata_status must be provisional or reviewed');

  if (!Array.isArray(meta.recordings)) {
    errors.push('recordings must be a list');
  } else {
    meta.recordings.forEach((r: unknown, i) => {
      const rec = (r ?? {}) as Meta;
      need(isString(rec.url), `recordings[${i}].url is required`);
      need(typeof rec.duration_s === 'number', `recordings[${i}].duration_s must be a number`);
      need(isString(rec.performer), `recordings[${i}].performer is required`);
      need(isString(rec.licence), `recordings[${i}].licence is required`);
      need(rec.consent_confirmed === true, `recordings[${i}].consent_confirmed must be true before a recording ships`);
    });
  }
  return errors;
}

/** Build a compiled Song from validated front matter and the lyric body. */
export function buildSong(meta: Meta, body: string): Song {
  const sections = parseBody(body);
  if (!sections.some((s) => s.type !== 'note' && s.lines.length > 0)) {
    throw new Error('song has no lyrics');
  }
  const str = (v: unknown) => (typeof v === 'string' ? v : null);
  return {
    id: meta.id as string,
    title: meta.title as string,
    alt_titles: (meta.alt_titles as string[] | undefined) ?? [],
    tune: str(meta.tune),
    hook: str(meta.hook),
    moments: meta.moments as string[],
    style: meta.style as Song['style'],
    rating: meta.rating as Song['rating'],
    length: meta.length as Song['length'],
    difficulty: meta.difficulty as Song['difficulty'],
    pronoun_variants: meta.pronoun_variants as boolean,
    fill_in: meta.fill_in as string[],
    ends_with_down_down: meta.ends_with_down_down as boolean,
    review_flags: meta.review_flags as string[],
    origin: str(meta.origin),
    source_title: str(meta.source_title),
    notes: str(meta.notes),
    recordings: meta.recordings as Song['recordings'],
    metadata_status: meta.metadata_status as Song['metadata_status'],
    sections,
    first_line: firstSungLine(sections),
  };
}

/** Validate the moment taxonomy. */
export function validateMoments(raw: unknown): { moments: Moment[]; errors: string[] } {
  const errors: string[] = [];
  if (!Array.isArray(raw)) return { moments: [], errors: ['moments.yml must be a list'] };
  const seen = new Set<string>();
  raw.forEach((m: Meta, i) => {
    const where = `moments[${i}]${m?.id ? ` (${String(m.id)})` : ''}`;
    if (!isString(m?.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id)) errors.push(`${where}: id must be kebab-case`);
    else if (seen.has(m.id)) errors.push(`${where}: duplicate id`);
    else seen.add(m.id);
    if (!isString(m?.name)) errors.push(`${where}: name is required`);
    if (!isString(m?.blurb)) errors.push(`${where}: blurb is required`);
    if (!isString(m?.icon)) errors.push(`${where}: icon is required`);
    if (!isOneOf(MOMENT_GROUPS, m?.group)) errors.push(`${where}: group must be circle or extra`);
  });
  return { moments: raw as Moment[], errors };
}
