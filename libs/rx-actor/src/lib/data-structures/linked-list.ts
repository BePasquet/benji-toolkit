function addNodeToLinkedList<T>(node: LinkedListNode<T>, data: T): void {
  if (!node.next) {
    node.next = new LinkedListNode(data);
    return;
  }

  addNodeToLinkedList(node.next, data);
}

function removeNodeFromLinkedList<T>(node: LinkedListNode<T>, data: T): void {
  if (!node.next) {
    return;
  }

  if (node.next.data === data) {
    node.next = node.next.next;
    return;
  }

  removeNodeFromLinkedList(node.next, data);
}

export class LinkedListNode<T> {
  next: LinkedListNode<T> | null = null;
  constructor(public data: T) {}
}

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;

  insert(data: T): void {
    if (!this.head) {
      this.head = new LinkedListNode(data);
      return;
    }

    addNodeToLinkedList(this.head, data);
  }

  remove(data: T): void {
    if (!this.head) {
      return;
    }

    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }

    removeNodeFromLinkedList(this.head, data);
  }
}
