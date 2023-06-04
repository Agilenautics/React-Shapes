import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  EdgeChange,
  Connection,
  MiniMap,
  ConnectionMode,
  useReactFlow,
} from "react-flow-renderer";

import { nodeTypeMap } from "./Nodes/nodeTypes";
import ConnectionLine from "./ConnectionLine";
import CustomControls from "./CustomControls";
import { edgeTypeMap } from "./Edges/edgeTypes";
import nodeStore from "./Nodes/nodeStore";
import edgeStore from "./Edges/edgeStore";
import { deleteNodeBackend, updateNodeBackend, updatePosition } from "./Nodes/gqlNodes";
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
  const currentFlowchart = fileStore((state) => state.currentFlowchart);
  const fileId = fileStore((state) => state.Id);
  const updateLinkNodeId = fileStore((state) => state.updateLinkNodeId);
  const [nodeId, setNodeId] = useState([]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    onNodesDelete(selectedNodes);
    setShowConfirmation(false);
  }, [getNodes, onNodesDelete]);

  const handleCancel = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nds) => {
        const nodeData = defaultNodes.filter((value) => value.id === changes[0].id);
        nodeData.map((curEle: any) => {
          setNodeId(curEle);
        });
        return applyNodeChanges(changes, nds);
      }),
    [defaultNodes, setNodes, updateNodes, currentFlowchart]
  );

  const [edgeId, setEdgeId] = useState([]);

  const onEdgeClick = (event: any, edge: any) => {
    setEdgeId(edge.id);
  };

  useEffect(() => {
    if (edgeId && edgeId.length !== 0) {
      const newEdgeData = defaultEdges.filter((value: any) => value.id === edgeId);
      newEdgeData.map((curEle) => {
        updateEdgeBackend(updateEdgeMutation, curEle);
      });
    }
  }, [defaultEdges, edgeId, nodeId, defaultNodes, updateNodeBackend]);

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
        createFlowEdge(newEdge, fileId, updateEdges);
        updateEdges(getEdges());
        return addEdge(newEdge, eds);
      }),
    [setEdges, getEdges, updateEdges, currentFlowchart]
  );

  useEffect(() => {
    const handleBackspace = (event: { key: string }) => {
      const focusedElement = document.activeElement;
      const isTextFieldFocused =
        focusedElement instanceof HTMLInputElement || focusedElement instanceof HTMLTextAreaElement;

      if (!isTextFieldFocused && event.key === "Backspace") {
        const selectedNodes = getNodes().filter((node) => node.selected);
        setShowConfirmation(true);
      }
    };
    document.addEventListener("keydown", handleBackspace);
    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
  }, []);

  function onNodesDelete(nodes: Array<Node>) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      deleteNodeBackend(element.id);
      deleteNode(element);
    }
  }

  const onDrag = (event: any, node: Object) => {
    updatePosition(node);
  };

  const onDeleteEdge = (edge: Array<Edge>) => {
    edge.map((CurEle: any) => {
      deleteEdge(CurEle.id, CurEle.data.label);
    });
  };

  const onNodeClick = (e: any, nodeData: any) => {
    updateLinkNodeId(nodeData.id);
  };

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
        snapGrid={snapGrid}
        zoomOnDoubleClick={false}
      // @ts-ignore
        edgeTypes={edgeTypeMap}
        nodeTypes={nodeTypeMap}
        connectionMode={ConnectionMode.Loose}
        onNodeDragStop={(event, node) => {
          updateNodes(getNodes());
          onDrag(event, node);
        }}
        onNodesDelete={(selectedNodes) => onNodesDelete(selectedNodes)}
        onEdgesDelete={(selectedEdge) => onDeleteEdge(selectedEdge)}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        deleteKeyCode={[]}
      >
        <MiniMap />
        <CustomControls />
      </ReactFlow>

      {showConfirmation && (
        <div className="popup-container">
          <div className="popup-window">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the selected node(s)?</p>
            <div>
              <button className="popup-button" onClick={handleConfirm}>
                Yes
              </button>
              <button className="popup-button" onClick={handleCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flow;
