import { Sequence } from '../interfaces/sequence.interface';
import { LinkedListNode } from './linked-list-node';

export interface FindNodeResult<T> {
  prev: LinkedListNode<T> | null;
  node: LinkedListNode<T> | null;
}

export class LinkedList<T> implements Sequence<T> {
  head: LinkedListNode<T> | null = null;

  private size = 0;

  getAt(index: number): T | null {
    if (!this.isIndexInRange(index)) {
      return null;
    }

    const { node } = this.findNode(index);

    return node?.value ?? null;
  }

  setAt(index: number, element: T): void {
    if (!this.isIndexInRange(index)) {
      return;
    }

    const { node } = this.findNode(index);

    if (node) {
      node.value = element;
    }
  }

  insertAt(index: number, element: T): void {
    if (!this.isIndexInRange(index)) {
      return;
    }

    this.insert(index, element);
  }

  deleteAt(index: number): T | null {
    if (!this.isIndexInRange(index)) {
      return null;
    }

    return this.delete(index);
  }

  insertFirst(element: T): void {
    this.insertAt(0, element);
  }

  deleteFirst(): T | null {
    return this.delete(0);
  }

  insertLast(element: T): void {
    this.insert(this.size, element);
  }

  deleteLast(): T | null {
    return this.delete(this.size - 1);
  }

  build(elements: Iterable<T>): void {
    this.head = null;
    let current: LinkedListNode<T> | null = this.head;

    for (const element of elements) {
      const node = new LinkedListNode(element);

      if (!current) {
        this.head = node;
        current = this.head;
      } else {
        current.next = node;
        current = current.next;
      }

      this.size++;
    }
  }

  get length(): number {
    return this.size;
  }

  [Symbol.iterator](): Iterator<T | null> {
    let current: LinkedListNode<T> | null = this.head;

    return {
      next: () => {
        const result = {
          value: current?.value ?? null,
          done: !!current,
        };

        current = current?.next ?? null;

        return result;
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
    return index >= 0 && index < this.size;
  }

  private findNode(index: number): FindNodeResult<T> {
    let prev = null;
    let node = this.head;

    for (let i = 0; i < index; i++) {
      prev = node;
      node = node?.next ?? null;
    }

    return { prev, node };
  }

  private insert(index: number, element: T): void {
    const newNode = new LinkedListNode(element);

    this.size++;

    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }

    const { prev, node } = this.findNode(index);

    newNode.next = node;

    if (prev) {
      prev.next = newNode;
    }
  }

  private delete(index: number): T | null {
    this.size--;

    if (index === 0) {
      const node = this.head;
      this.head = this.head?.next ?? null;
      return node?.value ?? null;
    }

    const { prev, node } = this.findNode(index);

    const value = node?.value ?? null;

    if (prev) {
      prev.next = node?.next ?? null;
    }

    return value;
  }
}
