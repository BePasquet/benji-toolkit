import { mergeSortSet } from '../../algorithms/sorting/merge-sort/merge-sort-set';
import {
  BinaryTreeNode,
  buildBinaryTree,
  treeDelete,
  treeFind,
  treeFindFirst,
  treeFindLast,
  treeFindNext,
  treeFindPrevious,
  treeSetInsert,
  treeSuccessor,
} from '../../trees/binary-tree-node';
import { SetElement } from '../interfaces/set-element.interface';
import { Set } from '../interfaces/set.interface';

export class BinarySearchTreeSet<T extends SetElement> implements Set<T> {
  private size = 0;

  constructor(private root: BinaryTreeNode<T> | null = null) {}

  build(elements: Iterable<T>): void {
    const xs = Array.from(elements);
    mergeSortSet(xs);
    const node = buildBinaryTree(xs);
    this.root = node;
    this.size = xs.length;
  }

  findMin(): T | null {
    if (!this.root) {
      return null;
    }

    const node = treeFindFirst(this.root);

    return node?.value ?? null;
  }

  findMax(): T | null {
    if (!this.root) {
      return null;
    }

    const node = treeFindLast(this.root);

    return node?.value ?? null;
  }

  find(key: number): T | null {
    if (!this.root) {
      return null;
    }

    const node = treeFind(this.root, key);

    return node?.value ?? null;
  }

  findPrev(key: number): T | null {
    const node = treeFindPrevious(this.root, key);
    return node?.value ?? null;
  }

  findNext(key: number): T | null {
    const node = treeFindNext(this.root, key);
    return node?.value ?? null;
  }

  insert(element: T): void {
    treeSetInsert(this.root, element);
    this.size++;
  }

  delete(key: number): T | null {
    if (!this.root) {
      return null;
    }

    const node = treeFind(this.root, key);

    if (!node) {
      return null;
    }

    treeDelete(node);

    this.size--;

    return node?.value ?? null;
  }

  [Symbol.iterator](): Iterator<T> {
    let node: BinaryTreeNode<T> | null = null;
    let done = false;

    return {
      next: () => {
        if (!this.root || done) {
          return {
            value: null,
            done: true,
          };
        }

        node = !node ? treeFindFirst(this.root) : treeSuccessor(node);

        if (!node) {
          done = true;
        }

        const value = (node?.value ?? null) as unknown as T;

        return { value, done };
      },
    };
  }

  get length() {
    return this.size;
  }
}
