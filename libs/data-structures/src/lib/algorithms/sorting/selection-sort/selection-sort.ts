export function selectionSort(xs: number[]): void {
  for (let i = xs.length - 1; i >= 0; i--) {
    let biggest = i;

    for (let j = 0; j < i; j++) {
      if (xs[j] > xs[biggest]) {
        biggest = j;
      }
    }

    const temp = xs[i];
    xs[i] = xs[biggest];
    xs[biggest] = temp;
  }
}
