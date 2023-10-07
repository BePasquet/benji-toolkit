import { GraphNode } from '../graph-node';

export class DirectedGraph<T> {
  add(from: GraphNode<T>, to: GraphNode<T>) {
    from.adjacent.push(to);
  }
}

export class Graph<T> {
  private readonly nodes = new Map<string, GraphNode<T>>();
  add(from: GraphNode<T>, to: GraphNode<T>) {
    from.adjacent.push(to);
    to.adjacent.push(from);

    if (this.nodes.has(from.name)) {
      this.nodes.set(from.name, from);
    }

    if (this.nodes.has(to.name)) {
      this.nodes.set(to.name, to);
    }
  }

  get(name: string): GraphNode<T> | null {
    return this.nodes.get(name) ?? null;
  }
}

export interface SocialMedia {
  name: string;
  icon: string;
  url: string;
}

export interface Person {
  name: string;
  age: number;
  phone?: string;
  socialMedia: SocialMedia[];
}

export const personA: Person = {
  name: 'ania',
  age: 33,
  socialMedia: [],
};

export const personB: Person = {
  name: 'eva',
  age: 34,
  socialMedia: [],
};

export const personC: Person = {
  name: 'mari',
  age: 44,
  socialMedia: [],
};

export const personD: Person = {
  name: 'juana',
  age: 25,
  socialMedia: [],
};

export const personE: Person = {
  name: 'gaby',
  age: 25,
  socialMedia: [],
};
