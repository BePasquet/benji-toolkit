export interface IGraphNode<T> {
  name: string;
  value: T | null;
  adjacent: GraphNode<T>[];
}

export class GraphNode<T> implements IGraphNode<T> {
  constructor(
    public name: string,
    public value: T | null = null,
    public adjacent: GraphNode<T>[] = []
  ) {}
}
