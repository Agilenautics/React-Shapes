import { Node } from "reactflow";

function getEdgesMiddleWare(nodes: Array<Node | any>) {
  const allFlowEdgesSet = new Set(nodes.flatMap((node) => node.flowEdge));
  return Array.from(allFlowEdgesSet);
}

export default getEdgesMiddleWare;
