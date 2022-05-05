// import './array-utilities';
// import './graph-utilities';

// koi.js
// being
// events aka signals
// reactivity collection transduction
// decision making
// sight, touch, hearing
// sight is a stream of images
// touch is a stream on events
// hearing is a stream of sound

// deploy a system
// and them has to interact
// interaction is done through messages
// remove bias from information
// how we connect

// function findStarting(pumps: number[][], start = 0, state = 0) {
//   // look at all and didn't find a path
//   if (start >= pumps.length) {
//     return -1;
//   }

//   const [petrol, distance] = pumps[start % pumps.length];
//   const remaining = state + petrol - distance;
//   // run out of petrol try starting at next station
//   if (remaining < 0) {
//     return findStarting(pumps, start + 1, 0);
//   }

//   findStarting(pumps, start + 1, remaining);

//   return start;
// }

// n=int(input())
// petrol,distance=[],[]
// for i in range(n):
//     p,d=[int(x) for x in input().split()]
//     petrol.append(p),distance.append(d)
// start,xsum=0,0
// for i in range(n):
//     xsum+=petrol[i]-distance[i]     #Calculating the difference and adding to the sum
//     if xsum<0:          #If sum becomes negative, that means we cannot complete the loop
//         start=i+1       #So start from the next index
//         xsum=0          #Reset the sum
// print(start)

// function findStarting(pumps: number[][]) {
//   const initialState = { start: 0, remaining: 0 };

//   const state = pumps.reduce((state, [petrol, distance]) => {
//     const remaining = state.remaining + petrol - distance;
//     return remaining < 0
//       ? { start: state.start + 1, remaining: 0 }
//       : { ...state, remaining };
//   }, initialState);

//   return state.remaining >= 0 ? state.start : -1;
// }

// class WeightedEdge<T> {
//   constructor(public node: GraphNode<T>, public weight: number = 0) {}
// }

// class GraphNode<T> {
//   adjacents: WeightedEdge<T>[] = [];
//   constructor(public data: T, public name: string = '') {}
// }

// function breadthFirstSearch<T>(start: GraphNode<T>): number[] {
//   const queue: GraphNode<T>[] = [];
//   const weights = new Map<T, { path: T | null; weight: number }>();

//   queue.push(start);
//   weights.set(start.data, { path: null, weight: 0 });

//   while (queue.length) {
//     const node = queue.shift();

//     if (!node) {
//       return [];
//     }

//     for (const adjacent of node.adjacents) {
//       if (!weights.has(adjacent.node.data)) {
//         const pathDistance = weights.get(node.data)?.weight ?? 0;

//         weights.set(adjacent.node.data, {
//           path: node.data,
//           weight: pathDistance + adjacent.weight,
//         });

//         queue.push(adjacent.node);
//       }
//     }
//   }

//   // Maps maintain order of insertion
//   // we generate an array of weights without the starting point
//   return Array.from(weights.values())
//     .slice(1)
//     .map(({ weight }) => weight);
// }

// class Graph<T> {
//   private readonly data = new Map<T, GraphNode<T>>();

//   addEdge(origin: T, destination: T, weight: number = 0): void {
//     const originNode = this.data.get(origin) ?? new GraphNode(origin);

//     const destinationNode =
//       this.data.get(destination) ?? new GraphNode(destination);

//     originNode.adjacents.push(new WeightedEdge(destinationNode, weight));

//     destinationNode.adjacents.push(new WeightedEdge(originNode, weight));
//     this.data.set(origin, originNode);
//     this.data.set(destination, destinationNode);
//   }

//   getNode(key: T) {
//     return this.data.get(key);
//   }
// }

// // 6 6 -1 -1 6
// const EDGE_DISTANCE = 6;

// function buildGraph(edges: number[][]): Map<number, number[]> {
//   const graph = new Map<number, number[]>();

//   for (const [origin, destination] of edges) {
//     const originAdj = graph.get(origin) ?? [];
//     const destinationAdj = graph.get(destination) ?? [];
//     graph.set(origin, [...originAdj, destination]);
//     graph.set(destination, [...destinationAdj, origin]);
//   }

//   return graph;
// }

// function bfs(n: number, m: number, edges: number[][], s: number): number[] {
//   const graph = buildGraph(edges);
//   const queue: number[] = [s];

//   const distances = Array(n).fill(-1);
//   distances[s - 1] = 0;

//   while (queue.length) {
//     const node = queue.shift();

//     if (!node) {
//       return [];
//     }

//     const adjacents = graph.get(node);
//     if (!adjacents) {
//       return [];
//     }

//     for (const adjacent of adjacents) {
//       if (distances[adjacent - 1] === -1) {
//         distances[adjacent - 1] = distances[node - 1] + EDGE_DISTANCE;
//         queue.push(adjacent);
//       }
//     }
//   }

//   return distances.filter((x) => x !== 0);
// }

// const input = [[2, 3]];
// const n = 3;
// const s = 2;
// console.log(bfs(n, 1, input, s));

// class TrieNode {
//     children = new Map<string, TrieNode>();
//     isEndOfWord = false;
//   }

//   function checkPrefix(node: TrieNode, text: string, index = 0): boolean {
//     const character = text[index];

//     // finish inserting characters and no prefix found
//     if (!character) {
//       return false;
//     }

//     // left characters to insert and found a end of word
//     // meaning there is a prefix already of the text
//     if (node.isEndOfWord) {
//       return true;
//     }

//     const lastIndex = text.length - 1;

//     // there is already children of this character
//     if (node.children.has(character)) {
//       // there is another node and we are in the last character of the text
//       // meaning the text is a prefix of another word
//       return index === lastIndex
//         ? true
//         : checkPrefix(node.children.get(character) as TrieNode, text, index + 1);
//     }

//     const newNode = new TrieNode();
//     newNode.isEndOfWord = index === lastIndex;
//     node.children.set(character, newNode);

//     return newNode.isEndOfWord ? false : checkPrefix(newNode, text, index + 1);
//   }

//   function noPrefix(words: string[]): void {
//     const trie = new TrieNode();

//     for (const word of words) {
//       const isPrefix = checkPrefix(trie, word);

//       if (isPrefix) {
//         console.log('BAD SET');
//         console.log(word);
//         return;
//       }
//     }

//     console.log('GOOD SET');
//   }

// export class QueueNode<T> {
//     next: QueueNode<T> | null = null;
//     constructor(public data: T) {}
//   }

//   export class Queue<T> {
//     private head: QueueNode<T> | null = null;
//     private tail: QueueNode<T> | null = null;

//     add(data: T): void {
//       const node = new QueueNode(data);
//       // References previous element next to node
//       if (this.tail) {
//         this.tail.next = node;
//       }

//       // Switch tail
//       this.tail = node;

//       if (!this.head) {
//         // References head to node then references will change every time a node is added
//         this.head = node;
//       }
//     }

//     remove(): T | null {
//       const data = this.head?.data ?? null;
//       this.head = this.head?.next ?? null;

//       if (!this.head) {
//         this.tail = null;
//       }

//       return data;
//     }

//     isEmpty(): boolean {
//       return !this.head;
//     }

//     peek(): T | null {
//       return this.head?.data ?? null;
//     }
//   }
