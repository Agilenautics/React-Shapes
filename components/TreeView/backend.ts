import { useCallback, useEffect, useMemo, useState } from "react";
import TreeModel from "tree-model-improved";
import fileStore from "./fileStore";

/**
 * It returns the first node in the tree that has a model with an id property that matches the id
 * parameter
 * @param {any} node - any - the node to start searching from
 * @param {string} id - The id of the node to find.
 * @returns A node with the given id.
 */
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
  id: string;
  isOpen: boolean;
  name: string;
  children?: Array<MyData>;
  type: string;
};

/**
 * This function returns an object with a bunch of functions that are used to manage the state of the file tree
 */
export function useBackend() {
  const initData = fileStore((state) => state.data);

  const [data, setData] = useState<MyData>(initData as MyData);
  const root = useMemo(() => new TreeModel().parse(data), [data]);
  const find = useCallback((id: any) => findById(root, id), [root]);
  const update = () => setData({ ...root.model });

  useEffect(() =>{
    setData(initData);
    update();
   });
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

    onEdit: (id: string, name: string) => {
      const node = find(id);
      if (node) {
        node.model.name = name;
        update();
      }
    },
  };
}
