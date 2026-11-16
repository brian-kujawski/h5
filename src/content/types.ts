/**
 * Song data model. Mirrors the "Song data model" table in the H5 plan.
 * Song files (content/songs/*.md) are compiled into this shape by
 * scripts/build-content.ts; the app only ever reads the compiled JSON.
 */

export const STYLES = [
  'down-down',
  'chant',
  'sing-along',
  'call-and-response',
  'actions',
  'round',
  'take-turns',
  'spoken',
] as const;
export type Style = (typeof STYLES)[number];

/** Drives the optional clean filter only. The whole app is 18+, so there is no per-song age badge. */
export const RATINGS = ['clean', 'cheeky', 'explicit'] as const;
export type Rating = (typeof RATINGS)[number];

export const LENGTHS = ['quick', 'standard', 'epic'] as const;
export type Length = (typeof LENGTHS)[number];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const MOMENT_GROUPS = ['circle', 'extra'] as const;
export type MomentGroup = (typeof MOMENT_GROUPS)[number];

export type Moment = {
  id: string;
  name: string;
  blurb: string;
  /** Phosphor icon name. */
  icon: string;
  group: MomentGroup;
};

/** A run of text inside a lyric line. `note` is a performance note or gesture, written in (parentheses). */
export type Segment = { kind: 'lyric' | 'note'; text: string };

/** Who sings a line in call-and-response songs. */
export type Part = 'leader' | 'all';

export type Line = {
  part?: Part;
  segments: Segment[];
};

export const SECTION_TYPES = ['verse', 'chorus', 'note'] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export type Section = {
  type: SectionType;
  lines: Line[];
  /** Verse number (1-based) for verses; chorus and notes have none. */
  number?: number;
  /** True when this chorus had no lines in the file and repeats the first chorus. */
  repeat?: boolean;
};

export type Recording = {
  url: string;
  duration_s: number;
  performer: string;
  licence: string;
  consent_confirmed: boolean;
  bytes?: number;
};

export type Song = {
  id: string;
  title: string;
  alt_titles: string[];
  tune: string | null;
  /** One-line pitch for lists. Null until a hasher writes one. */
  hook: string | null;
  moments: string[];
  style: Style[];
  rating: Rating;
  length: Length;
  difficulty: Difficulty;
  pronoun_variants: boolean;
  fill_in: string[];
  ends_with_down_down: boolean;
  review_flags: string[];
  origin: string | null;
  source_title: string | null;
  notes: string | null;
  recordings: Recording[];
  metadata_status: 'provisional' | 'reviewed';
  sections: Section[];
  /** First sung line, for lists and search. */
  first_line: string;
};

export type Songbook = {
  /** Bumped when the compiled shape changes. */
  schema: 1;
  moments: Moment[];
  songs: Song[];
};
