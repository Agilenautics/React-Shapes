import { create } from "zustand";
import { Node } from "reactflow";
import {
  findNode,
  getNode,
  updateLinkedByMethod,
  updateLinkedBy,
  updateNodeData,
  updateLinksMutation,
  updateNodeBackend,
} from "./gqlNodes";
import { getFileByNode } from "../../TreeView/gqlFiles";

/* This is the store for managing the state of the nodes in the present flowchart. */

export interface NodeState {
  nodes: Array<Node>;
  addNode: (newNode: Node) => void;
  updateNodes: (nodes: Array<Node>) => void;
  deleteNode: (node: Node) => void;
  updateLabel: (id: string, newLabel: string) => void;
  updateShape: (id: string, newShape: string) => void;
  updateNodeType: (id: string, newType: string) => void;
  updateLinks: (id: string, newLink: Object) => void;
  toggleDraggable: (id: string, draggable: boolean) => void;
  updateLinkedBy: (id: string, LinkedBy: Object, getNodeQuery: any) => void;
  breadCrumbs: Array<Node>;
  updateBreadCrumbs: (breadCrumbs: Object, id: string, action: string) => void;
  updateDescription: (id: string, description: string) => void;
  fileId: string;
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
        links: {},
      },
      position: { x: 0, y: 0 },
      type: "WelcomeNode",
      draggable: false,
    },
  ],
  fileId: "",
  breadCrumbs: [],
  updateBreadCrumbs: (data: any, id: any, action: string) => {
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
    set((state) => ({
      nodes: [...state.nodes, { ...newNode, id: newNode.id }],
    })),
  updateNodes: (nodes) =>
    set((state) => {
      // const updated_nodes = state.nodes.map(obj => [node].find(o => o.id === obj.id) || obj); // ? This code is basically magic, but very cool
      return { nodes: nodes };
    }),
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
      updateNodeData(updated_node, updateLinksMutation);
      return { nodes: [...to_be_updated, updated_node] };
    });
  },
  updateLabel: (id: string, newLabel: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = {
        ...old_node,
        data: { ...old_node.data, label: newLabel },
      };
      updateNodeData(updated_node, updateLinksMutation);
      return { nodes: [...to_be_updated, updated_node] };
    }),
  updateShape: (id: string, newShape: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = {
        ...old_node,
        data: { ...old_node.data, shape: newShape },
      };
      updateNodeData(updated_node, updateLinksMutation);
      return { nodes: [...to_be_updated, updated_node] };
    }),
  updateNodeType: (id: string, newType: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = { ...old_node, type: newType };
      updateNodeBackend(updated_node);
      return { nodes: [...to_be_updated, updated_node] };
    }),
  updateLinks: async (
    id,
    newLink // add flowchart variable
  ) => {
    //find data of new node
    const node_to_be = await findNode(getNode, id);
    //save data of new node
    const new_node = node_to_be[0];
    //add the saved data to the node to be replaced
    set((state): any => {
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      const updated_node = {
        ...new_node,
        data: { ...new_node.data, links: newLink, id },
      };
      updateNodeData(updated_node, updateLinksMutation);
      return { nodes: [...to_be_updated, updated_node] };
    });
  },
  updateLinkedBy: async (id: string, linkedBy: any, getNodeQuery: any) => {
    const node_to_be = await findNode(getNode, id);
    //save data of new node

    const { data } = await getFileByNode(id, getNodeQuery);
    const nodes = JSON.stringify(data.files[0].hasflowchart.nodes)
      .replaceAll('"hasdataNodedata":', '"data":')
      .replaceAll('"haspositionPosition":', '"position":');
    const nodesData = JSON.parse(nodes);
    const new_node = node_to_be[0];
    //add the saved data to the node to be replaced

    const to_be_updated = nodesData.filter((item: any) => item.id !== id);

    const updated_node = {
      ...new_node,
      data: { ...new_node.data, linkedBy: linkedBy },
    };
    await updateLinkedByMethod(updated_node, updateLinkedBy);
    set((state): any => {
      // const to_be_updated = nodesData.filter((item: any) => item.id !== id);

      // const updated_node = {
      //   ...new_node,
      //   data: { ...new_node.data, linkedBy: linkedBy },
      // };
      return Object.entries({ nodes: [...to_be_updated, updated_node] });
      // return { nodes: [...to_be_updated, updated_node] }
    });
  },
  toggleDraggable: (id: string, draggable: boolean) =>
    set((state) => {

      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = { ...old_node, draggable: draggable };
      return { nodes: [...to_be_updated, updated_node] };
    }),
}));

export default nodeStore;
