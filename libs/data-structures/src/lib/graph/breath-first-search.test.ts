import { breathFirstSearch } from './breath-first-search';
import { GraphNode } from './graph-node';
import {
  Graph,
  Person,
  personA,
  personB,
  personC,
  personD,
  personE,
} from './test-util/graph.mock';

describe('breathFirstSearch', () => {
  it('Should traverse the graph in correct order', () => {
    const visit = jest.fn();

    const nodeA = new GraphNode(personA.name, personA);

    const nodeB = new GraphNode(personB.name, personB);

    const nodeC = new GraphNode(personC.name, personC);

    const nodeD = new GraphNode(personD.name, personD);

    const nodeE = new GraphNode(personE.name, personE);

    const socialNetwork = new Graph<Person>();

    socialNetwork.add(nodeA, nodeB);
    socialNetwork.add(nodeA, nodeC);
    socialNetwork.add(nodeB, nodeD);
    socialNetwork.add(nodeB, nodeE);

    breathFirstSearch(nodeA, visit);

    expect(visit).toHaveBeenNthCalledWith(1, nodeA);
    expect(visit).toHaveBeenNthCalledWith(2, nodeB);
    expect(visit).toHaveBeenNthCalledWith(3, nodeC);
    expect(visit).toHaveBeenNthCalledWith(4, nodeD);
    expect(visit).toHaveBeenNthCalledWith(5, nodeE);
  });
});