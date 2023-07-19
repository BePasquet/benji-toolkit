import { Sequence } from './sequence.interface';

export class ArraySequence implements Sequence<number> {
  private data = new Int8Array(0);

  private size = 0;

  build(xs: Iterable<number>): void {
    let iterableSize = 0;

    for (const _ of xs) {
      iterableSize++;
    }

    if (this.data.length !== iterableSize) {
      this.data = new Int8Array(iterableSize);
    }

    const iterator = xs[Symbol.iterator]();

    let i = 0;
    let current = iterator.next();

    while (i < iterableSize || !current.done) {
      this.data[i] = current.value;
      current = iterator.next();
      i++;
    }

    this.size = iterableSize;
  }

  get(i: number): number {
    if (i >= this.size || i < 0) {
      throw new RangeError(
        `Specified index: ${i} is not within range 0 >= i < ${this.size}`
      );
    }

    return this.data[i];
  }

  setAt(i: number, value: number): void {
    if (i >= this.size || i < 0) {
      throw new RangeError(
        `Specified index: ${i} is not within range 0 >= i < ${this.size}`
      );
    }

    this.data[i] = value;
  }

  get length(): number {
    return this.size;
  }

  insertAt(index: number, element: number): void {}

  deleteAt(index: number): number | null {
    return null;
  }

  deleteFirst(): number | null {
    return null;
  }

  deleteLast(): number | null {
    return null;
  }

  insertFirst(element: number): void {}

  insertLast(element: number): void {}

  [Symbol.iterator](): Iterator<number> {
    let index = 0;
    return {
      next: () => {
        const isInRange = index < this.size;

        if (isInRange) {
          const result = {
            value: this.data[index],
            done: false,
          };

          index++;
          return result;
        }

        return { value: null, done: true };
      },
    };
  }
}
