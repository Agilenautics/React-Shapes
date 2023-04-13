import classNames from "classnames";
import React, { FocusEvent, KeyboardEvent, SyntheticEvent } from "react";
import { ChevronDown, ChevronRight } from "react-feather";
// @ts-ignore
import { NodeHandlers, NodeRendererProps } from "react-arborist";
import { MyData } from "./backend";
import { FiEdit2, FiDelete } from "react-icons/fi";
import { AiOutlineFile, AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
const size = 18;
import fileStore from "./fileStore";
import nodeStore from "../Flow/Nodes/nodeStore";
import edgeStore from "../Flow/Edges/edgeStore";
import { allNodes, getNodes } from "../Flow/Nodes/gqlNodes";
import { allEdges, getEdges } from "../Flow/Edges/gqlEdges";
import { updateFileBackend, updateFolderBackend } from "./gqlFiles";

/**
 * `MaybeToggleButton` is a function that takes an object with three properties: `toggle`, `isOpen`,
 * and `isFolder`, and returns a button that toggles the folder open or closed. The appearance of the
 * button changes as well, based on the state of the folder.
 */
function MaybeToggleButton({ toggle, isOpen, isFolder, isSelected }: any) {
  if (isFolder) {
    const Icon = isOpen ? ChevronDown : ChevronRight;
    return (
      <button tabIndex={-1} onClick={toggle} className="mx-1">
        <Icon size={20} className=" stroke-2 text-gray-700" />
      </button>
    );
  } else {
    return <div className="spacer" />;
  }
}
/**
 * It returns an icon based on the props passed in.
 * @param {any}  - isFolder - whether the node is a folder or not.
 * @param {any}  - isOpen - whether the folder is open or not
 */
function Icon({ isFolder, isSelected, isOpen }: any) {
  const cname = "rounded text-blue-500 w-5 h-5 pb-[1px]";
  if (isFolder) {
    if (isOpen) {
      return <AiFillFolderOpen className={cname} size={size} />;
    } else {
      return <AiFillFolder className={cname} size={size} />;
    }
  } else {
    return <AiOutlineFile className={cname} size={size} />;
  }
}

type FormProps = { defaultValue: string } & NodeHandlers;

/**
 * It's a React component that handles the renaming of a file or folder
 * @param {FormProps}  - FormProps
 * @returns A input field.
 */
function RenameForm({ defaultValue, submit, reset }: FormProps) {
  const inputProps = {
    defaultValue,
    autoFocus: true,
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      submit(e.currentTarget.value);
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          submit(e.currentTarget.value);
          break;
        case "Escape":
          reset();
          break;
      }
    },
  };

  return (
    <input
      className="rounded-lg bg-blue-100 text-lg dark:bg-blue-400"
      type="text"
      {...inputProps}
    />
  );
}

// Both functions here are almost idential, save for a few differences between what is shown
// The split is needed because the two locations where the tree is rendered are not producing
// idential results
// ! Find a way to fix the duplication

export const TreeNode = ({
  innerRef,
  data,
  styles,
  state,
  handlers,
  tree,
}: NodeRendererProps<MyData>) => {
  const folder = Array.isArray(data.children);
  const open = state.isOpen;
  const name = data.name;
  const Id = data.id;
  const delete_item = fileStore((state) => state.delete_item);
  const updateNodes = nodeStore((state) => state.updateNodes);
  const updateEdges = edgeStore((state) => state.updateEdges);
  const updateCurrentFlowchart = fileStore(
    (state) => state.updateCurrentFlowchart
  );
  // ! This code below is called every frame, which is annoying but works for now
  if (state.isSelected) {
    
    updateCurrentFlowchart(name, Id);
    
    //console.log("treenode editing",Id,name);
  }

  function loadNewFlow(
    handlers: NodeRendererProps<MyData>,
    data: NodeRendererProps<MyData>
  ) {
    return (e: SyntheticEvent) => {
      handlers.select(e);
      if (data.children == null) {
        //updateNodes(data.flowchart.nodes);
        //updateEdges(data.flowchart.edges);
        getNodes(allNodes, data.id).then((result) => {
          // @ts-ignore
          updateNodes(result);
        });
        getEdges(allEdges, data.id).then((result) => {
          // @ts-ignore
           updateEdges(result);
        });
      }
    };

  }
  return (
    <div
      ref={innerRef}
      style={styles.row}
      className={classNames("row", state)}
      onClick={loadNewFlow(handlers, data)}
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
          <RenameForm defaultValue={name} {...handlers} />
        ) : (
          <span className="flex flex-row text-lg">
            {name}{" "}
            {state.isSelected && (
              <div className="flex flex-row pl-2">
                <button className="text-gray-900" onClick={handlers.edit}>
                  <FiEdit2 size={20} className=" dark:text-white" />
                </button>
                <button
                  onClick={() => {
                    delete_item(data.id);
                  }}
                  className="ml-2"
                >
                  <FiDelete size={20} className=" dark:text-white" />
                </button>
              </div>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export const TreeNode2 = ({
  innerRef,
  data,
  styles,
  state,
  handlers,
  tree,
}: NodeRendererProps<MyData>) => {
  const folder = Array.isArray(data.children);
  const open = state.isOpen;
  const name = data.name;
  const updateLinkNodes = fileStore((state) => state.updateLinkNodes);
  function loadFlowNodes(
    handlers: NodeRendererProps<MyData>,
    data: NodeRendererProps<MyData>
  ) {
    return (e: SyntheticEvent) => {
      handlers.select(e);
      if (data.children == null) {
        updateLinkNodes(data.hasflowchart.nodes,data.id);
      }
    };
  }
  return (
    <div
      ref={innerRef}
      style={styles.row}
      className={classNames("row", state)}
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
          <RenameForm defaultValue={name} {...handlers} />
        ) : (
          <span className="flex flex-row">
            {name} {state.isSelected}
          </span>
        )}
      </div>
    </div>
  );
};
