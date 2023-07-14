import { create } from "zustand";
// @ts-ignore
import TreeModel from "tree-model-improved";
import { MyData, findById } from "./backend";
import { findNode, allNodes, getNodes } from "../Flow/Nodes/gqlNodes";
import { allEdges, getEdges } from "../Flow/Edges/gqlEdges";
import {
  createFolderInMain,
  newFolderInMain,
  createFolderInFolder,
  newFolderInFolder,
  // getInitData,
  // getTreeNode,
  createFileInFolder,
  newFileInFolder,
  deleteFileBackend,
  deleteFolderBackend,
  createFileInMain,
  newFileInMain,
  getTreeNodeByUser,
  getMainByUser
} from "./gqlFiles";
import { auth } from "../../auth";

const userEmail = auth.currentUser?.email || "";

function searchTree(element: any, matchingTitle: any): any {
  if (element.id == matchingTitle) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], matchingTitle);
    }
    return result;
  }
  return null;
}

interface files {
  data: MyData;
  updateInitData: (data: MyData) => void;
  linkNodeId: string;
  updateLinkNodeId: (nodeId: string) => void;
  Id: string;
  name: string;
  // updateCurrentId: (Id: string) => void;
  currentFlowchart: string;
  updateCurrentFlowchart: (currentFlowchart: string, Id: string) => void;
  linkNodes: { nodes: any; fileID: string };
  updateLinkNodes: (nodes: Object, fileID: string) => void;
  add_file: () => void;
  add_folder: () => void;
  delete_item: (id: string) => void;
  find_file: (id: string) => MyData;
}
const fileStore = create<files>((set) => ({
  // @ts-ignore
  data: {},
  updateInitData: (data: MyData) =>
    set((state) => {
      return { data }
    }),
  linkNodeId: "",
  // Id: "",
  currentFlowchart: "",
  updateCurrentFlowchart: (currentFlowchart, Id) =>
    set((state) => {
      return { currentFlowchart: currentFlowchart, Id: Id };
    }),
  linkNodes: { nodes: {}, fileID: "" },
  updateLinkNodes: (nodes, id) =>
    set((state) => {
      return { linkNodes: { nodes: nodes, fileID: id } };
    }),
  updateLinkNodeId(nodeId) {
    set((state) => {
      return { linkNodeId: nodeId }
    })
  },
  add_file: () =>
    set((state) => {
      let parentId = state.Id;
      let root = new TreeModel().parse(state.data);
      let node = findById(root, parentId);

      let data_chk = node?.model;

      if (node?.model.type === "folder") {
        createFileInFolder(newFileInFolder, parentId).then((result) => {
         

          node?.model.children?.push({
            name: result.name,
            id: result.id,
            type: result.type,
          });
        
        });
      } else {
        parentId = root.model.id;
        createFileInMain(newFileInMain, parentId).then((result) => {
         
         
          root.model.children?.push({
            name: result.name,
            id: result.id,
            type: result.type,
          });
        });

      }

      return { data: state.data };
    }),

  add_folder: () =>
    set((state) => {
      let parentId = state.Id;
      let root = new TreeModel().parse(state.data);
      let node = findById(root, parentId);
      
      let data_chk = node?.model.type;
      
      if (node?.model.type === "folder") {
        createFolderInFolder(newFolderInFolder, parentId).then((result) => {
          node?.model.children?.push({
            id: result.id,
            name: result.name,
            type: result.type,
            isOpen: result.isOpen,
            children: [],
          });
        });

      } else {
        parentId = root.model.id;
        createFolderInMain(newFolderInMain, parentId).then((result) => {
          
          root.model.children?.push({
            id: result.id,
            name: result.name,
            type: result.type,
            isOpen: result.isOpen,
            children: [],
          });

        });

      }

      return { data: state.data };
    }),

  // ? This function seems to work, but may contain bugs w.r.t. state
  delete_item: (id: string) =>
    set((state) => {
      const root = new TreeModel().parse(state.data);
      const node = findById(root, id);
      if (node?.model.type === "folder") {
        deleteFolderBackend(id)
        node?.drop();
      } else if (node?.model.type === "file") {
        deleteFileBackend(id)
          node?.drop();
        
      }



      const x = searchTree(state.data, id);
      // ? Figure out how to make this work
      // node?.drop();
      
      return { data: state.data };
    }),
  find_file: (id: string) => {
    var x = {};
    set((state) => {
      
      const targetNode = searchTree(state.data, id);
      x = targetNode;
      return {};
    });
    return x as MyData;
  },
  
  update_file: (id: string, updatedFile: MyData) =>
  set((state) => {
    console.log(state);
    
    const root = new TreeModel().parse(state.data);
    const node = findById(root, id);
    if (node) {
      node.model = updatedFile;
    }
    return { data: root.model };
  }),
}));

export default fileStore;
