/**
 * RA mode helpers. Pure functions over the cheat sheet, so they are easy to test.
 */
import { type Circle, raSteps, type RaStep } from '@/content/ra-script';
import { getSong, isVisible } from '@/content/songbook';
import type { Song } from '@/content/types';

/** Favourite song per RA step, keyed by step id. */
export type RaFaves = Record<string, string>;

export const stepsFor = (circle: Circle, all: RaStep[] = raSteps): RaStep[] => all.filter((s) => s.circle === circle);

export const getStep = (id: string, all: RaStep[] = raSteps): RaStep | undefined => all.find((s) => s.id === id);

/** Where a step sits inside its own circle: 0-based index, total, and its neighbours. */
export function stepPosition(id: string, all: RaStep[] = raSteps) {
  const step = getStep(id, all);
  if (!step) return null;
  const list = stepsFor(step.circle, all);
  const index = list.indexOf(step);
  return {
    step,
    index,
    total: list.length,
    prev: index > 0 ? list[index - 1] : undefined,
    next: index < list.length - 1 ? list[index + 1] : undefined,
  };
}

/**
 * The favourite song for a step, if one is set, still in the songbook and not hidden
 * by clean mode. A hidden fave is kept, not erased, so it comes back when clean mode goes off.
 */
export function faveFor(step: RaStep, faves: RaFaves, cleanMode: boolean): Song | undefined {
  if (!step.moment) return undefined;
  const id = faves[step.id];
  const song = id ? getSong(id) : undefined;
  return song && isVisible(song, cleanMode) ? song : undefined;
}

export function setFave(faves: RaFaves, stepId: string, songId: string): RaFaves {
  return { ...faves, [stepId]: songId };
}
