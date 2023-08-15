import { SetElement } from '../../../set';

export function countingSort(xs: SetElement[]): void {
  const da: SetElement[][] = [];

  for (const element of xs) {
    if (da[element.key]) {
      da[element.key].push(element);
    } else {
      da[element.key] = [element];
    }
  }

  let i = 0;

  for (const list of da) {
    if (list) {
      for (const element of list) {
        xs[i] = element;
        i++;
      }
    }
  }
}
