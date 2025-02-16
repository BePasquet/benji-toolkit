import { Graph } from 'react-d3-graph';
import styled from 'styled-components';
import { TECHNIQUE_GRAPH_CONFIG } from './technique-graph.config';
import { D3GraphData, D3GraphNode } from './types';

export interface TechniqueVisualizerParams {
  data: D3GraphData<D3GraphNode>;
  onNodeClick: (id: string) => void;
}

export function TechniqueVisualizer({
  data,
  onNodeClick,
}: TechniqueVisualizerParams) {
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
        onClickNode={onNodeClick}
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
