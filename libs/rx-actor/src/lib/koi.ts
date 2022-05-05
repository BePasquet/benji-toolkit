import { GraphNodeRef } from './data-structures/graph';
import { PriorityQueue } from './data-structures/queue';
import { Message } from './rx-actor';

export class WeightedKoiEdge<T> {
  constructor(public node: KoiNode<T>, public weight: number) {}
}

export class KoiNode<T> {
  adjacents: WeightedKoiEdge<T>[] = [];
  constructor(public name: string = '') {}

  send(message: Message) {
    console.log(message);
  }
}
export class KoiGraph<T> {
  private data = new Map<string, KoiNode<T>>();

  addEdge(
    origin: GraphNodeRef<T>,
    destination: GraphNodeRef<T>,
    weight: number
  ): void {
    const originNode = this.data.get(origin.name) ?? new KoiNode(origin.name);

    const destinationNode =
      this.data.get(destination.name) ?? new KoiNode(destination.name);

    originNode.adjacents.push(new WeightedKoiEdge(destinationNode, weight));
    destinationNode.adjacents.push(new WeightedKoiEdge(originNode, weight));

    this.data.set(origin.name, originNode);
    this.data.set(destination.name, destinationNode);
  }

  getByName(key: string): KoiNode<T> | null {
    return this.data.get(key) ?? null;
  }
}

export interface FindNodeState {
  distance: number;
  path: string;
}

function findNode<T>(node: KoiNode<T>, name: string): KoiNode<T> | null {
  const distances = new Map<string, FindNodeState>();
  const queue = new PriorityQueue<KoiNode<T>>();
  queue.enqueue(node, 0);

  distances.set(node.name, {
    distance: 0,
    path: '',
  });

  while (!queue.isEmpty()) {
    const node = queue.dequeue() as KoiNode<T>;

    if (node.name === name) {
      return node;
    }

    for (const edge of node.adjacents) {
      const pathDistance = distances.get(node.name)?.distance ?? Infinity;
      const edgeSavedDistance =
        distances.get(edge.node.name)?.distance ?? Infinity;

      const distance = pathDistance + edge.weight;

      if (distance < edgeSavedDistance) {
        distances.set(edge.node.name, {
          distance,
          path: node.name,
        });

        queue.enqueue(edge.node, distance);
      }
    }
  }
  return node;
}

export class Koi<T> {
  private readonly graph = new KoiGraph<T>();

  send(message: Message, to: string): void {
    const root = this.graph.getByName('MAIN');

    if (root) {
      const node = findNode(root, to);
      // TODO ADD ACTOR WITH MESSAGE TYPE
      node?.send(message);
    }
  }
}
