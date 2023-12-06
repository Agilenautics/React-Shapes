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
}

const edgeStore = create<EdgeState>((set) => ({
  edges: [],
  updateEdges: (edges) =>
    set((state): any => {
      const newEdgeData =  edges.map((item:any)=>{
        const source = item.flownodeConnectedby.id;
        const sourceHandle=item.flownodeConnectedbyConnection.handle;
        const target = item.connectedtoFlownode.id;
        const targetHandle = item.connectedtoFlownodeConnection.handle;
        const {id,label,pathCSS,boxCSS,bidirectional,...rest} =item
        return {...rest,data:{id,label,pathCSS,boxCSS,bidirectional},source,target,sourceHandle,targetHandle}
      })
      return { edges: newEdgeData };
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
      const updated_node = { ...edge, data: { ...edge.data, label: newLabel } };
      console.log(newLabel)
      return { edges: [...to_be_updated, updated_node] };
    }),
}));

export default edgeStore;
