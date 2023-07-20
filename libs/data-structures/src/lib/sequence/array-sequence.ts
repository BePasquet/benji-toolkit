import { Sequence } from './sequence.interface';

/**
 * Static array implementation of a sequence
 */
export class ArraySequence implements Sequence<number> {
  private data = new Int8Array(0);

  /**
   * Internal representation of the number of elements stored,
   * for public access use length
   */
  private size = 0;

  /**
   * @inheritdoc
   * Time complexity O(n), every time it builds the
   * sequence needs to go through all the elements and copy them
   */
  build(elements: Iterable<number>): void {
    let iterableSize = 0;

    for (const _ of elements) {
      iterableSize++;
    }

    if (this.data.length !== iterableSize) {
      this.data = new Int8Array(iterableSize);
    }

    const iterator = elements[Symbol.iterator]();

    for (let i = 0; i < iterableSize; i++) {
      this.data[i] = iterator.next().value;
    }

    this.size = iterableSize;
  }

  /**
   * @inheritdoc
   * Time Complexity O(1), When accessing an array by index this will
   * look where it is allocated in memory and multiply the word length and the index (offset)
   * to find the starting position of the element `address + w-bit * index`
   */
  getAt(index: number): number | null {
    if (this.isIndexInRange(index)) {
      return null;
    }

    return this.data[index];
  }

  /**
   * @inheritdoc
   * Time Complexity O(1), When accessing an array by index this will
   * look where it is allocated in memory and multiply the word length and the index (offset)
   * to find the starting position of the element `address + w-bit * index` to overwrite it
   */
  setAt(index: number, value: number): void {
    if (this.isIndexInRange(index)) {
      return;
    }

    this.data[index] = value;
  }
  /**
   * @inheritdoc
   * Time complexity O(n), An array allocate memory contiguously with a predetermined size,
   * to add an element we need to resize by allocating a bigger space in memory and copying elements over
   */
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

  /**
   * @inheritdoc
   * Time complexity O(n), deleting an element will result in re indexing the elements at its right
   * in memory in the worst case will delete the first element and need to shift n - 1 elements by one position
   */
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

  /**
   * @inheritdoc
   * Time complexity O(n), deleting the first element will result in re indexing the elements at its right
   * in memory, shifting n - 1 elements by one position
   */
  deleteFirst(): number | null {
    return this.deleteAt(0);
  }

  /**
   * @inheritdoc
   * Time complexity 0(n), will need to resize array and copy elements over
   */
  deleteLast(): number | null {
    return this.deleteAt(this.size - 1);
  }

  /**
   * @inheritdoc
   * Time complexity 0(n), will need to resize the array and copy elements over
   */
  insertFirst(element: number): void {
    this.insertAt(0, element);
  }

  /**
   * @inheritdoc
   * Time complexity 0(n), will need to resize array and copy elements over
   */
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

  /**
   * Checks whether the index is withing the bounds of the array
   * 0 <= index < length
   * @param index we want to check
   * @returns whether is within the array bounds
   */
  private isIndexInRange(index: number): boolean {
    return index >= this.size || index < 0;
  }
}
