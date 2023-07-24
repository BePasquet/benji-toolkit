import { Sequence } from '../interfaces/sequence.interface';
import { StaticArray } from '../static-array/static-array';

/**
 * Dynamic array implementation of a sequence
 */
export class DynamicArray extends StaticArray implements Sequence<number> {
  /**
   * Ratio to resize the array by
   */
  private readonly ratio = 2;

  /**
   * The limit at which the array needs to grow
   */
  private upperBound = this.ratio;

  /**
   * The limit at which the array needs to shrink
   */
  private lowerBound = 0;

  protected override data = new Int8Array(this.ratio);

  override build(elements: Iterable<number>): void {
    if (this.size > 0) {
      this.data = new Int8Array(this.ratio);
      this.upperBound = this.ratio;
      this.lowerBound = 0;
      this.size = 0;
    }

    const iterator = elements[Symbol.iterator]();

    let size = 0;
    let current = iterator.next();

    while (!current.done) {
      current = iterator.next();
      size++;
    }

    const data = this.resize(size);

    if (data) {
      this.data = data;
    }

    for (const element of elements) {
      this.data[this.size] = element;
      this.size++;
    }
  }

  /**
   * Inserts an element at the end of the sequence,
   * Time Complexity O(1) amortized
   * @param element we want to insert
   */
  override insertLast(element: number): void {
    this.size++;

    const data = this.resize(this.size);

    if (data) {
      this.data = data;
    }

    this.data[this.size - 1] = element;
  }

  /**
   * Removes the last element of the the sequence,
   * Time Complexity O(1) amortized
   * @returns last element when exist null otherwise
   */
  override deleteLast(): number | null {
    if (this.size <= 0) {
      return null;
    }

    const value = this.data[this.size - 1];
    this.size--;

    const data = this.resize(this.size);

    if (data) {
      this.data = data;
    }

    return value;
  }

  /**
   * Checks whether an index is within upper and lower bounds
   * @param index we want to check
   */
  private isWithinBounds(index: number): boolean {
    return index >= this.lowerBound && index <= this.upperBound;
  }

  /**
   * Resizes the array when required
   * @param index of last element
   * @returns the new array with the current array elements copied when the
   * index is not within bounds
   */
  private resize(index: number): void | Int8Array {
    if (this.isWithinBounds(index)) {
      return;
    }

    if (index < this.lowerBound) {
      const size = Math.max(this.ratio, this.lowerBound * this.ratio);
      const data = new Int8Array(size);

      for (let i = 0; i < index; i++) {
        data[i] = this.data[i];
      }

      this.upperBound = size;
      this.lowerBound = Math.floor(size / (this.ratio * this.ratio));

      return data;
    }

    if (index > this.upperBound) {
      const size = Math.max(this.upperBound * this.ratio, this.ratio);
      const data = new Int8Array(size);

      for (let i = 0; i < index; i++) {
        data[i] = this.data[i];
      }

      this.upperBound = size;
      this.lowerBound = Math.floor(size / (this.ratio * this.ratio));
      return data;
    }
  }
}
