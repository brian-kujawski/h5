import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { firstSungLine, parseBody, parseLine, parseSegments, splitFrontMatter, validateMeta } from '../src/content/parse';

const validMeta = () => ({
  id: 'test-song',
  title: 'Test Song',
  tune: null,
  hook: null,
  moments: ['hares'],
  style: ['sing-along'],
  rating: 'clean',
  length: 'quick',
  difficulty: 'easy',
  pronoun_variants: false,
  fill_in: [],
  ends_with_down_down: true,
  review_flags: [],
  origin: null,
  source_title: null,
  notes: null,
  recordings: [],
  metadata_status: 'provisional',
});
const moments = new Set(['hares', 'virgin']);

describe('splitFrontMatter', () => {
  it('separates YAML from the body', () => {
    const { yaml, body } = splitFrontMatter('---\nid: x\n---\n\n[verse]\nHi\n');
    assert.equal(yaml, 'id: x');
    assert.equal(body.trim(), '[verse]\nHi');
  });
  it('rejects files without front matter', () => {
    assert.throws(() => splitFrontMatter('[verse]\nHi'), /front matter/);
  });
});

describe('parseSegments', () => {
  it('splits gestures out of lyrics', () => {
    assert.deepEqual(parseSegments('Swing low (swing arms), sweet'), [
      { kind: 'lyric', text: 'Swing low ' },
      { kind: 'note', text: 'swing arms' },
      { kind: 'lyric', text: ', sweet' },
    ]);
  });
  it('keeps unbalanced parentheses as lyric text', () => {
    assert.deepEqual(parseSegments('Oh (no'), [{ kind: 'lyric', text: 'Oh (no' }]);
  });
  it('treats a whole-line note as a note', () => {
    assert.deepEqual(parseSegments('(Take turns leading verses)'), [{ kind: 'note', text: 'Take turns leading verses' }]);
  });
});

describe('parseLine', () => {
  it('reads Leader and All parts', () => {
    assert.equal(parseLine('Leader: Does she?').part, 'leader');
    assert.equal(parseLine('All: Oui!').part, 'all');
    assert.equal(parseLine('All: Oui!').segments[0].text, 'Oui!');
    assert.equal(parseLine('Plain line').part, undefined);
  });
});

describe('parseBody', () => {
  it('numbers verses and repeats an empty chorus', () => {
    const sections = parseBody('[chorus]\nLa la\n\n[verse]\nOne\n\n[chorus]\n\n[verse]\nTwo\n');
    assert.deepEqual(
      sections.map((s) => [s.type, s.number, s.repeat]),
      [
        ['chorus', undefined, undefined],
        ['verse', 1, undefined],
        ['chorus', undefined, true],
        ['verse', 2, undefined],
      ],
    );
    assert.equal(sections[2].lines[0].segments[0].text, 'La la');
  });
  it('treats lyrics before any header as the first verse', () => {
    const sections = parseBody('Hello\n[chorus]\nHey');
    assert.equal(sections[0].type, 'verse');
    assert.equal(sections[0].number, 1);
  });
  it('rejects unknown section types', () => {
    assert.throws(() => parseBody('[bridge]\nHi'), /unknown section \[bridge\]/);
  });
  it('rejects an empty chorus with nothing to repeat', () => {
    assert.throws(() => parseBody('[verse]\nHi\n[chorus]\n'), /no chorus to repeat/);
  });
});

describe('firstSungLine', () => {
  it('skips notes and gestures', () => {
    const sections = parseBody('[verse]\n(Take turns)\nI used (point) to work');
    assert.equal(firstSungLine(sections), 'I used to work');
  });
});

describe('validateMeta', () => {
  it('accepts a valid song', () => {
    assert.deepEqual(validateMeta(validMeta(), 'test-song', moments), []);
  });
  it('requires the id to match the file name', () => {
    assert.match(validateMeta(validMeta(), 'other', moments).join(), /must match the file name/);
  });
  it('rejects unknown moments, styles and ratings', () => {
    const errors = validateMeta(
      { ...validMeta(), moments: ['nope'], style: ['yodel'], rating: 'filthy' },
      'test-song',
      moments,
    ).join('\n');
    assert.match(errors, /unknown moment "nope"/);
    assert.match(errors, /unknown style "yodel"/);
    assert.match(errors, /rating must be one of/);
  });
  it('blocks recordings without confirmed consent', () => {
    const errors = validateMeta(
      {
        ...validMeta(),
        recordings: [{ url: 'https://x/y.m4a', duration_s: 60, performer: 'MoA2H3', licence: 'CC BY 4.0', consent_confirmed: false }],
      },
      'test-song',
      moments,
    );
    assert.match(errors.join(), /consent_confirmed must be true/);
  });
});
