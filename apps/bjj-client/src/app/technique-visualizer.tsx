import { Graph } from 'react-d3-graph';
import styled from 'styled-components';
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
    <GraphContainer>
      <Graph
        id="graph-id"
        data={data}
        config={{
          ...TECHNIQUE_GRAPH_CONFIG,
          width: window.innerWidth,
          height: window.innerHeight,
        }}
        onClickNode={onClickNode}
        onClickLink={onClickLink}
      />
    </GraphContainer>
  );
}

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
