export interface Set<T> extends Iterable<T> {
  /**
   * Given an iterable builds a set from elements in it
   * @param elements to build sequence from
   */
  build(elements: Iterable<T>): void;

  /**
   * Number of elements stored in the set
   */
  length: number;

  /**
   * Finds element with specified key
   * @param key of the element we want to find
   * @returns element when there is a match null otherwise
   */
  find(key: number): T | null;

  /**
   * Adds element to set, if an element with the same key exist will replace it
   * @param element to insert
   */
  insert(element: T): void;

  /**
   * Removes element with specified key
   * @param key of the element we want to delete
   * @returns deleted element with specified key exist null otherwise
   */
  delete(key: number): T | null;

  /**
   * Finds the element with the smallest key
   * @returns element when there are elements on the set null otherwise
   */
  findMin(): T | null;

  /**
   * Finds the element with the biggest key
   * @returns element when there are elements on the set null otherwise
   */
  findMax(): T | null;

  /**
   * Finds the element that is before the specified key
   * @param key of element to find previous
   * @returns element when exist null otherwise
   */
  findPrev(key: number): T | null;

  /**
   * Finds the element that is after the specified key
   * @param key of element to find previous
   * @returns element when exist null otherwise
   */
  findNext(key: number): T | null;
}
