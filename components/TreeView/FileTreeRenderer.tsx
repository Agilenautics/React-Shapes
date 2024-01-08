import React, { memo } from "react";
import AutoSize from "react-virtualized-auto-sizer";
import { Tree, TreeApi, } from "react-arborist";
import useBackend from "./backend";
import LinkTreeNode from "./LinkTreeNode";

const LinkTree = () => {
  const backend = useBackend();
  return (
    <AutoSize>
      {(props: any) => (
        <Tree
          data={backend.data}
          getChildren="children"
          isOpen="isOpen"
          hideRoot
          indent={24}
          onToggle={backend.onToggle}
          rowHeight={22}
          width={props.width}
          height={props.height}
        >
          {LinkTreeNode}
        </Tree>
      )}
    </AutoSize>
  );
};

export default memo(LinkTree);
