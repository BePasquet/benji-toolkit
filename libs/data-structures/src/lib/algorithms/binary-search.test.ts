import { LinkedList } from '../sequence/linked-list/linked-list';
import { SetElement } from '../set/interfaces/set-element.interface';
import { binarySearch } from './binary-search';

describe('Binary Search', () => {
  it('Should find element with corresponding key when existent', () => {
    const sequence = new LinkedList<SetElement>();
    const iterable = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }];
    sequence.build(iterable);
    const key = 3;
    const expected = iterable.findIndex(({ key }) => key === 3);

    const result = binarySearch({
      set: sequence,
      key,
      start: 0,
      end: sequence.length - 1,
    });

    expect(expected).toBe(result);
  });

  it('Should not find element with corresponding key when not existent', () => {
    const sequence = new LinkedList<SetElement>();
    const iterable = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }];
    sequence.build(iterable);
    const key = 5;

    const result = binarySearch({
      set: sequence,
      key,
      start: 0,
      end: sequence.length - 1,
    });

    // next index
    const expected = 4;

    expect(expected).toBe(result);
  });

  it('Should not find element with corresponding key when not existent', () => {
    const sequence = new LinkedList<SetElement>();
    const iterable = [{ key: 4 }, { key: 5 }, { key: 6 }, { key: 7 }];
    sequence.build(iterable);
    const key = 2;

    const result = binarySearch({
      set: sequence,
      key,
      start: 0,
      end: sequence.length - 1,
    });

    // next index
    const expected = 0;

    expect(expected).toBe(result);
  });

  it('Should not find element with corresponding key when not existent', () => {
    const sequence = new LinkedList<SetElement>();
    const iterable = [{ key: 4 }, { key: 5 }, { key: 7 }, { key: 8 }];
    sequence.build(iterable);
    const key = 6;

    const result = binarySearch({
      set: sequence,
      key,
      start: 0,
      end: sequence.length - 1,
    });

    // next index
    const expected = 2;

    expect(expected).toBe(result);
  });

  it('Should not find element with corresponding key when not existent', () => {
    const sequence = new LinkedList<SetElement>();
    const iterable = [{ key: 4 }, { key: 6 }, { key: 7 }, { key: 8 }];
    sequence.build(iterable);
    const key = 5;

    const result = binarySearch({
      set: sequence,
      key,
      start: 0,
      end: sequence.length - 1,
    });

    // next index
    const expected = 1;

    expect(expected).toBe(result);
  });
});
