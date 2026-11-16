import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { raSteps } from '../src/content/ra-script';
import { getMoment, getSong, songs } from '../src/content/songbook';
import { faveFor, setFave, stepPosition, stepsFor } from '../src/lib/ra';

describe('RA cheat sheet', () => {
  it('has unique step ids', () => {
    const ids = raSteps.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('links every song step to a real moment', () => {
    for (const step of raSteps) {
      if (step.moment) assert.ok(getMoment(step.moment), `${step.id} -> ${step.moment}`);
    }
  });

  it('keeps songs to the ending circle, in DeMon order', () => {
    assert.ok(stepsFor('start').every((s) => !s.moment));
    assert.deepEqual(
      stepsFor('end').map((s) => s.title),
      ['Hares', 'Virgins', 'Visitors', 'FRB', 'Accusations', 'Hashy birthdays', 'Backsliders', 'Announcements', 'May the hash go in peace'],
    );
  });
});

describe('stepPosition', () => {
  it('counts within the step’s own circle', () => {
    const pos = stepPosition('end-virgins');
    assert.equal(pos?.index, 1);
    assert.equal(pos?.total, stepsFor('end').length);
    assert.equal(pos?.prev?.id, 'end-hares');
    assert.equal(pos?.next?.id, 'end-visitors');
  });

  it('has no neighbours past the ends', () => {
    assert.equal(stepPosition('start-greeting')?.prev, undefined);
    assert.equal(stepPosition('end-peace')?.next, undefined);
    assert.equal(stepPosition('nope'), null);
  });
});

describe('faveFor', () => {
  const virgins = raSteps.find((s) => s.id === 'end-virgins')!;
  const announcements = raSteps.find((s) => s.id === 'end-announcements')!;
  const clean = songs.find((s) => s.rating !== 'explicit')!;
  const explicit = songs.find((s) => s.rating === 'explicit')!;

  it('returns the saved song', () => {
    assert.equal(faveFor(virgins, setFave({}, virgins.id, clean.id), true)?.id, clean.id);
  });

  it('hides an explicit fave in clean mode without forgetting it', () => {
    const faves = setFave({}, virgins.id, explicit.id);
    assert.equal(faveFor(virgins, faves, true), undefined);
    assert.equal(faveFor(virgins, faves, false)?.id, explicit.id);
  });

  it('ignores unknown songs and steps without a song', () => {
    assert.equal(faveFor(virgins, { [virgins.id]: 'not-a-song' }, false), undefined);
    assert.equal(faveFor(announcements, { [announcements.id]: clean.id }, false), undefined);
    assert.ok(getSong(clean.id));
  });
});
