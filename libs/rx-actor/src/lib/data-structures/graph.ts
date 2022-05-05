import { PriorityQueue, Queue } from './queue';

export type GraphNodeRef<T> = Pick<WeightedGraphNode<T>, 'name' | 'data'>;

export class GraphNode<T> {
  adjacents: GraphNode<T>[] = [];
  constructor(public name: string = '', public data: T | null = null) {}
}

export class Graph<T> {
  private readonly data = new Map<string, GraphNode<T>>();

  addEdge(origin: GraphNodeRef<T>, destination: GraphNodeRef<T>): void {
    const originNode =
      this.data.get(origin.name) ?? new GraphNode(origin.name, origin.data);
    const destinationNode =
      this.data.get(destination.name) ??
      new GraphNode(destination.name, destination.data);

    originNode.adjacents.push(destinationNode);
    destinationNode.adjacents.push(originNode);

    this.data.set(origin.name, originNode);
    this.data.set(destination.name, destinationNode);
  }

  get(key: string): GraphNode<T> | null {
    return this.data.get(key) ?? null;
  }
}

export class WeightedEdge<T> {
  constructor(public node: WeightedGraphNode<T>, public weight: number) {}
}

export class WeightedGraphNode<T> {
  adjacents: WeightedEdge<T>[] = [];
  constructor(public name: string = '', public data: T | null = null) {}
}

export class WeightedGraph<T> {
  private data = new Map<string, WeightedGraphNode<T>>();

  addEdge(
    origin: GraphNodeRef<T>,
    destination: GraphNodeRef<T>,
    weight: number
  ): void {
    const originNode =
      this.data.get(origin.name) ??
      new WeightedGraphNode(origin.name, origin.data);

    const destinationNode =
      this.data.get(destination.name) ??
      new WeightedGraphNode(destination.name, destination.data);

    originNode.adjacents.push(new WeightedEdge(destinationNode, weight));
    destinationNode.adjacents.push(new WeightedEdge(originNode, weight));

    this.data.set(origin.name, originNode);
    this.data.set(destination.name, destinationNode);
  }

  getByName(key: string): WeightedGraphNode<T> | null {
    return this.data.get(key) ?? null;
  }
}

export function depthFirstSearch<T>(
  node: GraphNode<T>,
  operation: (node: GraphNode<T>) => void,
  visited = new Map<string, boolean>()
): void {
  operation(node);
  visited.set(node.name, true);

  for (const adjacent of node.adjacents) {
    if (!visited.has(adjacent.name)) {
      depthFirstSearch(adjacent, operation, visited);
    }
  }
}

export function breadthFirstSearch<T>(
  node: GraphNode<T>,
  operation: (node: GraphNode<T>) => void
): void {
  const visited = new Map<string, boolean>();
  const queue = new Queue<GraphNode<T>>();
  queue.enqueue(node);

  while (!queue.isEmpty()) {
    const node = queue.dequeue() as GraphNode<T>;
    operation(node);
    visited.set(node.name, true);

    for (const adjacent of node.adjacents) {
      if (!visited.has(adjacent.name)) {
        queue.enqueue(adjacent);
      }
    }
  }
}

interface ShortestPathState {
  weight: number;
  path: string;
}

function generatePath(
  paths: Map<string, ShortestPathState>,
  end: string
): string[] {
  const path = paths.get(end)?.path;

  if (!path) {
    return [end];
  }

  return generatePath(paths, path).concat(end);
}

export function shortestPath<T>(
  start: WeightedGraphNode<T>,
  destination: string
): string[] {
  const queue = new PriorityQueue<WeightedGraphNode<T>>();
  const weights = new Map<string, ShortestPathState>();

  weights.set(start.name, { path: '', weight: 0 });
  queue.enqueue(start, 0);

  while (!queue.isEmpty()) {
    const node = queue.dequeue();

    if (!node) {
      return [];
    }

    if (node.name === destination) {
      const path = generatePath(weights, node.name);
      return path;
    }

    for (const edge of node.adjacents) {
      const originWeight = weights.get(node.name)?.weight ?? Infinity;
      const savedWeight = weights.get(edge.node.name)?.weight ?? Infinity;
      const weight = originWeight + edge.weight;

      if (weight < savedWeight) {
        weights.set(edge.node.name, { path: node.name, weight });
        queue.enqueue(edge.node, edge.weight);
      }
    }
  }

  return [];
}

// For testing
// const weightedGraph = new WeightedGraph();
// weightedGraph.addEdge({ name: 'A', data: 'A' }, { name: 'B', data: 'B' }, 3);
// weightedGraph.addEdge({ name: 'A', data: 'A' }, { name: 'C', data: 'C' }, 2);

// weightedGraph.addEdge({ name: 'B', data: 'B' }, { name: 'D', data: 'D' }, 2);

// weightedGraph.addEdge({ name: 'C', data: 'C' }, { name: 'D', data: 'D' }, 1);
// weightedGraph.addEdge({ name: 'C', data: 'C' }, { name: 'E', data: 'E' }, 4);

// weightedGraph.addEdge({ name: 'D', data: 'D' }, { name: 'E', data: 'E' }, 2);
// const wgStart = weightedGraph.get('A');

// if (wgStart) {
//   const result = shortestPath(wgStart, 'E');
//   console.log(result);
// }

// const graph = new Graph();

// graph.addEdge({ name: 'A', data: 'A' }, { name: 'B', data: 'B' });
// graph.addEdge({ name: 'A', data: 'A' }, { name: 'G', data: 'G' });

// graph.addEdge({ name: 'B', data: 'B' }, { name: 'C', data: 'C' });

// graph.addEdge({ name: 'C', data: 'C' }, { name: 'D', data: 'D' });

// graph.addEdge({ name: 'D', data: 'D' }, { name: 'E', data: 'E' });

// const start = graph.get('A');
// if (start) {
//   breadthFirstSearch(start, (node) => console.log(node.name));
//   console.log('--------------');
//   depthFirstSearch(start, (node) => console.log(node.name));
// }
