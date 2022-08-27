export class LinkedListNode<T> {
  next: LinkedListNode<T> | null = null;
  constructor(public data: T) {}
}
