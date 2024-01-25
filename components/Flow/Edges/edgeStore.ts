import { create } from "zustand";
import { Edge } from "reactflow";
//import edges from "./flowchart1";

/* This is the store for managing the state of the edges in the present flowchart. */
export interface EdgeState {
  edges: Array<Edge>;
  updateEdges: (edges: Array<Edge>) => void;
  updateEdgeCSS: (id: string, CSS: Array<string>) => void;
  updateArrows: (id: string, bidirectional: boolean) => void;
  updateLabel: (id: string, newLabel: string) => void;
  deleteEdge: (edge: Edge) => void;
  addNewEdge: (edge: Array<Edge>) => void;
}

const edgeStore = create<EdgeState>((set) => ({
  edges: [],
  updateEdges: (edges) =>
    set((state): any => {
      return { edges: edges };
    }),
  deleteEdge: (edge: any) =>
    set((state) => {
      const to_be_updated = state.edges.filter((items) => items.id !== edge.id);
      return { edges: to_be_updated };
    }),
  updateEdgeCSS: (id, CSS) =>
    set((state) => {
      const old_edge = state.edges.filter((item) => item.id === id)[0];
      const to_be_updated = state.edges.filter((item) => item.id !== id);
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
      const updated_node = {
        ...edge,
        data: {
          ...edge.data,
          label: newLabel,
          tempLabel: newLabel.length <= 0 ? edge.data.label : "",
        },
      };
      // console.log(updated_node);
      return { edges: [...to_be_updated, updated_node] };
    }),
  addNewEdge: (newEdge: Array<Edge>) => {
    set((state) => {
      const restructuredEdgeData = newEdge.map((edge: Edge | any) => {
        const {
          id,
          label,
          bidirectional,
          boxCSS,
          pathCSS,
          selected,
          createdBy: { emailId },
          flowNodeConnection: { edges },
          ...EdgeData
        } = edge;
        const gethandleProperty = edges.reduce(
          (result: Edge, items: any, index: number) => {
            if (index === 0) {
              result.target = items.node.id;
              result.targetHandle = items.handle;
            } else {
              result.source = items.node.id;
              result.sourceHandle = items.handle;
            }
            return result;
          },
          {}
        );
        return {
          ...EdgeData,
          id,
          createdBy: emailId,
          data: {
            label,
            bidirectional,
            pathCSS,
            boxCSS,
          },
          ...gethandleProperty,
        };
      });
      const updatedEdge = [...state.edges, ...restructuredEdgeData];

      return { edges: updatedEdge };
    });
  },
}));

export default edgeStore;
