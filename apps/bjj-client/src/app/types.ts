import { GraphNode } from '@benji-toolkit/data-structures';

export interface Technique {
  id: string;
  name: string;
  videoUrl: string;
}

export interface Edge {
  source: string;
  target: string;
}

export interface D3GraphData<T> {
  nodes: T[];
  links: Edge[];
}

export interface BaseState<T> {
  data: T;
  loading: boolean;
  error: string;
}

export interface D3GraphNode {
  id: string;
  data: Technique;
}

export type TechniqueGraph = Record<string, GraphNode<Technique>>;
