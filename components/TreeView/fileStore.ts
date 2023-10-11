import { create } from "zustand";
// @ts-ignore
import TreeModel from "tree-model-improved";
import { MyData, findById } from "./backend";
import {
  createFolderInMain,
  newFolderInMain,
  createFolderInFolder,
  newFolderInFolder,
  createFileInFolder,
  newFileInFolder,
  createFileInMain,
  newFileInMain,
  Folder,
} from "./gqlFiles";


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
  idofUid: string,
  updateLinkNodeId: (nodeId: string) => void;
  Id: string;
  name: string;
  // updateCurrentId: (Id: string) => void;
  currentFlowchart: string;
  updateCurrentFlowchart: (currentFlowchart: string, Id: string) => void;
  linkNodes: { nodes: any; fileID: string };
  updateLinkNodes: (nodes: Object, fileID: string) => void;
  add_file: () => void;
  add_folder: (newFolder:Folder) => void;
  delete_item: (id: string) => void;
  find_file: (id: string) => MyData;
  loading: boolean;
  setLoading: (load: boolean) => void;
  uid: number
  updateUid: (uid: Array<any>) => void;
}
const fileStore = create<files>((set) => ({
  // @ts-ignore
  data: {},
  uid: 0,
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
  add_file: () => {
    set((state) => {
      let parentId = state.Id;
      let root = new TreeModel().parse(state.data);
      let node = findById(root, parentId);
      const projectId = state.data.id



      let data_chk = node?.model;




      if (node?.model.type === "folder") {
        const data = {
          name: "New File",
          description: "Custome description",
          status: "To-Do",
          uid: state.uid
        }
        const updated_data = [...node.model.children, data];
        const updated_file_in_folder = { ...node.model, children: updated_data };
        const updated_main = { ...state.data, children: [updated_file_in_folder] }
        // return { data: updated_main }


        createFileInFolder(newFileInFolder, parentId, data).then((result) => {
          node?.model.children?.push({
            name: result.name,
            id: result.id,
            type: result.type,
            uid: result.uid
          });
        });
      } else {
        // parentId = root.model.id;
        const data = {
          name: "FileInMain",
          status: "To-Do",
          description: "Custome description",
          uid: state.uid
        }
        const updated_data = [...root.model.children, data];
        createFileInMain(newFileInMain, parentId, data).then((result) => {
          root.model.children?.push({
            name: result.name,
            id: result.id,
            type: result.type,
            uid: result.uid
          });
        });

        const updated_main = { ...state.data, children: updated_data }
        return { data: updated_main }
      }

      return { data: state.data };
    })
  }
  ,

  add_folder: (newFolder:Folder) =>
    set((state) => {
      const updatedData = {
        ...newFolder,
        children:[],
        hasFile:[],
        hasFolder:[]
      }
      let root = new TreeModel().parse(state.data);
      const getChildren = root.model?.children;
      const getFolder =root.model?.hasContainsFolder;
      const to_be_update = [updatedData,...getChildren];
      const updatedFolders = [...getFolder,updatedData];
      const updatedState = {...state.data,children:to_be_update,hasContainsFolder:updatedFolders}
      console.log(updatedState)
      return { data: updatedState };
    }),

  // ? This function seems to work, but may contain bugs w.r.t. state
  delete_item: (id: string) =>
    set((state) => {
      const root = new TreeModel().parse(state.data);
      const node = findById(root, id);
      if (node?.model.type === "folder") {
        const to_be_deleted = state.data.children?.filter((value) => value.id !== id);
        // @ts-ignore
        const hasFolder = state.data.hasContainsFolder.filter((value: any) => value.id !== id);
        const updated_children = { ...state.data, children: to_be_deleted, hasContainsFolder: hasFolder };
        return { data: updated_children }
      } else if (node?.model.type === "file") {
        //  if file in folder
        const getParentId = node.parent?.model.id;
        const getParent = node.parent?.model
        const removeFileParent = getParent.children.filter((values: any) => values.id !== id);
        const to_be_updateParent = { ...getParent, children: removeFileParent, hasFile: removeFileParent };
        const updated_parent_children = state.data.children?.map((values) => {
          if (values.id === getParentId) {
            return {
              ...to_be_updateParent
            }
          }
          return values
        });
        const to_be_deleted = state.data.children?.filter((value) => value.id !== id);
        const flag = to_be_deleted?.length === state.data.children?.length
        // file in folder
        const updated_state = { ...state.data, children: updated_parent_children }
        // if its file in main
        const updated_children = { ...state.data, children: to_be_deleted, hasContainsFile: to_be_deleted, }
        // deleteFileBackend(id)
        const updatedValues = flag ? updated_state : updated_children;
        return { data: updatedValues }
      }
      const x = searchTree(state.data, id);
      // ? Figure out how to make this work
      const drp = node?.drop();
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

      const root = new TreeModel().parse(state.data);
      const node = findById(root, id);
      if (node) {
        node.model = updatedFile;
      }
      return { data: root.model };
    }),

  updateUid: (collectionofIds: Array<any>) =>
    set((state) => {
      const arrayOfUids = collectionofIds.map((values) => values.uid);
      let uid = arrayOfUids.reduce((a, b) => Math.max(a, b), 0);
      const filterUids = collectionofIds.filter((values) => values.uid === uid)[0]
      let updated_uid = uid === 0 ? 1 : uid
      return { uid: updated_uid, idofUid: filterUids.id }
    }),
  loading: true,
  setLoading: (load: boolean) =>
    set((state) => {
      return { loading: load }
    }
    )
}));

export default fileStore;
