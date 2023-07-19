export interface Sequence<T> extends Iterable<T> {
  /**
   * Given an iterable builds a sequence from elements in it
   * @param elements to build sequence from
   */
  build(elements: Iterable<T>): void;

  /**
   * Number of elements stored in the sequence
   */
  length: number;

  /**
   * Get the element at the specified index in the sequence
   * @param index position of element in the sequence
   * @returns the element when exists null otherwise
   */
  get(index: number): T | null;

  /**
   * Replace element at the specified index in the sequence
   * @param index position of element in the sequence to replace
   * @param element to replace at the specified index
   */
  setAt(index: number, element: T): void;

  /**
   * Adds an element at the specified index, elements starting from
   * the index will be shifted one position
   * @param index position where we want to insert the element
   * @param element to insert at index
   */
  insertAt(index: number, element: number): void;

  /**
   * Removes element at the specified index
   * @param index position of the element in the sequence
   * @returns element at the specified index null otherwise
   */
  deleteAt(index: number): T | null;

  /**
   * Adds element at the beginning of the sequence
   * @param element we want to insert
   */
  insertFirst(element: T): void;

  /**
   * Removes first element in the sequence
   * @returns element when exist null otherwise
   */
  deleteFirst(): T | null;

  /**
   * Inserts an element at the end of the sequence
   * @param element we want to insert
   */
  insertLast(element: T): void;

  /**
   * Removes the last element of the the sequence
   * @returns last element when exist null otherwise
   */
  deleteLast(): T | null;
}
