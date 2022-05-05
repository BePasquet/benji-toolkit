export type GraphNodeOperation<T> = (node: GraphNode<T>) => void;

export class WeightedEdge<T> {
  constructor(public weight: number, public node: GraphNode<T>) {}
}

export class GraphNode<T> {
  adjacents: WeightedEdge<T>[] = [];
  constructor(public name: string, public data: T) {}
}

export class PriorityQueueElement<T> {
  constructor(public element: T, public priority: number) {}
}

export class PriorityQueue<T> {
  private readonly data: PriorityQueueElement<T>[] = [];

  enqueue(element: PriorityQueueElement<T>): void {
    const index = this.data.findIndex(
      ({ priority }) => priority > element.priority
    );

    if (index > -1) {
      this.data.splice(index, 0, element);
      return;
    }

    this.data.push(element);
  }

  dequeue(): T | null {
    const highestPriority = this.data.shift();
    return highestPriority?.element ?? null;
  }

  get length(): number {
    return this.data.length;
  }
}

function recreatePath(
  state: Map<string, GraphNodeState>,
  last: string
): string[] {
  const prev = state.get(last)?.path;

  // When there is no path found the first node
  if (!prev) {
    return [last];
  }

  return recreatePath(state, prev).concat(last);
}

interface GraphNodeState {
  weight: number;
  path: string;
}

export function shortestPath<T>(start: GraphNode<T>, end: string): string[] {
  const queue = new PriorityQueue<GraphNode<T>>();
  const state = new Map<string, GraphNodeState>();

  // Add to queue starting node to look at adjacents
  queue.enqueue({ element: start, priority: 0 });
  state.set(start.name, { weight: 0, path: '' });

  while (queue.length) {
    const node = queue.dequeue();

    if (!node) {
      return [];
    }

    // Found node
    if (node.name === end) {
      return recreatePath(state, node.name);
    }

    for (const adjacent of node.adjacents) {
      const storedWeight = state.get(adjacent.node.name)?.weight ?? Infinity;
      const nodeWeight = state.get(node.name)?.weight ?? Infinity;
      const weight = nodeWeight + adjacent.weight;

      if (weight < storedWeight) {
        state.set(adjacent.node.name, { weight, path: node.name });
        queue.enqueue({ element: adjacent.node, priority: weight });
      }
    }
  }

  return [];
}

export function depthFirstSearch<T>(
  node: GraphNode<T>,
  operation: GraphNodeOperation<T>,
  state = new Map<string, boolean>()
): void {
  if (state.has(node.name)) {
    return;
  }

  operation(node);
  state.set(node.name, true);

  for (const adjacent of node.adjacents) {
    depthFirstSearch(adjacent.node, operation, state);
  }
}

export function breadthFirstSearch<T>(
  node: GraphNode<T>,
  operation: GraphNodeOperation<T>
): void {
  const queue: GraphNode<T>[] = [];
  const state = new Map<string, boolean>();

  const processNode = (gNode: GraphNode<T>) => {
    operation(gNode);
    state.set(gNode.name, true);
    queue.push(gNode);
  };

  processNode(node);

  while (queue.length) {
    const firstNode = queue.shift();

    if (!firstNode) {
      return;
    }

    for (const adjacent of firstNode.adjacents) {
      if (!state.has(adjacent.node.name)) {
        processNode(adjacent.node);
      }
    }
  }
}
