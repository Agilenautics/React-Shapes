import React, { SyntheticEvent, memo } from "react";
import nodeStore from "../Flow/Nodes/nodeStore";
import fileStore from "./fileStore";
import classNames from "classnames";
import MaybeToggleButton from "./toggleArrowbuttons";
import Icon from "./IconsForFolderAndFile";
import RenameFormForTreeStructur from "./renameForm";

const TreeNode2 = ({ innerRef, data, styles, state, handlers, tree }: any) => {
  const folder = Array.isArray(data.children);
  const open = state.isOpen;
  const name = data.name;
  const id = data.id;
  var selectedNodeId: string;
  if (state.isSelected) {
    selectedNodeId = data.id!;
  }

  const { fileId } = nodeStore();
  const currentFileId = fileId;  // Replace with the actual current file's ID

  const updateLinkNodes = fileStore((state) => state.updateLinkNodes);

  function loadFlowNodes(handlers: any, data: any) {
    return (e: SyntheticEvent) => {
      if (data.id === currentFileId) {
        e.stopPropagation(); // Prevent event propagation for the current file's node
        return; // Disable click for the current file's node
      }
      handlers.select(e);
      if (data.hasNodes && data.hasNodes.length) {
        return updateLinkNodes(data.hasNodes, data.id);
      } else {
        return updateLinkNodes(
          [
            {
              message:
                "There is no data available in this file please add new data and add the link",
            },
          ],
          data.id
        );
      }
    };
  }

  const isCurrentFile = data.id === currentFileId;
  const nodeStyles = isCurrentFile
    ? { pointerEvents: "none", opacity: 0.5 }
    : {};
  const disabledCursorClass = isCurrentFile ? styles.disabledCursor : "";

  return (
    <div
      ref={innerRef}
      style={{ ...styles.row, ...nodeStyles }}
      className={`${classNames(
        "row",
        state,
        disabledCursorClass
      )} dark:text-white`}
      onClick={loadFlowNodes(handlers, data)}
    >
      <div className="row-contents" style={styles.indent}>
        <MaybeToggleButton
          toggle={handlers.toggle}
          isOpen={open}
          isFolder={folder}
          isSelected={state.isSelected}
        />
        <i>
          <Icon isFolder={folder} isSelected={state.isSelected} isOpen={open} />
        </i>
        {state.isEditing ? (
          <RenameFormForTreeStructur
            defaultValue={name}
            {...handlers}
            disabled={isCurrentFile}
          />
        ) : (
          <span className="flex flex-row">
            {name} {state.isSelected}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(TreeNode2);
