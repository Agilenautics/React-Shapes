import create from "zustand";
import { Edge } from "react-flow-renderer";
import edges from "./flowchart1";

/* This is the store for managing the state of the edges in the present flowchart. */
interface EdgeState {
  edges: Array<Edge>;
  markerFill: Array<string>;
  updateEdges: (edges: Array<Edge>) => void;
  updateEdgeCSS: (id: string, CSS: Array<string>) => void;
  updateArrows: (id: string, bidirectional: boolean) => void;
  updateLabel: (id: string, newLabel: string) => void;
  // updateEdgeType: (id: string, newType: string) => void,
}

const edgeStore = create<EdgeState>((set) => ({
  edges: edges,
  markerFill: [
    "fill-node-green-200",
    "fill-node-red-200",
    "fill-node-blue-200",
    "fill-node-orange-200",
    "fill-node-purple-200",
  ],
  updateEdges: (edges) => set((state) => ({ edges: edges })),
  updateEdgeCSS: (id, CSS) =>
    set((state) => {
      const old_edge = state.edges.filter((item) => item.id === id)[0];
      const to_be_updated = state.edges.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = {
        ...old_edge,
        data: { ...old_edge.data, boxCSS: CSS[0], pathCSS: CSS[1] },
      };
      return { edges: [...to_be_updated, updated_node] };
    }),
  updateArrows: (id, bidirectional) =>
    set((state) => {
      const old_edge = state.edges.filter((item) => item.id === id)[0];
      const to_be_updated = state.edges.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = {
        ...old_edge,
        data: { ...old_edge.data, bidirectional: bidirectional },
      };
      return { edges: [...to_be_updated, updated_node] };
    }),
  updateLabel: (id, newLabel) =>
    set((state) => {
      const edge = state.edges.filter((item) => item.id === id)[0];
      const to_be_updated = state.edges.filter((item) => item.id !== id);
      //@ts-ignore
      const updated_node = { ...edge, data: { ...edge.data, label: newLabel } };
      return { edges: [...to_be_updated, updated_node] };
    }),
}));

export default edgeStore;
