export const TECHNIQUE_GRAPH_CONFIG = {
  nodeHighlightBehavior: true,
  directed: true,
  node: {
    color: '#d3d3d3',
    fontColor: 'black',
    fontSize: 10,
    fontWeight: 'normal',
    highlightColor: 'black',
    highlightFontSize: 14,
    highlightFontWeight: 'bold',
    highlightStrokeColor: '#ccc',
    size: 800,
    labelProperty: (node: any) => node.data.name,
  },
  link: {
    highlightColor: 'lightblue',
  },
};
