import { Queue } from '../sequence/queue/queue';
import { GraphNode } from './graph-node';
import { VisitNode } from './visit-node.type';

export function breathFirstSearch<T>(
  node: GraphNode<T>,
  visit: VisitNode<T>
): void {
  const queue = new Queue<GraphNode<T>>();
  const visited = new Map<string, boolean>();

  visit(node);
  visited.set(node.name, true);

  queue.enqueue(node);

  while (queue.length) {
    const current = queue.dequeue();

    if (current) {
      for (const adjacent of current.adjacent) {
        if (!visited.has(adjacent.name)) {
          visit(adjacent);
          visited.set(adjacent.name, true);
          queue.enqueue(adjacent);
        }
      }
    }
  }
}
