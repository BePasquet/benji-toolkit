import { LinkedListNode } from './linked-list-node.model';

export function insertLinkedListNode<T>(
  node: LinkedListNode<T>,
  data: T
): void {
  if (!node.next) {
    node.next = new LinkedListNode(data);
    return;
  }

  return insertLinkedListNode(node.next, data);
}

export class LinkedList<T = unknown> {
  private root: LinkedListNode<T> | null = null;

  add(data: T): void {
    if (!this.root) {
      this.root = new LinkedListNode(data);
      return;
    }

    insertLinkedListNode(this.root, data);
  }
}
