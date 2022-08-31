import { UnaryFunction } from 'rxjs';

export function prop<T extends Record<K, T[K]>, K extends keyof T = keyof T>(
  key: K
): UnaryFunction<T, T[K]> {
  return (obj: T) => obj[key];
}
