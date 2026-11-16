/**
 * Circle mode moves a verse at a time. `stops` are the scroll offsets where each
 * section starts; this picks the next (or previous) one from the current offset.
 */
export function nextStop(stops: number[], current: number, direction: 1 | -1, slack = 8): number {
  const sorted = [...stops].sort((a, b) => a - b);
  if (direction === 1) {
    const next = sorted.find((y) => y > current + slack);
    return next ?? current;
  }
  const prev = [...sorted].reverse().find((y) => y < current - slack);
  return Math.max(0, prev ?? 0);
}

/** Lyric sizes the Aa control steps through. 1 is the style bible size; the system text size multiplies on top. */
export const LYRIC_SCALES = [0.85, 1, 1.15, 1.3, 1.5, 1.75] as const;

/** Step to the next smaller or larger lyric size, snapping old saved values to the nearest step. */
export function stepScale(current: number, direction: 1 | -1): number {
  let i = 0;
  LYRIC_SCALES.forEach((s, idx) => {
    if (Math.abs(s - current) < Math.abs(LYRIC_SCALES[i] - current)) i = idx;
  });
  return LYRIC_SCALES[Math.min(LYRIC_SCALES.length - 1, Math.max(0, i + direction))];
}
