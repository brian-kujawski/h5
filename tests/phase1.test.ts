import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { shareText, songLink } from '../src/content/share';
import {
  activeFilterCount,
  editDistance,
  findSongs,
  fitsMoment,
  getSong,
  NO_FILTERS,
  searchSongs,
  songs,
  songSize,
  songsForMoment,
} from '../src/content/songbook';
import { LYRIC_SCALES, nextStop, stepScale } from '../src/lib/circle';
import { moveSaved } from '../src/lib/saved';

describe('typo-tolerant search', () => {
  it('measures edit distance', () => {
    assert.equal(editDistance('chicgo', 'chicago', 2), 1);
    assert.equal(editDistance('beer', 'beer', 1), 0);
    assert.ok(editDistance('abc', 'xyz', 1) > 1);
    assert.equal(editDistance('swnig', 'swing', 1), 1, 'a swapped pair is one typo');
  });
  it('finds a misspelled title', () => {
    assert.equal(searchSongs('chicgo', false)[0]?.id, 'chicago');
    assert.ok(searchSongs('swnig low', false).some((s) => s.id === 'swing-low'));
  });
  it('does not add fuzzy noise when there are exact matches', () => {
    const exact = searchSongs('beer', false);
    assert.ok(exact.length > 0);
    assert.ok(exact.every((s) => /beer/i.test(JSON.stringify(s))));
  });
  it('leaves short words exact', () => {
    assert.deepEqual(searchSongs('qzx', false), []);
  });
});

describe('filters', () => {
  it('counts active filters', () => {
    assert.equal(activeFilterCount(NO_FILTERS), 0);
    assert.equal(activeFilterCount({ ...NO_FILTERS, sizes: ['S'], hasRecording: true }), 2);
  });
  it('with no filters returns every visible song', () => {
    assert.equal(findSongs('', NO_FILTERS, false).length, songs.length);
  });
  it('ORs within a category and ANDs across categories', () => {
    const quickOrEpic = findSongs('', { ...NO_FILTERS, sizes: ['S', 'XL'] }, false);
    assert.ok(quickOrEpic.every((s) => songSize(s) === 'S' || songSize(s) === 'XL'));
    const quickEasy = findSongs('', { ...NO_FILTERS, sizes: ['S'], difficulties: ['easy'] }, false);
    assert.ok(quickEasy.every((s) => songSize(s) === 'S' && s.difficulty === 'easy'));
    assert.ok(quickEasy.length <= quickOrEpic.length);
  });
  it('filters by moment the same way the Circle tiles do', () => {
    const viaFilter = findSongs('', { ...NO_FILTERS, moments: ['accusations'] }, false).map((s) => s.id).sort();
    const viaTile = songsForMoment('accusations', false).map((s) => s.id).sort();
    assert.deepEqual(viaFilter, viaTile);
    assert.ok(songs.filter((s) => fitsMoment(s, 'accusations')).length === viaTile.length);
  });
  it('still respects clean mode', () => {
    const r = findSongs('', { ...NO_FILTERS, ratings: ['explicit'] }, true);
    assert.deepEqual(r, []);
  });
  it('has-recording filter only keeps songs with recordings', () => {
    const r = findSongs('', { ...NO_FILTERS, hasRecording: true }, false);
    assert.ok(r.every((s) => s.recordings.length > 0));
  });
});

describe('size badge', () => {
  it('buckets songs by sung lines into S, M, L and XL', () => {
    const one = (n: number) => ({ ...songs[0], sections: [{ type: 'verse' as const, number: 1, lines: Array.from({ length: n }, () => ({ segments: [] })) }] });
    assert.deepEqual([1, 6, 7, 16, 17, 32, 33, 60].map((n) => songSize(one(n))), ['S', 'S', 'M', 'M', 'L', 'L', 'XL', 'XL']);
  });
  it('ignores performance notes', () => {
    const song = { ...songs[0], sections: [{ type: 'note' as const, lines: Array.from({ length: 50 }, () => ({ segments: [] })) }] };
    assert.equal(songSize(song), 'S');
  });
});

describe('share text', () => {
  it('includes the title, lyrics, chorus label and an app link', () => {
    const song = getSong('alouette-female')!;
    const text = shareText(song);
    assert.ok(text.startsWith(song.title.toUpperCase()));
    assert.ok(text.includes('Chorus:'));
    assert.ok(text.includes(song.first_line));
    assert.ok(text.endsWith(songLink(song)));
    assert.equal(songLink(song), 'h5://song/alouette-female');
  });
  it('marks call-and-response parts', () => {
    const song = songs.find((s) => s.sections.some((sec) => sec.lines.some((l) => l.part === 'leader')));
    if (song) assert.ok(shareText(song).includes('Leader: '));
  });
});

describe('circle mode stepping', () => {
  const stops = [0, 300, 700, 1200];
  it('goes to the next section start', () => {
    assert.equal(nextStop(stops, 0, 1), 300);
    assert.equal(nextStop(stops, 310, 1), 700);
    assert.equal(nextStop(stops, 296, 1), 700, 'already at a stop within slack, so skip it');
  });
  it('goes back a section and never below zero', () => {
    assert.equal(nextStop(stops, 700, -1), 300);
    assert.equal(nextStop(stops, 100, -1), 0);
    assert.equal(nextStop([], 50, -1), 0);
  });
  it('stays put at the last section', () => {
    assert.equal(nextStop(stops, 1200, 1), 1200);
  });
});

describe('lyric size steps', () => {
  it('steps up and down and clamps at the ends', () => {
    assert.equal(stepScale(1, 1), 1.15);
    assert.equal(stepScale(1, -1), 0.85);
    assert.equal(stepScale(LYRIC_SCALES[0], -1), LYRIC_SCALES[0]);
    assert.equal(stepScale(1.75, 1), 1.75);
  });
  it('snaps an old saved size to the nearest step', () => {
    assert.equal(stepScale(1.2, 1), 1.3);
    assert.equal(stepScale(1.45, -1), 1.3);
  });
});

describe('saved order', () => {
  it('moves a song up or down and ignores moves off the ends', () => {
    assert.deepEqual(moveSaved(['a', 'b', 'c'], 'b', -1), ['b', 'a', 'c']);
    assert.deepEqual(moveSaved(['a', 'b', 'c'], 'b', 1), ['a', 'c', 'b']);
    assert.deepEqual(moveSaved(['a', 'b'], 'a', -1), ['a', 'b']);
    assert.deepEqual(moveSaved(['a'], 'z', 1), ['a']);
  });
  it('skips songs clean mode is hiding', () => {
    const visible = new Set(['a', 'c']);
    assert.deepEqual(moveSaved(['a', 'b', 'c'], 'c', -1, visible), ['c', 'b', 'a']);
    assert.deepEqual(moveSaved(['a', 'b', 'c'], 'a', -1, visible), ['a', 'b', 'c']);
  });
});
