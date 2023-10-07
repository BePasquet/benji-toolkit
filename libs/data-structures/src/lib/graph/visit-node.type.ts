import { GraphNode } from './graph-node';

export type VisitNode<T> = (node: GraphNode<T>) => void;
