import { SetElement } from '../set';
import { LinkedListSet } from '../set/linked-list/linked-list-set';

export class HashTable<T = unknown> {
  private prime = Math.pow(2, 31) - 1;
  private a = 1;
  private b = 10;
  private data: LinkedListSet<SetElement<T>>[] = [];
  private size = 0;

  insert(element: SetElement<T>): void {
    this.size++;
    const hash = this.hash(element.key, this.size);
    const chain = this.data[hash];

    if (chain) {
      chain.insert(element);
      return;
    }

    const newChain = new LinkedListSet<SetElement<T>>();
    newChain.insert(element);
    this.data[hash] = newChain;
  }

  find(key: SetElement['key']): SetElement<T> | null {
    const hash = this.hash(key, this.data.length);

    const element = this.data[hash]?.find(key) ?? null;
    return element;
  }

  delete(key: SetElement['key']): SetElement<T> | null {
    const hash = this.hash(key, this.data.length);
    const chain = this.data[hash];

    if (!chain?.find(key)) {
      return null;
    }

    this.size--;

    return chain.delete(key);
  }

  get length(): number {
    return this.size;
  }

  private hash(key: SetElement['key'], length: number): number {
    const hash = ((this.a * key + this.b) % this.prime) % length;
    return hash;
  }
}
