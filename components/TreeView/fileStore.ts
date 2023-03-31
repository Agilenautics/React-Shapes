import create from "zustand";
import TreeModel from "tree-model-improved";
import { MyData, findById } from "./backend";
import nodes1 from "../Flow/Nodes/flowchart1";
import nodes2 from "../Flow/Nodes/flowchart2";
import edges1 from "../Flow/Edges/flowchart1";
import edges2 from "../Flow/Edges/flowchart2";
import { findNode, allNodes, getNodes } from "../Flow/Nodes/gqlNodes";
import { allEdges, getEdges } from "../Flow/Edges/gqlEdges"; 
import { createFolderInMain, newFolderInMain,createFolderInFolder,newFolderInFolder,
  getInitData,getTreeNode,createFileInFolder,newFileInFolder, deleteFileBackend, deleteFolderBackend, 
  createFileInMain,newFileInMain } from "./gqlFiles";

const initData = await getTreeNode(getInitData);
// {
//   id: "ROOT",
//   name: "ROOT",
//   isOpen: true,
//   children: [
//     {
//       id: "1",
//       name: "Clients",
//       type: "folder",
//       isOpen: true,
//       children: [
//         {
//           id: "4",
//           name: "Projects",
//           isOpen: true,
//           type: "folder",
//           children: [
//             {
//               id: "2",
//               name: "Flowchart 1",
//               type: "file",
//               flowchart: {
//                 nodes: await getNodes(allNodes, "Flowchart 1"),
//                 edges: edges1,
//               },
//               isOpen: true,
//             },
//             {
//               id: "3",
//               name: "Flowchart 2",
//               flowchart: {
//                 nodes: await getNodes(allNodes, "Flowchart 2"),
//                 edges: await getEdges(allEdges, "Flowchart 2"),
//               },
//             },
//             {
//               id: "80",
//               name: "Flowchart 3",
//               flowchart: {
//                 // here iam changing empty array to calling get all edges and nodes
//                 nodes:await getNodes(allNodes,"Flowchart 3"),
//                 edges:await getEdges(allEdges, "Flowchart 3") ,
//               },
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "6",
//       name: "Other Projects",
//       isOpen: true,
//       type: "folder",
//       children: [],
//     },
//   ],
// };

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
  Id: string;
  // updateCurrentId: (Id: string) => void;
  currentFlowchart: string;
  updateCurrentFlowchart: (currentFlowchart: string, Id: string) => void;
  linkNodes: { nodes: any; fileID: string };
  updateLinkNodes: (nodes: Object) => void;
  add_file: () => void;
  add_folder: () => void;
  delete_item: (id: string) => void;
  find_file: (id: string) => MyData;
}
const fileStore = create<files>((set) => ({
  // @ts-ignore
  data: initData[0],
  // Id: "",
  currentFlowchart: "",
  updateCurrentFlowchart: (currentFlowchart, Id) =>
    set((state) => {
      return { currentFlowchart: currentFlowchart, Id: Id };
    }),
  linkNodes: { nodes: {}, fileID: "" },
  updateLinkNodes: (nodes) =>
    set((state) => {
      console.log(nodes)
      return { linkNodes: { nodes: nodes, fileID: state.linkNodes.fileID } };
    }),
  add_file: () =>
    set((state) => {
      
      let parentId = state.Id;
      let root = new TreeModel().parse(state.data);
      console.log(root,"root");
      let node = findById(root, parentId);
      console.log(node)
      console.log(node?.model)
      // console.log("Type of node.model : ", typeof(node?.model))
      let data_chk = node?.model;
      // console.log("Type of data_chk : ", typeof(data_chk))
      // console.log(state.data.children);
      console.log(node?.model.type)
      console.log(parentId);
      if (node?.model.type === "folder") {
       createFileInFolder(newFileInFolder,parentId);
      
      }
      else {
        console.log(parentId);
        createFileInMain(newFileInMain,parentId);
      };
      
      return { data: state.data };
    }),
  
  add_folder: () =>
    set((state) => {
       
      let parentId = state.Id;
      let root = new TreeModel().parse(state.data);
      let node = findById(root, parentId);
      console.log(parentId);
      let data_chk = node?.model.type;
      console.log(data_chk);
      if (node?.model.type === "folder") {
        
        console.log(state.data.id);
        console.log("in folder",parentId)
        createFolderInFolder(newFolderInFolder,parentId);
        
      }
      else {
        console.log(parentId);
        createFolderInMain(newFolderInMain,parentId);
       
      };


      
      return { data: state.data };
    }),

  // ? This function seems to work, but may contain bugs w.r.t. state
  delete_item: (id: string) =>
    set((state) => {
      const root = new TreeModel().parse(state.data);
      const node = findById(root, id);
      node?.drop();
      const x = searchTree(state.data, "1");
      console.log(x);
      // ? Figure out how to make this work
      // const nodes = nodeStore((state) => state.nodes);
      // console.log(nodes);
      deleteFileBackend(id);
       deleteFolderBackend(id);
      return { data: state.data };
    }),
  find_file: (id: string) => {
    var x = {};
    set((state) => {
      // ? Replace this function with findById when I implement any database
      const targetNode = searchTree(state.data, id);
      x = targetNode;
      return {};
    });
    return x as MyData;
  },
}));

export default fileStore;
