import { Sequence } from './sequence.interface';

export class ArraySequence implements Sequence<number> {
  private data = new Int8Array(0);

  /**
   * Internal representation of the number of elements stored,
   * for public access use length
   */
  private size = 0;

  build(elements: Iterable<number>): void {
    let iterableSize = 0;

    for (const _ of elements) {
      iterableSize++;
    }

    if (this.data.length !== iterableSize) {
      this.data = new Int8Array(iterableSize);
    }

    const iterator = elements[Symbol.iterator]();

    let i = 0;
    let current = iterator.next();

    while (i < iterableSize || !current.done) {
      this.data[i] = current.value;
      current = iterator.next();
      i++;
    }

    this.size = iterableSize;
  }

  getAt(index: number): number | null {
    if (this.isIndexInRange(index)) {
      return null;
    }

    return this.data[index];
  }

  setAt(index: number, value: number): void {
    if (this.isIndexInRange(index)) {
      return;
    }

    this.data[index] = value;
  }

  insertAt(index: number, element: number): void {
    if (this.isIndexInRange(index)) {
      return;
    }

    this.size++;
    const newData = new Int8Array(this.size);

    for (let i = 0; i < index; i++) {
      newData[i] = this.data[i];
    }

    const temp = this.data[index];
    newData[index] = element;
    newData[index + 1] = temp;

    for (let i = index + 1; i < this.size; i++) {
      newData[i + 1] = this.data[i];
    }

    this.data = newData;
  }

  deleteAt(index: number): number | null {
    if (this.isIndexInRange(index)) {
      return null;
    }

    this.size--;
    const newData = new Int8Array(this.size);

    for (let i = 0; i < index; i++) {
      newData[i] = this.data[i];
    }

    const element = this.data[index];

    for (let i = index; i < this.size; i++) {
      newData[i] = this.data[i + 1];
    }

    this.data = newData;

    return element;
  }

  deleteFirst(): number | null {
    return this.deleteAt(0);
  }

  deleteLast(): number | null {
    return this.deleteAt(this.size - 1);
  }

  insertFirst(element: number): void {
    this.insertAt(0, element);
  }

  insertLast(element: number): void {
    this.size++;
    const newData = new Int8Array(this.size);
    newData[this.size - 1] = element;
    for (let i = 0; i < this.size - 1; i++) {
      newData[i] = this.data[i];
    }

    this.data = newData;
  }

  get length(): number {
    return this.size;
  }

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

  private isIndexInRange(index: number): boolean {
    return index >= this.size || index < 0;
  }
}
