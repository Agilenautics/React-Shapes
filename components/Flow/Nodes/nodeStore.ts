import { create } from "zustand";
import { Edge, Node } from "reactflow";
import {
  findNode,
  //updateLinkedByMethod,
  updateNodeData,
  updateNodeBackend,
  // updateLinkedBy,
  //updateLinkedToMutation,
  //getFileByNode,
  GET_NODES,
  UPDATE_NODE,
  GET_NODE_BY_ID,
} from "../../../gql";

/* This is the store for managing the state of the nodes in the present flowchart. */

export interface NodeState {
  nodes: Array<any>;
  addNode: (newNode: Array<Node>) => void;
  updateNodes: (nodes: Array<Node>) => void;
  deleteNode: (node: Node) => void;
  updateLabel: (id: string, newLabel: string) => void;
  updateShape: (id: string, newShape: string) => void;
  updateNodeType: (id: string, newType: string) => void;
  toggleDraggable: (id: string, draggable: boolean) => void;
  breadCrumbs: Array<Node>;
  updateBreadCrumbs: (breadCrumbs: Object, id: string, action: string) => void;
  updateDescription: (id: string, description: string) => void;
  updateNodePosition: (node: Node) => void;
  deleteLinkeNode: (id: string, nodeId: string) => void;
  fileId: string;
  addLinkNode: (id: string, nodeData: Node, anotherNodeId: string) => void;
}

const nodeStore = create<NodeState>((set) => ({
  nodes: [
    {
      id: "1",
      data: {
        label:
          "Welcome!\nTo get started, use the sidebar button on the top left.",
        shape: "rectangle",
        description: "",
        hasLinkedTo: {},
      },
      position: { x: 0, y: 0 },
      type: "customNode",
      draggable: false,
      selected: false,
    },
  ],
  fileId: "",
  breadCrumbs: [],
  updateBreadCrumbs: (data: any, id: string, action: string) => {
    switch (action) {
      case "new":
        set((state) => {
          return { breadCrumbs: [data.name] };
        });
      case "push":
        set((state) => {
          const breadCrumbs = [...state.breadCrumbs, data.name];
          const uniqueValue = new Set(breadCrumbs);
          if (state.fileId !== id) {
            const datas = [[breadCrumbs, ...uniqueValue]];
          }
          return { breadCrumbs: [...uniqueValue], fileId: id };
        });
      default:
        set((state) => {
          return { breadCrumbs: state.breadCrumbs };
        });
    }
  },
  addNode: (newNode) =>
    set((state) => {
      const updatedNode = newNode.map((item: any) => {
        const description = item.hasInfo.description;
        const { x, y, label, shape, nodeColor, isLinked, ...rest } = item;

        return {
          ...rest,
          data: { label, shape, description, nodeColor, isLinked },
          position: { x, y },
          type: "customNode",
        };
      });
      return {
        nodes: [...state.nodes, ...updatedNode],
      };
    }),
  updateNodes: (nodes) =>
    set((state) => {
      const newData = nodes.map((item: any) => {
        const description = item.hasInfo.description;
        const { x, y, label, nodeColor, shape, isLinked, flowEdge, ...rest } =
          item;
        return {
          ...rest,
          data: {
            label,
            shape,
            nodeColor,
            description,
            isLinked,
          },
          position: { x, y },
          type: "customNode",
        };
      });
      return { nodes: newData };
    }),
  updateNodePosition: (node: Node) => {
    set((state) => {
      const { id, position } = node;
      const updatedNodes = state.nodes.map((node: Node) => {
        if (node.id === id) {
          return {
            ...node,
            position,
          };
        }
        return {
          ...node,
        };
      });
      return { nodes: updatedNodes };
    });
  },
  deleteNode: (node) => {
    set((state) => {
      const updated_nodes = state.nodes.filter((item) => item.id !== node.id);
      return { nodes: updated_nodes };
    });
  },
  updateDescription: (id: string, newDescription: string) => {
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      const updated_node = {
        ...old_node,
        data: { ...old_node.data, description: newDescription },
      };
      return { nodes: [...to_be_updated, updated_node] };
    });
  },
  updateLabel: (id: string, newLabel: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      const updated_node = {
        ...old_node,
        data: { ...old_node.data, label: newLabel },
      };
      if (!old_node.data?.label || old_node.data.label !== newLabel) {
        updateNodeData(updated_node, UPDATE_NODE, GET_NODES, state.fileId);
      }

      return { nodes: [...to_be_updated, updated_node] };
    }),
  updateShape: (id: string, newShape: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);

      const updated_node = {
        ...old_node,
        data: { ...old_node.data, shape: newShape },
      };

      //if the node has been changed from a non-default shape to default or vice versa we need to trigger an update in linkedTo mut
      //if the node has a different shape or no shape at all we need to update it in the database
      if (
        (!old_node.data?.shape && newShape) ||
        old_node.data?.shape !== newShape
      ) {
        updateNodeData(updated_node, UPDATE_NODE, GET_NODES, state.fileId);
      }
      return { nodes: [...to_be_updated, updated_node] };
    }),
  updateNodeType: (id: string, nodeColor: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      const updated_node = {
        ...old_node,
        data: { ...old_node.data, nodeColor },
      };
      // updateNodeData(updated_node, UPDATE_NODE, GET_NODES, state.fileId);
      return { nodes: [...to_be_updated, updated_node] };
    }),
  toggleDraggable: (id: string, draggable: boolean) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      const updated_node = { ...old_node, draggable: draggable };
      return { nodes: [...to_be_updated, updated_node] };
    }),
  addLinkNode: (nodeId: string, node: Node, anotherNodeId: string) =>
    set((state) => {
      const getNode = state.nodes.find((nodeItem) => nodeItem.id === nodeId);
      const to_be_updated = {
        ...getNode,
        data: {
          ...getNode.data,
          isLinked: [...node.isLinked],
        },
      };
      const updatedNodes = state.nodes.map((item: Node) => {
        if (item.id === nodeId) {
          return {
            ...to_be_updated,
          };
        }
        return {
          ...item,
        };
      });
      return { nodes: updatedNodes };
    }),
  deleteLinkeNode: (id: string, nodeId: string) =>
    set((state) => {
      const getNode = state.nodes.find((node: Node) => node.id === id);
      const removeLinkedNode = getNode.data.isLinked.filter(
        (node: Node) => node.id !== nodeId
      );
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isLinked: removeLinkedNode,
            },
          };
        }
        return {
          ...node,
        };
      });
      return { nodes: updatedNodes };
    }),
}));

export default nodeStore;
