import { create } from "zustand";
// @ts-ignore
import TreeModel from "tree-model-improved";
import { MyData, findById } from "./backend";
import { Folder } from "../../gql";
import { File } from "../../lib/appInterfaces";

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
  idofUid: string;
  updateLinkNodeId: (nodeId: string) => void;
  Id: string;
  name: string;
  // updateCurrentId: (Id: string) => void;
  currentFlowchart: string;
  updateCurrentFlowchart: (currentFlowchart: string, Id: string) => void;
  linkNodes: { nodes: any; fileID: string };
  updateLinkNodes: (nodes: Array<Node | any>, fileID: string) => void;
  add_file: (newFile: File) => void;
  add_folder: (newFolder: Folder) => void;
  delete_item: (id: string) => void;
  find_file: (id: string) => MyData;
  update_file: (id: string, updatedFile: MyData) => void;
  loading: boolean;
  setLoading: (load: boolean) => void;
  uid: number;
  updateUid: (uid: Array<any>) => void;
}
const fileStore = create<files>((set) => ({
  // @ts-ignore
  data: {},
  uid: 0,
  updateInitData: (data: MyData) =>
    set((state) => {
      return { data };
    }),
  linkNodeId: "",
  // Id: "",
  currentFlowchart: "",
  updateCurrentFlowchart: (currentFlowchart, Id) =>
    set((state) => {
      let root = new TreeModel().parse(state.data);
      // let node = findById(root, Id);
      // if (node?.model.type === "folder") {
      //   return { currentFlowchart, Id }
      // } else {
      //   return { currentFlowchart, Id: "" }
      // }
      return { currentFlowchart, Id };
    }),
  linkNodes: { nodes: {}, fileID: "" },
  updateLinkNodes: (nodes: Array<Node>, id: string) =>
    set((state) => {
      const newData = nodes.map((item: any) => {
        const description = item.hasInfo?.description;
        const { x, y, label, shape, ...rest } = item;
        return {
          ...rest,
          data: { label, shape, description },
          position: { x, y },
        };
      });
      return { linkNodes: { nodes: newData, fileID: id } };
    }),
  updateLinkNodeId(nodeId) {
    set((state) => {
      return { linkNodeId: nodeId };
    });
  },
  add_file: (newFile: any) => {
    set((state) => {
      let parentId = state.Id;
      let root = new TreeModel().parse(state.data);
      let node = findById(root, parentId);
      const children = root.model?.children;
      //updating the main
      function getUpdatedMain(selectedFolder: Folder) {
        //after getting folder data iam updating children of the main on that particular folder
        const updated_children = children.map((folder: Folder) => {
          if (folder.id === selectedFolder.id) {
            return {
              ...folder,
              children: [...folder.children, newFile],
              hasFile: [...folder.hasFile, newFile],
            };
          }
          return {
            ...folder,
          };
        });
        // updating the folder array
        const updatedHasFolder = state.data.hasContainsFolder.map((values) => {
          if (values.id === selectedFolder.id) {
            return {
              ...values,
              children: [...values.children, newFile],
              hasFile: [...values.hasFile, newFile],
            };
          }
          return values;
        });
        // finally updating the main or project
        const updated_main = {
          ...state.data,
          children: updated_children,
          hasContainsFolder: updatedHasFolder,
        };
        return updated_main;
      }

      function checkingParentisFileOrFolderOrProject(parentFolder: Folder) {
        //checkeng passing data type if its folder
        if (parentFolder.type === "folder") {
          //here if its folder iam passing selected folder
          return getUpdatedMain(parentFolder);
        } else {
          //if i selected file in project or main it will add file inside project
          const updated_data = [...children, newFile];
          const updated_main = {
            ...state.data,
            children: updated_data,
            hasContainsFile: [...state.data.hasContainsFile, newFile],
          };
          return updated_main;
        }
      }

      //if we select the folder
      if (node?.model.type === "folder") {
        //then we are getting that particular folder
        const getFolder = node?.model;
        //and returning or updating data by using checkingParent is File Or Folder Or Project
        // then iam passing selected folder as myData interface
        return { data: checkingParentisFileOrFolderOrProject(getFolder) };
        // if i select the file in folder or in project
      } else if (node?.model.type === "file") {
        //then iam getting parent of that file
        let getParent = node?.parent.model;
        //finding that parent exist or not inside the parent
        // if its not then iam passing project to add file inside the the project
        const findParent =
          children?.find((folder: Folder) => folder.id === getParent.id) ||
          getParent;
        return { data: checkingParentisFileOrFolderOrProject(findParent) };
      } else {
        //file adding inside the main
        const updated_data = [...children, newFile];
        const updated_main = {
          ...state.data,
          children: updated_data,
          hasContainsFile: [...state.data.hasContainsFile, newFile],
        };
        return { data: updated_main };
      }
    });
  },
  add_folder: (newFolder: Folder) =>
    set((state) => {
      const updatedData = {
        ...newFolder,
        children: [],
        hasFile: [],
        hasFolder: [],
      };
      let root = new TreeModel().parse(state.data);
      const getChildren = root.model?.children;
      const getFolder = root.model?.hasContainsFolder;
      const to_be_update = [updatedData, ...getChildren];
      const updatedFolders = [...getFolder, updatedData];
      const updatedState = {
        ...state.data,
        children: to_be_update,
        hasContainsFolder: updatedFolders,
      };
      return { data: updatedState };
    }),

  // ? This function seems to work, but may contain bugs w.r.t. state
  delete_item: (id: string) =>
    set((state) => {
      const root = new TreeModel().parse(state.data);
      const node = findById(root, id);
      if (node?.model.type === "folder") {
        const to_be_deleted = state.data.children?.filter(
          (value) => value.id !== id
        );
        // @ts-ignore
        const hasFolder = state.data.hasContainsFolder.filter(
          (value: any) => value.id !== id
        );
        const updated_children = {
          ...state.data,
          children: to_be_deleted,
          hasContainsFolder: hasFolder,
        };
        return { data: updated_children };
      } else if (node?.model.type === "file") {
        //  if file in folder
        const getParentId = node.parent?.model.id;
        const getParent = node.parent?.model;
        const removeFileParent = getParent.children.filter(
          (values: any) => values.id !== id
        );
        const to_be_updateParent = {
          ...getParent,
          children: removeFileParent,
          hasFile: removeFileParent,
        };
        const updated_parent_children = state.data.children?.map((values) => {
          if (values.id === getParentId) {
            return {
              ...to_be_updateParent,
            };
          }
          return values;
        });
        const to_be_deleted = state.data.children?.filter(
          (value) => value.id !== id
        );
        const flag = to_be_deleted?.length === state.data.children?.length;
        // file in folder
        const updated_state = {
          ...state.data,
          children: updated_parent_children,
        };
        // if its file in main
        const updated_children = {
          ...state.data,
          children: to_be_deleted,
          hasContainsFile: to_be_deleted,
        };
        // deleteFileBackend(id)
        const updatedValues = flag ? updated_state : updated_children;
        return { data: updatedValues as MyData };
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

      return { data: updatedFile };
    }),

  updateUid: (collectionofIds: Array<any>) =>
    set((state) => {
      const arrayOfUids = collectionofIds.map((values) => values.uid);
      let uid = arrayOfUids.reduce((a, b) => Math.max(a, b), 0);
      const filterUids = collectionofIds.filter(
        (values) => values.uid === uid
      )[0];
      let updated_uid = uid === 0 ? 1 : uid;
      return { uid: updated_uid, idofUid: filterUids.id };
    }),
  loading: true,
  setLoading: (load: boolean) =>
    set((state) => {
      return { loading: load };
    }),
}));

export default fileStore;
