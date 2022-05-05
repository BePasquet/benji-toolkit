import { LinkedListNode } from './linked-list';

export class Stack<T> {
  private head: LinkedListNode<T> | null = null;

  push(data: T): void {
    const node = new LinkedListNode(data);
    if (!this.head) {
      this.head = node;
      return;
    }
    node.next = this.head;
    this.head = node;
  }

  pop(): T | null {
    if (!this.head) {
      return null;
    }

    const data = this.head.data;
    this.head = this.head.next;
    return data;
  }
}
