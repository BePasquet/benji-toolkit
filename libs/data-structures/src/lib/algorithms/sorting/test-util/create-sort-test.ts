import { Sort } from '../types/sort.type';

export function runSortTest(sort: Sort) {
  describe(sort.name, () => {
    it('Should sort an array in ascending order', () => {
      const arr = [4, 3, 2, 1];
      sort(arr);
      expect(arr).toEqual([1, 2, 3, 4]);
    });

    it('Should not fail when argument is an empty array', () => {
      const arr: number[] = [];
      sort(arr);
      expect(arr).toEqual([]);
    });
  });
}
