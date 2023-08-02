export interface MergeParams {
  xs: number[];
  start: number;
  mid: number;
  end: number;
}

export function merge({ xs, start, mid, end }: MergeParams): void {
  const xsLeft = xs.slice(start, mid + 1);
  const xsRight = xs.slice(mid + 1, end + 1);

  let k = start;
  let i = 0;
  let j = 0;

  while (i < xsLeft.length && j < xsRight.length) {
    if (xsLeft[i] < xsRight[j]) {
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

export interface MergeSortParams {
  xs: number[];
  start: number;
  end: number;
}

export function mergeSortR({ xs, start, end }: MergeSortParams): void {
  if (start >= end) {
    return;
  }

  const mid = Math.floor((start + end) / 2);

  mergeSortR({ xs, start, end: mid });
  mergeSortR({ xs, start: mid + 1, end });

  merge({ xs, start, end, mid });
}

export function mergeSort(xs: number[]): void {
  return mergeSortR({ xs, start: 0, end: xs.length - 1 });
}
