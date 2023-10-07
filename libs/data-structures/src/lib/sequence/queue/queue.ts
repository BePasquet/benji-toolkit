import { LinkedListNode } from '../linked-list/linked-list-node';

export class Queue<T> {
  private head: LinkedListNode<T> | null = null;

  private tail: LinkedListNode<T> | null = null;

  private size = 0;

  enqueue(value: T): void {
    this.size++;

    if (!this.head) {
      this.head = new LinkedListNode(value);
      this.tail = this.head;
      return;
    }

    const last = new LinkedListNode(value);

    if (this.tail) {
      this.tail.next = last;
      this.tail = last;
    }
  }

  dequeue(): T | null {
    if (!this.head) {
      return null;
    }

    const { value } = this.head;
    this.head = this.head.next;

    this.size--;

    if (!this.head) {
      this.tail = null;
    }

    return value;
  }

  get length(): number {
    return this.size;
  }
}
