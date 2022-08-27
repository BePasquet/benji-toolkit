import { LinkedListNode } from './linked-list-node.model';

export class Queue<T = unknown> {
  private head: LinkedListNode<T> | null = null;

  private tail: LinkedListNode<T> | null = null;

  enqueue(data: T): void {
    const node = new LinkedListNode(data);

    if (!this.tail) {
      this.tail = node;
      this.head = this.tail;
      return;
    }

    this.tail.next = node;
    this.tail = node;
  }

  dequeue(): T | null {
    if (!this.head) {
      return null;
    }

    const { data } = this.head;

    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    return data;
  }

  peek(): T | null {
    return this.head?.data ?? null;
  }

  isEmpty(): boolean {
    return !this.head;
  }
}
