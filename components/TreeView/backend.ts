import { useCallback, useEffect, useMemo, useState } from "react";
import TreeModel from "tree-model-improved";
import fileStore from "./fileStore";
import {
  moveFileBackend,
  updateFileBackend,
  updateFolderBackend,
  deleteFileBackend,
  deleteFolderBackend,
  Folder,
  GET_FILES_FOLDERS_BY_PROJECT_ID,
  UPDATE_FOLDER,
  UPDATE_FILE,
  DELETE_FOLDER,
  DELETE_FILE,
  getTreeNodeByUser,
} from "../../gql";
import nodeStore from "../Flow/Nodes/nodeStore";
import { useRouter } from "next/router";
import { File } from "../../lib/appInterfaces";

/**
 * It returns the first node in the tree that has a model with an id property that matches the id
 * parameter
 * @param {any} node - any - the node to start searching from
 * @param {string} id - The id of the node to find.
 * @returns A node with the given id.
 */
// const setLoading = fileStore((state)=> state.setLoading);

export function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

/**
 * `MyData` is an object with a string `id`, a boolean `isOpen`, a string `name`, and an optional array
 * of `MyData` objects called `children`. It is a recursive definition that represents a tree of objects.
 * @property {string} id - The unique identifier for the item.
 * @property {boolean} isOpen - boolean - This is a boolean value that determines whether the node is
 * open or closed.
 * @property {string} name - The name of the item.
 * @property children - An array of MyData objects.
 */
export type MyData = {
  usersInProjects: any;
  id: string;
  isOpen: boolean;
  name: string;
  children?: Array<MyData>;
  type: string;
  hasContainsFolder: Array<Folder>;
  hasContainsFile: Array<File>;
};

/**
 * This function returns an object with a bunch of functions that are used to manage the state of the file tree
 */
const useBackend = () => {
  let initData = fileStore((state) => state.data);
  let setLoading = fileStore((state) => state.setLoading);
  const delete_item = fileStore((state) => state.delete_item);
  const updateFile = fileStore((state) => state.update_file);
  const [data, setData] = useState<MyData>(initData as MyData);
  const root = useMemo(() => new TreeModel().parse(data), [data]);
  const find = useCallback((id: any) => findById(root, id), [root]);
  const update = () => setData({ ...root.model });
  useEffect(() => {
    setData(initData);
    update;
  }, [initData]);

  return {
    data,
    onMove: (
      srcIds: string[],
      dstParentId: string | null,
      dstIndex: number
    ) => {
      for (const srcId of srcIds) {
        const src = find(srcId);
        const dstParent = dstParentId ? find(dstParentId) : root;
        if (!src || !dstParent) return;
        const newItem = new TreeModel().parse(src.model);
        dstParent.addChildAtIndex(newItem, dstIndex);
        console.log(
          "fileid",
          srcId,
          "folderid",
          dstParentId,
          "index",
          dstIndex
        );

        moveFileBackend(dstParentId, srcId);
        src.drop();
      }
      update();
    },

    onToggle: (id: string, isOpen: boolean) => {
      const node = find(id);
      if (node) {
        node.model.isOpen = isOpen;
        update();
      }
    },

    onEdit: async (id: string, name: string) => {
      const node = find(id);
      const getParent = node?.parent.model as Folder;
      let editedData = {
        id,
        name,
        projectId: initData.id,
      };

      const nodeData = [
        {
          id: "1",
          data: {
            label:
              "Welcome!\nTo get started, use the sidebar button on the top left.",
            shape: "rectangle",
            description: "",
            isLinked: {},
          },
          position: { x: 0, y: 0 },
          type: "WelcomeNode",
          draggable: false,
        },
      ];

      // making writable copy
      const updatedData = { ...node?.model, name };
      // getting element index
      let ind = initData.children?.findIndex((element) => element.id == id);
      if (ind !== undefined && ind < 0) {
        ind = getParent.children?.findIndex((file) => file.id === id);
        getParent.children[ind] = updatedData;
      } else {
        //@ts-ignore
        initData.children[ind] = updatedData;
      }
      setData(initData);
      update();
      const { type } = node?.model;
      if (type === "folder") {
        await updateFolderBackend(
          editedData,
          UPDATE_FOLDER,
          GET_FILES_FOLDERS_BY_PROJECT_ID
        );
        // updateNodes(nodeData);
      }
      if (type === "file") {
        await updateFileBackend(
          editedData,
          UPDATE_FILE,
          GET_FILES_FOLDERS_BY_PROJECT_ID
        );
        updateFile(id, initData);
        // updateNodes(nodeData);
      }
    },

    onDelete: async (id: string) => {
      const node = find(id);
      const projectId = initData.id;
      const deleteIds = {
        id,
        projectId,
        parentId: node?.parent.model.id,
      };
      const { type } = node?.model;

      const readableData = { ...initData };
      const updatedChild = readableData.children?.filter(
        (element) => element.id !== id
      );
      initData = { ...readableData, children: updatedChild };
      setData(initData);
      update();
      if (type === "folder") {
        await deleteFolderBackend(
          deleteIds,
          DELETE_FOLDER,
          GET_FILES_FOLDERS_BY_PROJECT_ID
        );
        delete_item(id);
      } else {
        await deleteFileBackend(
          deleteIds,
          DELETE_FILE,
          GET_FILES_FOLDERS_BY_PROJECT_ID
        );
        delete_item(id);
      }
    },
  };
};

export default useBackend;
