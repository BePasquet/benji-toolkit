import { SetElement } from '../../../set';

export function runSortElementTest(sort: (xs: SetElement[]) => void) {
  describe(sort.name, () => {
    it('Should sort an even number of elements array in ascending order', () => {
      const arr = [{ key: 1000 }, { key: 2000 }, { key: 3000 }, { key: 5000 }];
      sort(arr);
      expect(arr).toEqual([
        { key: 1000 },
        { key: 2000 },
        { key: 3000 },
        { key: 5000 },
      ]);
    });

    it('Should sort an odd number of elements array in ascending order', () => {
      const arr = [{ key: 4 }, { key: 3 }, { key: 2 }, { key: 1 }, { key: 5 }];
      sort(arr);
      expect(arr).toEqual([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
      ]);
    });

    it('Should not fail with a single element array', () => {
      const arr = [{ key: 10 }];
      sort(arr);
      expect(arr).toEqual([{ key: 10 }]);
    });

    it('Should not fail with a a sorted array', () => {
      const arr = [
        {
          key: 2,
        },
        {
          key: 3,
        },
        {
          key: 4,
        },
        {
          key: 5,
        },
        {
          key: 10,
        },
      ];

      sort(arr);
      expect(arr).toEqual(arr);
    });

    it('Should not fail when argument is an empty array', () => {
      const arr: SetElement[] = [];
      sort(arr);
      expect(arr).toEqual([]);
    });
  });
}
