import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import "reactflow/dist/style.css";
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
  Controls,
} from "reactflow";
import { nodeTypeMap } from "./Nodes/nodeTypes";
import ConnectionLine from "./ConnectionLine";
import { edgeTypeMap } from "./Edges/edgeTypes";
import nodeStore from "./Nodes/nodeStore";
import edgeStore from "./Edges/edgeStore";
import {
  allNodes,
  delNodeMutation,
  deleteNodeBackend,
  findNode,
  getNode,
  updateNodeBackend,
  updatePosition,
  updatePositionMutation,
  createFlowEdge,
  deleteEdgeBackend,
  updateEdgeBackend,
  updateEdgeMutation,
  getProjectByUser,
} from "../../gql";
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

const defaultShowConfirmation = {
  type: "",
  show: false,
  selectedItems: [],
};

function Flow() {
  const snapGrid: [number, number] = [10, 10];
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { getNodes, getEdges } = useReactFlow();
  const { nodes: defaultNodes, updateNodes, deleteNode } = nodeStore();
  const { edges: defaultEdges, updateEdges, deleteEdge } = edgeStore();
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [edges, setEdges] = useState<Edge[]>(defaultEdges);
  const { currentFlowchart, Id: fileId, updateLinkNodeId } = fileStore();
  const [nodeId, setNodeId] = useState([]);

  const dragged = useRef(false);

  const [showConfirmation, setShowConfirmation] = useState<any>(
    defaultShowConfirmation
  );
  const onDeleteEdge = (edge: Array<Edge>) => {
    edge.map((curEle: any) => {
      deleteEdge(curEle);
      deleteEdgeBackend(curEle.id, curEle.data.label);
    });
  };
  const handleConfirm = useCallback(() => {
    if (showConfirmation) {
      const selectedItems = showConfirmation.selectedItems;
      if (showConfirmation.type === "node") {
        onNodesDelete(selectedItems);
      } else if (showConfirmation.type === "links") {
        onNodesDelete(selectedItems);
      } else if (showConfirmation.type === "edge") {
        onDeleteEdge(selectedItems);
      }
      setShowConfirmation(null);
    }
    setShowConfirmation(defaultShowConfirmation);
  }, [showConfirmation, onNodesDelete, onDeleteEdge]);

  const handleCancel = useCallback(() => {
    setShowConfirmation(defaultShowConfirmation);
  }, []);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nds) => {
        const nodeData = defaultNodes.filter(
          (value) => value.id === changes[0].id
        );
        nodeData.map((curEle: any) => {
          setNodeId(curEle);
        });
        return applyNodeChanges(changes, nds);
      }),
    [defaultNodes, setNodes, updateNodes, currentFlowchart]
  );

  const [edgeId, setEdgeId] = useState([]);

  const onEdgeClick = (event: React.MouseEvent, edge: any) => {
    setEdgeId(edge.id);
  };

  useEffect(() => {
    if (edgeId && edgeId.length !== 0) {
      const newEdgeData = defaultEdges.filter(
        (value: any) => value.id === edgeId
      );
      newEdgeData.map((curEle) => {
        updateEdgeBackend(updateEdgeMutation, curEle);
      });
    }
  }, [defaultEdges, edgeId]);

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
    const handleBackspace = async (event: { key: string }) => {
      const focusedElement = document.activeElement;
      const isTextFieldFocused =
        focusedElement instanceof HTMLInputElement ||
        focusedElement instanceof HTMLTextAreaElement;

      if (!isTextFieldFocused && event.key === "Backspace") {
        const selectedNodes = getNodes().filter((node) => node.selected);
        const selectedEdges = getEdges().filter((edge) => edge.selected);
        if (selectedNodes.length > 0) {
          const node = await findNode(getNode, selectedNodes[0].id);
          const linkA = node[0].data.hasLinkedBy.flag;
          const linkB = node[0].data.hasLinkedTo.flag;
          //.flowNode.nodeData.linked
          if (linkA || linkB) {
            setShowConfirmation({
              type: "links",
              show: true,
              selectedItems: selectedNodes,
            });
          } else {
            setShowConfirmation({
              type: "node",
              show: true,
              selectedItems: selectedNodes,
            });
          }
        } else if (selectedEdges.length > 0) {
          setShowConfirmation({
            type: "edge",
            show: true,
            selectedItems: selectedEdges,
          });
        } else {
          setShowConfirmation(defaultShowConfirmation);
        }
      }
    };

    document.addEventListener("keydown", handleBackspace);
    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
  }, [getNodes, getEdges]);
  async function onNodesDelete(nodes: Array<Node>) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      try {
        await deleteNodeBackend(
          element.id,
          delNodeMutation,
          allNodes,
          fileId,
          projectId,
          getProjectByUser
        );
        deleteNode(element);
      } catch (error) {
        console.log(error, "deleting the node");
      }
    }
  }

  const onNodeDrag = useCallback(() => {
    dragged.current = true;
  }, []);

  const onNodeDragStop = useCallback(
    async (event: React.MouseEvent, node: Node) => {
      try {
        if (dragged.current) {
          await updatePosition(node, updatePositionMutation, allNodes, fileId);
        }
        dragged.current = false;
      } catch (error) {
        console.log(error, "while dragging the node");
      }
    },
    [fileId]
  );

  const onSelectionChange = useCallback(() => {
    console.count("onSelectionChange");
  }, []);

  // const onDrag = (event: any, node: Object) => {
  //   updatePosition(node);
  //   console.log(node);
  // };
  const onNodeClick = (e: React.MouseEvent, nodeData: any) => {
    updateLinkNodeId(nodeData.id);
  };
  const proOptions = { hideAttribution: true };

  //TODO here iam calling deleteEdge methode inside onDeleteEdge

  // const onDeleteEdge = (edge: Array<Edge>) => {
  //   edge.map((CurEle: any) => {
  //     deleteEdge(CurEle.id, CurEle.data.label)
  //   })
  // }

  return (
    <>
      <div className="reactflow-wrapper h-screen transition-all duration-100">
        {/* <BreadCrumbs /> */}
        <ReactFlow
          draggable
          nodesDraggable={true}
          proOptions={proOptions}
          panOnScroll
          defaultNodes={defaultNodes} // This part is because the nodes wern't draggable
          nodes={defaultNodes}
          edges={defaultEdges}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          connectionLineComponent={ConnectionLine}
          snapGrid={snapGrid}
          zoomOnDoubleClick={false}
          edgeTypes={edgeTypeMap}
          nodeTypes={nodeTypeMap}
          connectionMode={ConnectionMode.Loose}
          onNodeDragStop={(event, node) => {
            updateNodes(getNodes());
            onNodeDragStop(event, node);
          }}
          onNodeDrag={onNodeDrag} //this event we dont want
          onNodesDelete={(selectedNode) => onNodesDelete(selectedNode)}
          onEdgesDelete={(selectedEdge) => onDeleteEdge(selectedEdge)}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
          deleteKeyCode={[]}
        >
          <MiniMap
            //nodeComponent={MiniMapNode}
            zoomable
          />
          <Controls className="" />
          {/* <CustomControls /> */}
        </ReactFlow>

        {showConfirmation.show && (
          <div className="popup-container">
            <div className="popup-window">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete the selected
                {showConfirmation.type === "node"
                  ? "node"
                  : showConfirmation.type === "links"
                  ? "node with attached links"
                  : "edge"}
                ?
              </p>
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
    </>
  );
}

export default Flow;
