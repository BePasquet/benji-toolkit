import { Graph, GraphNode } from '@benji-toolkit/data-structures';

export interface Technique {
  name: string;
  videoUrl: string;
}

export type TechniqueGraph = Graph<Technique>;

export const bjjTechniquesGraph = new Graph<Technique>();

const closedGuard = new GraphNode<Technique>('close-guard', {
  name: 'Close Guard',
  videoUrl:
    'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
});

const rearNakedChoke = new GraphNode('rear-naked-choke', {
  name: 'Rear Naked Choke',
  videoUrl:
    'https://www.youtube.com/watch?v=l8-JI7NND3E&ab_channel=BernardoFariaBJJFanatics',
});

// Add techniques to graph
bjjTechniquesGraph.add(closedGuard);
bjjTechniquesGraph.add(rearNakedChoke);

// Connections
bjjTechniquesGraph.addConnection(closedGuard.name, rearNakedChoke.name);
