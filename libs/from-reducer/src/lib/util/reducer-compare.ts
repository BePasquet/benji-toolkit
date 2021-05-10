export function distinctStateCompare<S>(prev: S, curr: S): boolean {
  return JSON.stringify(prev) === JSON.stringify(curr);
}
