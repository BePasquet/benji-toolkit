export function insertionSort(xs: number[]): void {
  for (let i = 1; i < xs.length; i++) {
    let j = i;

    // j > 0 because when j = 1, j - 1 = 0 is checked
    while (j > 0 && xs[j] < xs[j - 1]) {
      const temp = xs[j];
      xs[j] = xs[j - 1];
      xs[j - 1] = temp;
      j--;
    }
  }
}
