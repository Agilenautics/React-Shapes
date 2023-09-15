import React, { useCallback, useEffect, useState, useRef } from "react";
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
import CustomControls from "./CustomControls";
import { edgeTypeMap } from "./Edges/edgeTypes";
import nodeStore from "./Nodes/nodeStore";
import edgeStore from "./Edges/edgeStore";
import {
  deleteNodeBackend,
  findNode,
  getNode,
  updateNodeBackend,
  updatePosition,
} from "./Nodes/gqlNodes";
import {
  createFlowEdge,
  deleteEdgeBackend,
  updateEdgeBackend,
  updateEdgeMutation,
} from "./Edges/gqlEdges";
import fileStore from "../TreeView/fileStore";
import { NodeState } from "./Nodes/nodeStore";
import { EdgeState } from "./Edges/edgeStore";
import BreadCrumbs from "../Sidebar/BreadCrumbs";

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
  const deleteEdge = edgeStore((state) => state.deleteEdge);
  const [nodeId, setNodeId] = useState([]);

  const dragged = useRef(false);

  const [showConfirmation, setShowConfirmation] = useState(
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
      //@ts-ignore
      const selectedItems = showConfirmation.selectedItems;
      if (showConfirmation.type === "node") {
        //console.log(findNode(selectedItems));
        onNodesDelete(selectedItems);
      } else if (showConfirmation.type === "links") {
        //console.log(findNode(selectedItems));
        onNodesDelete(selectedItems);
      } else if (showConfirmation.type === "edge") {
        onDeleteEdge(selectedItems);
      }
      //@ts-ignore
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

  const onEdgeClick = (event:React.MouseEvent, edge: any) => {
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
          const linkA = node[0].data.linkedBy.flag;
          const linkB = node[0].data.links.flag;
          //.flowNode.nodeData.linked
          if (linkA || linkB) {
            setShowConfirmation({
              type: "links",
              show: true,
              // @ts-ignore
              selectedItems: selectedNodes,
            });
          } else {
            setShowConfirmation({
              type: "node",
              show: true,
              // @ts-ignore
              selectedItems: selectedNodes,
            });
          }
        } else if (selectedEdges.length > 0) {
          setShowConfirmation({
            type: "edge",
            show: true,
            // @ts-ignore
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
  function onNodesDelete(nodes: Array<Node>) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      deleteNodeBackend(element.id);
      deleteNode(element);
    }
  }

  const onNodeDrag = useCallback(() => {
    dragged.current = true;
  }, []);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (dragged.current) {
      updatePosition(node);
    }
    dragged.current = false;
  }, []);

  // const onSelectionChange = useCallback(() => {
  //   console.count("onSelectionChange");
  // }, []);

  // const onDrag = (event: any, node: Object) => {
  //   updatePosition(node);
  //   console.log(node);
  // };
  const onNodeClick = (e:React.MouseEvent, nodeData: any) => {
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
          //@ts-ignore
          edgeTypes={edgeTypeMap}
          nodeTypes={nodeTypeMap}
          connectionMode={ConnectionMode.Loose}
          onNodeDragStop={(event, node) => {
            updateNodes(getNodes());
            onNodeDragStop(event, node)
          }}
          onNodeDrag={onNodeDrag} //this event we dont want 
          // onNodeDragStop={}
          // onSelectionChange={onSelectionChange}
          // onNodeMouseMove={(event, node) => onDrag(event, node)}
          onNodesDelete={(selectedNodes) => onNodesDelete(selectedNodes)}
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
                  : // @ts-ignore
                  showConfirmation.type === "links"
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
