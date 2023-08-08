import TreeModel from "tree-model-improved";
import fileStore from "./fileStore";
import react, { useCallback, useMemo, useState, useEffect } from 'react'

/**
 * It returns the first node in the tree that has a model with an id property that matches the id
 * parameter
 * @param {any} node - any - the node to start searching from
 * @param {string} id - The id of the node to find.
 * @returns A node with the given id.
 */


export type MyData = {
  id: string;
  isOpen: boolean;
  name: string;
  children?: Array<MyData>;
  type: string;
};


const data = [
  { id: "1", name: "Unread" },
  { id: "2", name: "Threads" },
  {
    id: "3",
    name: "Chat Rooms",
    children: [
      { id: "c1", name: "General" },
      { id: "c2", name: "Random" },
      { id: "c3", name: "Open Source Projects" },
    ],
  },
  {
    id: "4",
    name: "Direct Messages",
    children: [
      { id: "d1", name: "Alice" },
      { id: "d2", name: "Bob" },
      { id: "d3", name: "Charlie" },
    ],
  },
];

export function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}



export function useBacklogs() {
  const initData = fileStore((state) => state.data)
  // @ts-ignore
  const [backlog, setBacklog] = useState<MyData>(initData as MyData);
  const root = useMemo(() => new TreeModel().parse(backlog), [backlog]);
  const find = useCallback((id: any) => findById(root, id), [root]);
  const update = () => setBacklog({ ...root.model });
  const delete_item = fileStore((state) => state.delete_item);


  useEffect(() => {
    setBacklog(initData)
  }, [initData,update])



  return {
    data: backlog
  }

}


export default useBacklogs



