import { LinkedListNode } from './linked-list';

export class Queue<T> {
  private head: LinkedListNode<T> | null = null;

  private tail: LinkedListNode<T> | null = null;

  enqueue(data: T): void {
    const node = new LinkedListNode(data);

    if (this.tail) {
      this.tail.next = node;
    }

    this.tail = node;

    if (!this.head) {
      this.head = this.tail;
    }
  }

  dequeue(): T | null {
    if (!this.head) {
      return null;
    }

    const data = this.head.data;
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

export interface PriorityQueueNode<T> {
  element: T;
  priority: number;
}

export class PriorityQueue<T> {
  private data: PriorityQueueNode<T>[] = [];

  enqueue(element: T, priority: number): void {
    const index = this.data.findIndex((element) => element.priority > priority);

    if (index === -1) {
      this.data.push({ element, priority });
      return;
    }

    this.data.splice(index, 0, { element, priority });
  }

  dequeue(): T | null {
    const node = this.data.shift();
    return node?.element ?? null;
  }

  isEmpty(): boolean {
    return !this.data.length;
  }
}
