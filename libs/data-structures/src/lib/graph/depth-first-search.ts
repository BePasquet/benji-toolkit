import { GraphNode } from './graph-node';
import { VisitNode } from './visit-node.type';

export function depthFirstSearchP<T>(
  node: GraphNode<T>,
  visit: VisitNode<T>,
  visited = new Map<string, boolean>()
): void {
  if (visited.has(node.name)) {
    return;
  }

  visit(node);
  visited.set(node.name, true);

  for (const adjacent of node.adjacent) {
    depthFirstSearchP(adjacent, visit, visited);
  }
}

export function depthFirstSearch<T>(
  node: GraphNode<T>,
  visit: VisitNode<T>
): void {
  return depthFirstSearchP(node, visit);
}
