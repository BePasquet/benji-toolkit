import { SetElement } from '../../../set';

export interface MergeSetParams<T extends SetElement> {
  xs: SetElement<T>[];
  start: number;
  mid: number;
  end: number;
}

export function mergeSet<T extends SetElement>({
  xs,
  start,
  mid,
  end,
}: MergeSetParams<T>): void {
  const xsLeft = xs.slice(start, mid + 1);
  const xsRight = xs.slice(mid + 1, end + 1);

  let k = start;
  let i = 0;
  let j = 0;

  while (i < xsLeft.length && j < xsRight.length) {
    if (xsLeft[i].key < xsRight[j].key) {
      xs[k] = xsLeft[i];
      i++;
    } else {
      xs[k] = xsRight[j];
      j++;
    }
    k++;
  }

  while (i < xsLeft.length) {
    xs[k] = xsLeft[i];
    i++;
    k++;
  }

  while (j < xsRight.length) {
    xs[k] = xsRight[j];
    j++;
    k++;
  }
}

export type MergeSorSettParams<T extends SetElement> = Omit<
  MergeSetParams<T>,
  'mid'
>;

export function mergeSortSetP<T extends SetElement>({
  xs,
  start,
  end,
}: MergeSorSettParams<T>): void {
  if (start >= end) {
    return;
  }

  const mid = Math.floor((start + end) / 2);

  mergeSortSetP({ xs, start, end: mid });
  mergeSortSetP({ xs, start: mid + 1, end });

  mergeSet({ xs, start, end, mid });
}

export function mergeSortSet<T extends SetElement>(xs: SetElement<T>[]): void {
  return mergeSortSetP({ xs, start: 0, end: xs.length - 1 });
}
