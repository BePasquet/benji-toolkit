import { GraphNode } from './graph-node';

export class Graph<T> {
  private readonly data = new Map<string, GraphNode<T>>();

  add(node: GraphNode<T>): void {
    this.data.set(node.name, node);
  }

  addConnection(aid: string, bid: string): boolean {
    const nodeA = this.data.get(aid);

    const nodeB = this.data.get(bid);

    if (!nodeA || !nodeB) {
      return false;
    }

    nodeA.adjacent.push(nodeB);

    return true;
  }

  get(id: string): GraphNode<T> | null {
    const node = this.data.get(id) ?? null;

    return node;
  }

  get serialized(): Record<string, T> {
    const result = Array.from(this.data.entries()).reduce(
      (state, [key, value]) => ({ ...state, [key]: value }),
      {}
    );

    return result;
  }
}
