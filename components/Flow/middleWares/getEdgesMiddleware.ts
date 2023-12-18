import { Edge, Node } from "reactflow";

function getEdgesMiddleWare(nodes: Array<Node | Edge | any>) {
  const allFlowEdgesSet = new Set(nodes.flatMap((node) => node.flowEdge));
  const allEdges = Array.from(allFlowEdgesSet);
  const updatededge = allEdges.map((edge: any) => {
    const {
      id,
      label,
      bidirectional,
      boxCSS,
      pathCSS,
      selected,
      createdBy,
      flowNodeConnection,
      ...EdgeData
    } = edge;
    const getHandlesAndNodeId: Array<Edge> = flowNodeConnection?.edges.reduce(
      (result: Edge, item: any, index: number) => {
        if (index === 0) {
          result.target = item.node.id;
          result.targetHandle = item.handle;
        } else if (index === 1) {
          result.source = item.node.id;
          result.sourceHandle = item.handle;
        }
        return result;
      },
      {}
    );
    return {
      ...EdgeData,
      id,
      createdBy: createdBy?.emailId,
      ...getHandlesAndNodeId,
      selected,
      data: {
        label,
        bidirectional,
        pathCSS,
        boxCSS,
      },
    };
  });
  return updatededge;
}

export default getEdgesMiddleWare;
