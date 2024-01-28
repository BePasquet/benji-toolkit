export interface TechniqueVisualizerParams {
  data: any;
}

export function TechniqueVisualizer({ data }: TechniqueVisualizerParams) {
  return <data>{JSON.stringify(data)}</data>;
}
