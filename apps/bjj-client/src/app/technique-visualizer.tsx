import { Graph } from 'react-d3-graph';
import { TECHNIQUE_GRAPH_CONFIG } from './technique-graph.config';
import { D3GraphData, D3GraphNode } from './types';

export interface TechniqueVisualizerParams {
  data: D3GraphData<D3GraphNode>;
}

export function TechniqueVisualizer({ data }: TechniqueVisualizerParams) {
  const onClickNode = (nodeId: string) => {
    window.alert(`Clicked node ${nodeId}`);
  };

  const onClickLink = (source: string, target: string) => {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  return (
    <Graph
      id="graph-id" // id is mandatory
      data={data}
      config={TECHNIQUE_GRAPH_CONFIG}
      onClickNode={onClickNode}
      onClickLink={onClickLink}
    />
  );
}
