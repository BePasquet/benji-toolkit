export class LinkedListNode<T> {
  constructor(
    /**
     * node value
     */
    public value: T,
    /**
     * Reference to the next element in the list
     */
    public next: LinkedListNode<T> | null = null
  ) {}
}
