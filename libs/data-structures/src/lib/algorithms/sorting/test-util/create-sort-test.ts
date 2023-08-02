import { Sort } from '../types/sort.type';

export function runSortTest(sort: Sort) {
  describe(sort.name, () => {
    it('Should sort an even number of elements array in ascending order', () => {
      const arr = [4, 3, 2, 1];
      sort(arr);
      expect(arr).toEqual([1, 2, 3, 4]);
    });

    it('Should sort an odd number of elements array in ascending order', () => {
      const arr = [4, 3, 2, 1, 5];
      sort(arr);
      expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it('Should not fail with a single element array', () => {
      const arr = [10];
      sort(arr);
      expect(arr).toEqual([10]);
    });

    it('Should not fail with a a sorted array', () => {
      const arr = [2, 3, 4, 5, 10];
      sort(arr);
      expect(arr).toEqual(arr);
    });

    it('Should not fail when argument is an empty array', () => {
      const arr: number[] = [];
      sort(arr);
      expect(arr).toEqual([]);
    });
  });
}
