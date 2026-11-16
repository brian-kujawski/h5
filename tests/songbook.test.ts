import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { compile } from '../scripts/build-content';
import { getSong, isVisible, moments, normalize, searchSongs, songs, songsForMoment } from '../src/content/songbook';

describe('bundled songbook', () => {
  it('compiles every song file without errors', () => {
    const { errors, songbook } = compile();
    assert.deepEqual(errors, []);
    assert.equal(songbook.songs.length, songs.length);
  });
  it('has unique song ids', () => {
    assert.equal(new Set(songs.map((s) => s.id)).size, songs.length);
  });
  it('gives every song a first line', () => {
    assert.deepEqual(songs.filter((s) => !s.first_line).map((s) => s.id), []);
  });
  it('only uses moments from the taxonomy', () => {
    const ids = new Set(moments.map((m) => m.id));
    for (const s of songs) for (const m of s.moments) assert.ok(ids.has(m), `${s.id} uses ${m}`);
  });
});

describe('clean mode', () => {
  it('hides explicit songs and keeps cheeky and clean ones', () => {
    const explicit = songs.find((s) => s.rating === 'explicit')!;
    const cheeky = songs.find((s) => s.rating === 'cheeky')!;
    assert.equal(isVisible(explicit, true), false);
    assert.equal(isVisible(cheeky, true), true);
    assert.equal(isVisible(explicit, false), true);
  });
  it('applies to moment lists and search', () => {
    for (const s of songsForMoment('any-time', true)) assert.notEqual(s.rating, 'explicit');
    for (const s of searchSongs('', true)) assert.notEqual(s.rating, 'explicit');
  });
});

describe('searchSongs', () => {
  it('normalizes accents and punctuation', () => {
    assert.equal(normalize("Comin' à  la"), 'comin a la');
  });
  it('finds a song from a half-remembered title', () => {
    assert.equal(searchSongs('swing lo', false)[0]?.id, 'swing-low');
  });
  it('finds a song from a lyric line', () => {
    const ids = searchSongs('department store', false).map((s) => s.id);
    assert.ok(ids.includes('chicago'));
  });
  it('ranks title matches above lyric matches', () => {
    const results = searchSongs('beer', false);
    const firstLyricOnly = results.findIndex((s) => !normalize(s.title).includes('beer'));
    const lastTitle = results.map((s) => normalize(s.title).includes('beer')).lastIndexOf(true);
    assert.ok(firstLyricOnly === -1 || lastTitle < firstLyricOnly);
  });
});

describe('songsForMoment', () => {
  it('puts songs made for the moment first', () => {
    const list = songsForMoment('hares', false);
    assert.ok(list.length > 0);
    // Within each tier (tagged directly, then via an included moment), single-purpose songs come first.
    const direct = (s: (typeof list)[number]) => s.moments.includes('hares');
    for (let i = 1; i < list.length; i++) {
      if (direct(list[i - 1]) !== direct(list[i])) continue;
      assert.ok(list[i - 1].moments.length <= list[i].moments.length);
    }
  });
  it('resolves songs by id', () => {
    assert.equal(getSong('hare-toast')?.title, 'Hare Toast');
    assert.equal(getSong('nope'), undefined);
  });
});

describe('moment includes', () => {
  it('lists directly tagged songs before included ones', () => {
    const list = songsForMoment('hares', false);
    const firstIncluded = list.findIndex((s) => !s.moments.includes('hares'));
    assert.ok(firstIncluded > 0, 'expected hares songs first, then trail-complaint songs');
    for (const s of list.slice(firstIncluded)) assert.ok(!s.moments.includes('hares'));
  });
  it('fills a tile from the moments it includes', () => {
    const ids = songsForMoment('accusations', false).map((s) => s.id);
    const expected = songs.filter((s) => s.moments.some((m) => ['trail-mishap', 'etiquette-breach'].includes(m)));
    for (const s of expected) assert.ok(ids.includes(s.id), `${s.id} missing from accusations`);
  });
});
