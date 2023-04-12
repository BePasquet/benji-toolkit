import { createLSR, median } from './math';

const oddXs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const evenXs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('median', () => {
  it('Should return the correct median in odd set of sorted numbers', () => {
    const result = median(oddXs);
    const expected = 5;

    expect(result).toBe(expected);
  });

  it('Should return the correct median in odd set of unsorted numbers', () => {
    const xs = [...oddXs].sort((a, b) => b - a);
    const result = median(xs);
    const expected = 5;

    expect(result).toBe(expected);
  });

  it('Should return the correct median in even set of sorted numbers', () => {
    const result = median(evenXs);
    const expected = 5.5;

    expect(result).toBe(expected);
  });

  it('Should return the correct median in even set of unsorted numbers', () => {
    const xs = evenXs.sort((a, b) => b - a);

    const result = median(xs);
    const expected = 5.5;

    expect(result).toBe(expected);
  });

  it('Should return the correct median in even set of sorted numbers with same median in both indexes', () => {
    const xs = [1, 2, 3, 3, 5, 6];
    const result = median(xs);
    const expected = 3;

    expect(result).toBe(expected);
  });

  it('Should return 0 when array is empty', () => {
    const xs: number[] = [];

    const result = median(xs);
    const expected = 0;

    expect(result).toBe(expected);
  });
});

describe('createLSR', () => {
  it('Should create a function that can predict base on a linear model base on least squared regression function', () => {
    const set: [number, number][] = [
      [1, 1],
      [2, 2],
      [2, 3],
      [3, 6],
    ];

    const lsr = createLSR(set);

    const prediction = lsr(4);

    const expected = 7.999999999999999;

    expect(prediction).toBe(expected);
  });
});
