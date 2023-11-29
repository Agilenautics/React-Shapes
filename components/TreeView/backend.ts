import { useCallback, useEffect, useMemo, useState } from "react";
import TreeModel from "tree-model-improved";
import fileStore from "./fileStore";
import {
  connectToFolderBackendOnMove,
  disconnectFromFolderBackendOnMove,
  updateFileBackend,
  updateFolderBackend,
  deleteFileBackend,
  deleteFolderBackend,
  Folder,
  getProjectByUser,
  updateFoldersMutation,
  updateFilesMutation,
  deleteFoldersMutation,
  deleteFilesMutation,
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
  // hasContainsFile:Array<File>

  hasContainsFolder: Array<Folder>;
  hasContainsFile: Array<File>;
};

/**
 * This function returns an object with a bunch of functions that are used to manage the state of the file tree
 */
export function useBackend() {
  let initData = fileStore((state) => state.data);
  let setLoading = fileStore((state) => state.setLoading);
  const delete_item = fileStore((state) => state.delete_item);
  const updateFile = fileStore((state) => state.update_file);
  const [data, setData] = useState<MyData>(initData as MyData);
  const root = useMemo(() => new TreeModel().parse(data), [data]);
  const find = useCallback((id: any) => findById(root, id), [root]);
  const update = () => setData({ ...root.model });

  // console.log(data);

  // projectId
  const router = useRouter();
  const projectId = (router.query.projectId as string) || "";

  const getProjectId = async (id: string) => {
    const initData = await getTreeNodeByUser(getProjectByUser, id, setLoading);
    const data: MyData | any = initData[0];
    setData(data);
    //@ts-ignore
    // updateInitData(data);
    return initData;
  };

  // useEffect(() => {
  //   if (projectId) {
  //     getProjectId(projectId);
  //   }
  // }, [projectId]);

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
        // console.log("fileid", srcId, "folderid", dstParentId, "index", dstIndex);
        disconnectFromFolderBackendOnMove(srcId);
        connectToFolderBackendOnMove(dstParentId, srcId);
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
      console.log(node)
      const getParent  = node?.parent.model as Folder
      console.log(getParent)
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
            hasLinkedTo: {},
          },
          position: { x: 0, y: 0 },
          type: "WelcomeNode",
          draggable: false,
        },
      ];

      // making writable copy
      const updatedData = { ...node?.model, name };

      // getting element index
      const ind = initData.children?.findIndex((element) => element.id == id);
      let indexForHasContainsFile = initData.hasContainsFile?.findIndex(
        (element: File) => element.id === id
      );
      // console.log(indexForHasContainsFile)
      // if (indexForHasContainsFile < 0) {
      //   indexForHasContainsFile = initData.hasContainsFolder.children.findIndex(
      //     (value: File) => value.id === id
      //   );
      //   initData.hasContainsFolder.children[indexForHasContainsFile] = updatedData;
      // }
      console.log(initData.children)

      // updating state in real time

      // @ts-ignore
      initData.children[ind] = updatedData;
      // initData.hasContainsFile[indexForHasContainsFile] = updatedData

      setData(initData);
      update();
      console.log(initData,'initdata')

      const { type } = node?.model;
      if (type === "folder") {
        await updateFolderBackend(
          editedData,
          updateFoldersMutation,
          getProjectByUser
        );
        // updateNodes(nodeData);
      }
      if (type === "file") {
        await updateFileBackend(
          editedData,
          updateFilesMutation,
          getProjectByUser
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
          deleteFoldersMutation,
          getProjectByUser
        );
        delete_item(id);
      } else {
        await deleteFileBackend(
          deleteIds,
          deleteFilesMutation,
          getProjectByUser
        );
        delete_item(id);
      }
    },
  };
}

export default useBackend;
