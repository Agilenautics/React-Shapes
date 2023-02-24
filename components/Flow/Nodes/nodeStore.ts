import create from "zustand";
import { Node } from "react-flow-renderer";
import { getNodes,findNode, allNodes } from "./gqlNodes" ;


/* This is the store for managing the state of the nodes in the present flowchart. */

interface NodeState {
  nodes: Array<Node>;
  addNode: (newNode: Node) => void;
  updateNodes: (nodes: Array<Node>) => void;
  deleteNode: (node: Node) => void;
  updateLabel: (id: string, newLabel: string) => void;
  updateShape: (id: string, newShape: string) => void;
  updateNodeType: (id: string, newType: string) => void;
  updateLinks: (id: string, newLink: Object, flowchart: string) => void;
  toggleDraggable: (id: string, draggable: boolean) => void;
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
  addNode: (newNode) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        { ...newNode, id: Math.floor(Math.random() * 1000 + 1).toString() },
      ],
    })),
  updateNodes: (nodes) =>
    set((state) => {
      // const updated_nodes = state.nodes.map(obj => [node].find(o => o.id === obj.id) || obj); // ? This code is basically magic, but very cool
      return { nodes: nodes };
    }),
  deleteNode: (node) =>
    set((state) => {
      const updated_nodes = state.nodes.filter((item) => item.id !== node.id);
      return { nodes: updated_nodes };
    }),
  updateLabel: (id: string, newLabel: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = {
        ...old_node,
        data: { ...old_node.data, label: newLabel },
      };
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
      return { nodes: [...to_be_updated, updated_node] };
    }),
  updateNodeType: (id: string, newType: string) =>
    set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = { ...old_node, type: newType };
      return { nodes: [...to_be_updated, updated_node] };
    }),
  updateLinks: async (id, newLink, flowchart) =>  // add flowchart variable
    {
      //find data of new node
      const node_to_be= await findNode(allNodes, flowchart, id);
      console.log(node_to_be[0]);
      //save data of new node
      const new_node=node_to_be[0];
      //add the saved data to the node to be replaced
      set((state) => {
      const old_node = state.nodes.filter((item) => item.id === id)[0];
      //const [node_to_be]= await async findNode(allNodes, flowchart, id);
      console.log(state);//only works with the flowchart we are on - does not work with a different flowchart

      const to_be_updated = state.nodes.filter((item) => item.id !== id);
      console.log(state.nodes.filter((item) => item.data.flowchart === "Flowchart 1"));//only works with the flowchart we are on - does not work with a different flowchart
      //@ts-ignore
      const updated_node = {...new_node,
        data: { ...new_node.data, links: newLink },
      };
      console.log({ nodes: [...to_be_updated, updated_node] });
      //newNodes={ nodes: [...to_be_updated, updated_node] }
      return Object.entries({ nodes: [...to_be_updated, updated_node] });
    })},
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
