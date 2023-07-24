import { LinkedList, LinkedListNode, Sequence } from '../../sequence';
import { SetElement } from '../interfaces/set-element.interface';
import { Set } from '../interfaces/set.interface';

export class LinkedListSet<T extends SetElement>
  extends LinkedList<T>
  implements Sequence<T>, Set<T>
{
  find(key: number | string): T | null {
    for (const element of this) {
      if (element.key === key) {
        return element;
      }
    }

    return null;
  }

  findMin(): T | null {
    let min: T | null = null;

    for (const element of this) {
      if (!min || element.key < min.key) {
        min = element;
      }
    }

    return min;
  }

  findMax(): T | null {
    let max: T | null = null;

    for (const element of this) {
      if (!max || element.key > max.key) {
        max = element;
      }
    }

    return max;
  }

  findPrev(key: number): T | null {
    let prev = null;

    for (const element of this) {
      if (element.key === key) {
        return prev ?? element;
      }

      prev = element;
    }

    return null;
  }

  findNext(key: number): T | null {
    let current = this.head;

    while (current) {
      if (current.value.key === key) {
        return current.next?.value ?? null;
      }

      current = current.next;
    }

    return null;
  }

  insert(element: T): void {
    if (!this.head) {
      return;
    }

    let prev: LinkedListNode<T> | null = null;
    let current: LinkedListNode<T> | null = this.head;

    while (current) {
      if (current.value.key === element.key) {
        current.value = element;
        return;
      }

      prev = current;
      current = current.next;
    }

    if (prev) {
      prev.next = new LinkedListNode<T>(element);
    }
  }

  delete(key: string | number): T | null {
    if (!this.head) {
      return null;
    }

    if (this.head.value.key === key) {
      return this.deleteFirst();
    }

    let prev: LinkedListNode<T> | null = null;
    let current: LinkedListNode<T> | null = this.head;
    let next: LinkedListNode<T> | null = this.head.next;

    while (current) {
      if (current.value.key === key && prev) {
        const value = current.value;
        current.next = null;
        prev.next = next;
        return value;
      }

      prev = current;
      current = current.next;
      next = current?.next ?? null;
    }

    return null;
  }
}
