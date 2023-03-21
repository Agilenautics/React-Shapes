
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  useEdges,
} from "react-flow-renderer";
import { nodeTypeMap } from "./Nodes/nodeTypes";
import ConnectionLine from "./ConnectionLine";
import CustomControls from "./CustomControls";
import { edgeTypeMap } from "./Edges/edgeTypes";
import nodeStore from "./Nodes/nodeStore";
import edgeStore from "./Edges/edgeStore";
import { allNodes, deleteNodeBackend, updateNodeBackend, updatePosition } from "./Nodes/gqlNodes";
import { createFlowEdge, deleteEdge, updateEdgeBackend, updateEdgeMutation } from "./Edges/gqlEdges";
import fileStore from "../TreeView/fileStore";

const defaultEdgeOptions = {
  type: "customEdge",
  data: {
    label: "New Edge",
    pathCSS: "!stroke-node-green-200 fill-node-green-200",
    boxCSS: "border-node-green-100 bg-node-green-50 text-node-green-200",
    bidirectional: false,
  },
};
/**
 * This is the main flowchart component. We're using a lot of hooks to get the data for this component.
 * The callbacks are used to update the flowchart whenever a change takes place.
 */

function Flow() {
  const snapGrid: [number, number] = [10, 10];
  const { getNodes, getEdges } = useReactFlow();
  const defaultNodes = nodeStore((state) => state.nodes);
  const defaultEdges = edgeStore((state) => state.edges);
  const updateEdges = edgeStore((state) => state.updateEdges);
  const updateNodes = nodeStore((state) => state.updateNodes);
  const deleteNode = nodeStore((state) => state.deleteNode);
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [edges, setEdges] = useState<Edge[]>(defaultEdges);
  const currentFlowchart = fileStore((state) => state.currentFlowchart)


  const [nodeId, setNodeId] = useState([])



  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nds) => {
        const nodeData = defaultNodes.filter((value) => value.id === changes[0].id)
        nodeData.map((curEle:any) => {
          setNodeId(curEle)
        })
        return applyNodeChanges(changes, nds)
      }
      ),
    [defaultNodes,setNodes,updateNodes,currentFlowchart]
  );

  const [edgeId, setEdgeId] = useState([])

  const onEdgeClick = (event: any, edge: any) => {
    setEdgeId(edge.id)
  }


  useEffect(() => {
    if (edgeId.length !== 0) {
      const newEdgeData = defaultEdges.filter((value: any) => value.id === edgeId)
      newEdgeData.map((curEle) => {
        updateEdgeBackend(updateEdgeMutation, curEle)
      })
    }
    if(nodeId.length!==0){
      updateNodeBackend(nodeId,currentFlowchart)
    }
  },[defaultEdges, edgeId,nodeId,defaultNodes])






  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => {
        return applyEdgeChanges(changes, eds);
      }),
    [setEdges, defaultEdges, updateEdges, onEdgeClick]
  );
  const onConnect = useCallback(
    (newEdge: Connection) =>
      setEdges((eds) => {
        createFlowEdge(newEdge, currentFlowchart, updateEdges)
        updateEdges(getEdges());
        return addEdge(newEdge, eds);
      }),
    [setEdges, getEdges, updateEdges, currentFlowchart]
  );

  function onNodesDelete(nodes: Array<Node>) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      console.log(element.data.label);
      deleteNodeBackend(element.id);
      deleteNode(element);
    }
  }


  //here iam calling update position methode 
  const onDrag = (event: any, node: Object) => {
    updatePosition(node)
  }


  // here iam calling deleteEdge methode inside onDeleteEdge

  const onDeleteEdge = (edge: Array<Edge>) => {
    edge.map((CurEle: any) => {
      deleteEdge(CurEle.id, CurEle.data.label)
    })
  }









  return (
    <div className="absolute -z-20 h-screen w-screen transition-all duration-100">
      <ReactFlow
        panOnScroll
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        // @ts-ignore
        connectionLineComponent={ConnectionLine}
        // snapToGrid
        snapGrid={snapGrid}
        zoomOnDoubleClick={false}
        // @ts-ignore
        edgeTypes={edgeTypeMap}
        // @ts-ignore
        nodeTypes={nodeTypeMap}
        connectionMode={ConnectionMode.Loose}
        onNodeDragStop={
          (event, node) => {
            updateNodes(getNodes())
            onDrag(event, node)
          }
        }
        onNodesDelete={(selectedNodes) => onNodesDelete(selectedNodes)}
        onEdgesDelete={(selectedEdge) => onDeleteEdge(selectedEdge)}
        // onNodeDrag={onDrag}
        onEdgeClick={onEdgeClick}
      >
        <MiniMap />
        <CustomControls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
