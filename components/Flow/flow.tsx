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
  Panel,
  Background,
  BackgroundVariant,
} from "reactflow";
import { nodeType } from "./Nodes/nodeTypes";
import ConnectionLine from "./ConnectionLine";
import { edgeTypeMap } from "./Edges/edgeTypes";
import nodeStore from "./Nodes/nodeStore";
import edgeStore from "./Edges/edgeStore";
import {
  GET_NODES,
  DELETE_NODE,
  deleteNodeBackend,
  findNode,
  GET_NODE_BY_ID,
  updatePosition,
  UPDATE_NODE_POSITION,
  createFlowEdge,
  deleteEdgeBackend,
  GET_FILES_FOLDERS_BY_PROJECT_ID,
  ADD_EDGE,
  DELETE_EDGE,
  getTreeNodeByUser,
} from "../../gql";
import fileStore from "../TreeView/fileStore";
import userStore from "../AdminPage/Users/userStore";
import { ApolloQueryResult } from "@apollo/client";
import CustomMiniMap from "./CustomMiniMap";

import CustomControls from "./CustomControls";
const defaultEdgeOptions = {
  type: "customEdge",
  data: {
    label: "",
    pathCSS: "#1F2937",
    boxCSS: "border-node-green-100 bg-node-green-50 text-node-green-200",
    bidirectional: false,
  },
};
const defaultNodeOptions = {
  type: "customNode",
  data: {
    label: "New Node",
    shape:"rectangle",
    nodeColor:"#1F2937"
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
  const {
    nodes: defaultNodes,
    updateNodes,
    deleteNode,
    updateNodePosition,
  } = nodeStore();
  const {
    edges: defaultEdges,
    updateEdges,
    deleteEdge,
    addNewEdge,
  } = edgeStore();
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [edges, setEdges] = useState<Edge[]>(defaultEdges);
  const {
    currentFlowchart,
    Id: fileId,
    updateLinkNodeId,
    setLoading,
    updateInitData,
  } = fileStore();
  const { userEmail } = userStore();

  const dragged = useRef(false);

  const getProjectId = async (id: string) => {
    const initData = await getTreeNodeByUser(
      GET_FILES_FOLDERS_BY_PROJECT_ID,
      id,
      setLoading
    );
    const data = initData[0];
    //@ts-ignore
    updateInitData(data);
    return initData;
  };

  useEffect(() => {
    if (projectId) {
      getProjectId(projectId);
    }
  }, [projectId]);

  const [showConfirmation, setShowConfirmation] = useState<any>(
    defaultShowConfirmation
  );
  const onDeleteEdge = (edge: Array<Edge>) => {
    edge.map(async (curEle: any) => {
      deleteEdge(curEle);
      deleteEdgeBackend(curEle.id, DELETE_EDGE, GET_NODES, fileId);
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
        // nodeData.map((curEle: any) => {
        //   setNodeId(curEle);
        // });
        return applyNodeChanges(changes, nds);
      }),
    [defaultNodes, setNodes, updateNodes, currentFlowchart]
  );

  // useEffect(() => {
  //   if (edgeId && edgeId.length !== 0) {
  //     const newEdgeData = defaultEdges.filter(
  //       (value: any) => value.id === edgeId
  //     );
  //     newEdgeData.map((curEle) => {
  //       if (fileId) {
  //         console.log(fileId,"flow")
  //         updateEdgeBackend(UPDATE_EDGE, curEle, GET_NODES, fileId);
  //       }
  //     });
  //   }
  // }, [defaultEdges, edgeId]);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => {
        return applyEdgeChanges(changes, eds);
      }),
    []
  );

  const onConnect = useCallback(
    async (newEdge: Connection) => {
      const edgeResponse = await createFlowEdge(
        newEdge,
        userEmail,
        ADD_EDGE,
        GET_NODES,
        fileId
      );
      // console.log(userEmail);
      addNewEdge(edgeResponse?.data.createFlowEdges.flowEdges);
      setEdges((eds) => {
        return addEdge(newEdge, eds);
      });
    },
    [setEdges, getEdges, userEmail]
  );

  useEffect(() => {
    const handleBackspace = async (event: { key: string }) => {
      const focusedElement = document.activeElement;
      const isTextFieldFocused =
        focusedElement instanceof HTMLInputElement ||
        focusedElement instanceof HTMLTextAreaElement;

      if (
        !isTextFieldFocused &&
        (event.key === "Backspace" || event.key === "Delete")
      ) {
        const selectedNodes = getNodes().filter((node) => node.selected);
        //@ts-ignore
        const selectedEdges = getEdges().filter((edge) => edge.selected);
        if (selectedNodes.length > 0) {
          const node = await findNode(GET_NODE_BY_ID, selectedNodes[0].id);
          //@ts-ignore
          const linkA = node.data.flowNodes[0].isLinked;
          //@ts-ignore

          const linkB = "";
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
          //}
          //else if (selectedEdges.length > 0) {
          setShowConfirmation({
            type: "node",
            show: true,
            selectedItems: selectedNodes,
          });
        }
        //}
        //else if (selectedEdges.length > 0) {
        // setShowConfirmation({
        //   type: "edge",
        //   show: true,
        //   selectedItems: selectedEdges,
        // });
        // }
        // else {
        // setShowConfirmation(defaultShowConfirmation);
      }
    };
    // };

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
          DELETE_NODE,
          GET_NODES,
          fileId,
          projectId,
          GET_FILES_FOLDERS_BY_PROJECT_ID
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
          await updatePosition(node, UPDATE_NODE_POSITION, GET_NODES, fileId);
          updateNodePosition(node);
        }
        dragged.current = false;
      } catch (error) {
        console.log(error, "while dragging the node");
      }
    },
    [fileId]
  );

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
  // const edgeUpdate = (e:any,edge:Connection)=>{
  //   console.log(e,edge)

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
          // onEdgeUpdate={(e,edgeData)=>edgeUpdate(e,edgeData)}
          defaultNodes={defaultNodes} // This part is because the nodes wern't draggable
          nodes={defaultNodes}
          edges={defaultEdges}
          defaultEdgeOptions={defaultEdgeOptions}
          //defaultNodeOptions={defaultNodeOptions}

          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          connectionLineComponent={ConnectionLine}
          snapGrid={snapGrid}
          zoomOnDoubleClick={false}
          edgeTypes={edgeTypeMap}
          nodeTypes={nodeType}
          connectionMode={ConnectionMode.Loose}
          onNodeDragStop={(event, node) => {
            // updateNodes(getNodes());
            onNodeDragStop(event, node);
          }}
          onNodeDrag={onNodeDrag} //this event we dont want
          onNodesDelete={(selectedNode) => onNodesDelete(selectedNode)}
          onEdgesDelete={(selectedEdge) => onDeleteEdge(selectedEdge)}
          onNodeClick={onNodeClick}
          // deleteKeyCode={[]}
        >
          {/* <Controls className="" />
          <MiniMap zoomable position="right-bottom" /> */}
          {/* <Controls className="" /> */}
          {/* <CustomControls /> */}
          <Background variant={BackgroundVariant.Dots} gap={16} />
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
