/**
 * Moves one id up or down in the saved list. When `visible` is given (clean mode
 * hiding some saved songs), it swaps with the nearest visible neighbour so hidden
 * songs keep their place. Pure, so it is easy to test.
 */
export function moveSaved(saved: string[], id: string, direction: 1 | -1, visible?: Set<string>): string[] {
  const i = saved.indexOf(id);
  if (i < 0) return saved;
  let j = i + direction;
  while (visible && j >= 0 && j < saved.length && !visible.has(saved[j])) j += direction;
  if (j < 0 || j >= saved.length) return saved;
  const next = [...saved];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
