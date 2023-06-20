import AutoSize from "react-virtualized-auto-sizer";
import { Tree, TreeApi } from "react-arborist";
import { TreeNode, TreeNode2 } from "./treeNode";
import { useBackend } from "./backend";
import LoadingIcon from "../LoadingIcon";
import React, { useState, useEffect } from "react";

export function FileTree() {
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <LoadingIcon color = "black"/>
      </div>
    );
  }

  return (
    <AutoSize>
      {(props: any) => (
        <Tree

          //@ts-ignore
          ref={(tree: TreeApi) => {

            // @ts-ignore
            global.tree = tree;
          }}
          data={backend.data}
          getChildren="children"
          isOpen="isOpen"
          indent={24}
          onMove={backend.onMove}
          onToggle={backend.onToggle}
          onEdit={backend.onEdit}
          rowHeight={22}
          width={props.width}
          height={props.height}
        >
          {TreeNode}
        </Tree>
      )}
    </AutoSize>
  );
}

export function LinkTree() {
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <LoadingIcon color = "black"/>
      </div>
    );
  }

  return (
    <AutoSize>
      {(props: any) => (
        <Tree

          //@ts-ignore
          ref={(tree: TreeApi) => {

            //@ts-ignore
            global.tree = tree;
          }}
          data={backend.data}
          getChildren="children"
          isOpen="isOpen"
          hideRoot
          indent={24}

          // onMove={backend.onMove}
          onToggle={backend.onToggle}

          // onEdit={backend.onEdit}
          rowHeight={22}
          width={props.width}
          height={props.height}
        >
          {TreeNode2}
        </Tree>
      )}
    </AutoSize>
  );
}
