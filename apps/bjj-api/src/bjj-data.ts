import { Graph, GraphNode } from '@benji-toolkit/data-structures';

export interface Technique {
  name: string;
  videoUrl: string;
}

export type TechniqueGraph = Graph<Technique>;

export const bjjTechniquesGraph = new Graph<Technique>();

// Techniques data
const techniqueData = [
  {
    name: 'Elbow Knee Escape',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Take The Back',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Bridge Escape',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Stand Up Break Closed Guard',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Side Smash',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Half Guard',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Dog Fight',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Butterfly Sweep',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Arm Triangle',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Hip Bump',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Mount',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Guillotine',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Tripod Sweep',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Knee cut',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Side Control',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Dog Fight',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Limp Arm',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Closed Guard',
    videoUrl:
      'https://www.youtube.com/watch?v=kPZh0ZZyZj0&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'Rear Naked Choke',
    videoUrl:
      'https://www.youtube.com/watch?v=l8-JI7NND3E&ab_channel=BernardoFariaBJJFanatics',
  },
  {
    name: 'X Pass',
    videoUrl:
      'https://www.youtube.com/watch?v=l8-JI7NND3E&ab_channel=BernardoFariaBJJFanatics',
  },
];

techniqueData.forEach((data) => {
  const id = data.name.replaceAll(' ', '-').toLowerCase();
  const node = new GraphNode(id, data);
  bjjTechniquesGraph.add(node);
});

// Connections

bjjTechniquesGraph.addConnection('closed-guard', 'butterfly-sweep');
bjjTechniquesGraph.addConnection('butterfly-sweep', 'mount');

bjjTechniquesGraph.addConnection('elbow-knee-escape', 'closed-guard');
bjjTechniquesGraph.addConnection('closed-guard', 'take-the-back');
bjjTechniquesGraph.addConnection('take-the-back', 'rear-naked-choke');

bjjTechniquesGraph.addConnection(
  'bridge-escape',
  'stand-up-break-closed-guard'
);
bjjTechniquesGraph.addConnection('knee-cut', 'side-control');
bjjTechniquesGraph.addConnection('side-control', 'mount');
bjjTechniquesGraph.addConnection('mount', 'arm-triangle');
bjjTechniquesGraph.addConnection('side-control', 'arm-triangle');

bjjTechniquesGraph.addConnection('side-smash', 'take-the-back');

bjjTechniquesGraph.addConnection('closed-guard', 'hip-bump');
bjjTechniquesGraph.addConnection('hip-bump', 'mount');
bjjTechniquesGraph.addConnection('hip-bump', 'guillotine');

bjjTechniquesGraph.addConnection('half-guard', 'dog-fight');
bjjTechniquesGraph.addConnection('dog-fight', 'limp-arm');
bjjTechniquesGraph.addConnection('limp-arm', 'take-the-back');

bjjTechniquesGraph.addConnection('tripod-sweep', 'knee-cut');
bjjTechniquesGraph.addConnection('tripod-sweep', 'side-smash');
bjjTechniquesGraph.addConnection('tripod-sweep', 'x-pass');

bjjTechniquesGraph.addConnection('x-pass', 'side-control');
