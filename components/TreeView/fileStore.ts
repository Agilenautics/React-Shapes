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

// await getTreeNodeByUser(getMainByUser, userEmail);
// {
//   id: "ROOT",
//   name: "ROOT",
//   isOpen: true,
//   children: [
//     // {
//     //   id: "1",
//     //   name: "Clients",
//     //   type: "folder",
//     //   isOpen: true,
//     //   children: [
//     //     {
//     //       id: "4",
//     //       name: "Projects",
//     //       isOpen: true,
//     //       type: "folder",
//     //       children: [
//     //         {
//     //           id: "2",
//     //           name: "Flowchart 1",
//     //           type: "file",
//     //           flowchart: {
//     //             nodes: await getNodes(allNodes, "Flowchart 1"),
//     //             edges: [],
//     //           },
//     //           isOpen: true,
//     //         },
//     //         {
//     //           id: "3",
//     //           name: "Flowchart 2",
//     //           flowchart: {
//     //             nodes: await getNodes(allNodes, "Flowchart 2"),
//     //             edges: await getEdges(allEdges, "Flowchart 2"),
//     //           },
//     //         },
//     //         {
//     //           id: "80",
//     //           name: "Flowchart 3",
//     //           flowchart: {
//     //             // here iam changing empty array to calling get all edges and nodes
//     //             nodes:await getNodes(allNodes,"Flowchart 3"),
//     //             edges:await getEdges(allEdges, "Flowchart 3") ,
//     //           },
//     //         },
//     //       ],
//     //     },
//     //   ],
//     // },
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
          // @ts-ignore
          console.log(result);
          console.log(root.model.children);
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
      console.log(parentId);
      let data_chk = node?.model.type;
      console.log(data_chk);
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
          console.log(result);
          console.log(node?.parent.model);
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
        deleteFileBackend(id).then(() => {
          node?.drop();
        })
      }



      const x = searchTree(state.data, id);
      // ? Figure out how to make this work
      // node?.drop();

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
