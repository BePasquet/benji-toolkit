import { Sequence } from '../interfaces/sequence.interface';
import { StaticArray } from '../static-array/static-array';

export class DynamicArray extends StaticArray implements Sequence<number> {
  private readonly buffer = 2;

  private upperBound = this.buffer;

  private lowerBound = 0;

  protected override data = new Int8Array(this.buffer);

  override build(elements: Iterable<number>): void {
    if (this.size > 0) {
      this.data = new Int8Array(this.buffer);
      this.upperBound = this.buffer;
      this.lowerBound = 0;
      this.size = 0;
    }

    for (const element of elements) {
      this.insertLast(element);
    }
  }

  override insertLast(element: number): void {
    this.size++;

    const data = this.resize(this.size);

    if (data) {
      this.data = data;
    }

    this.data[this.size - 1] = element;
  }

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

  private isWithinBounds(index: number): boolean {
    return index >= this.lowerBound && index <= this.upperBound;
  }

  private resize(lastIndex: number): void | Int8Array {
    if (this.isWithinBounds(lastIndex)) {
      return;
    }

    if (lastIndex < this.lowerBound) {
      const size = Math.max(this.buffer, this.lowerBound * this.buffer);
      const data = new Int8Array(size);

      for (let i = 0; i < lastIndex; i++) {
        data[i] = this.data[i];
      }

      this.upperBound = size;
      this.lowerBound = Math.floor(size / (this.buffer * this.buffer));

      return data;
    }

    if (lastIndex > this.upperBound) {
      const size = Math.max(this.upperBound * this.buffer, this.buffer);
      const data = new Int8Array(size);

      for (let i = 0; i < lastIndex; i++) {
        data[i] = this.data[i];
      }

      this.upperBound = size;
      this.lowerBound = Math.floor(size / (this.buffer * this.buffer));
      return data;
    }
  }
}
