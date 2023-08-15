import { SetElement } from '../../../set';
import { countingSort } from '../counting-sort/counting-sort';

export function radixSort(xs: SetElement[]): void {
  const keys = xs.map(({ key }) => key);
  const n = xs.length;
  //  there is no log of 1
  if (n === 1) {
    return;
  }

  const u = Math.max(...keys);
  // log_n u, why + 1 is it because we need the last high?
  const digits = Math.floor(Math.log(u) / Math.log(n)) + 1;

  const da = xs.map((element) => ({
    key: 0,
    element,
    digits: Array(digits)
      .fill(null)
      .map((_, i) => {
        const divisor = Math.pow(n, i + 1);
        // how to handle high why this doesn't go?
        // const high = Math.floor(element.key / divisor);
        const low = element.key % divisor;
        return low;
      }),
  }));

  // O(cn) where c is the number of digits
  for (let i = 0; i < digits; i++) {
    for (const el of da) {
      el.key = el.digits[i];
    }

    countingSort(da);
  }

  for (let i = 0; i < xs.length; i++) {
    xs[i] = da[i].element;
  }
}
