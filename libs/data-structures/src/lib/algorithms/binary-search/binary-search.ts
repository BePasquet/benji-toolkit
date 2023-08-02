import { Sequence } from '../../sequence';
import { SetElement } from '../../set';

export interface BinarySearchParams<T> {
  set: Sequence<SetElement<T>>;
  key: number;
  start: number;
  end: number;
}

export function binarySearch<T>({
  set,
  key,
  start,
  end,
}: BinarySearchParams<T>): number {
  if (start > end) {
    return start;
  }

  const mid = Math.floor((start + end) / 2);
  const element = set.getAt(mid);

  if (!element) {
    return -1;
  }

  if (key > element.key) {
    return binarySearch({ set, key, start: mid + 1, end });
  }

  if (key < element.key) {
    return binarySearch({ set, key, start, end: mid - 1 });
  }

  return mid;
}
