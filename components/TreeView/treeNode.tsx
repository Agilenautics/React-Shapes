import React, { useState, useEffect, SyntheticEvent } from "react";
import { ChevronDown, ChevronRight } from "react-feather";
// @ts-ignore
import { NodeHandlers, NodeRendererProps } from "react-arborist";
import { MyData } from "./backend";
import { FiEdit2, FiDelete } from "react-icons/fi";
import { AiOutlineFile, AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import fileStore from "./fileStore";
import nodeStore from "../Flow/Nodes/nodeStore";
import edgeStore from "../Flow/Edges/edgeStore";
import { allNodes, getNodes } from "../Flow/Nodes/gqlNodes";
import { allEdges, getEdges } from "../Flow/Edges/gqlEdges";
import { updateFileBackend, updateFolderBackend } from "./gqlFiles";
import { getFileByNode } from "./gqlFiles";
import { gql } from "graphql-tag";
import styles from "../Flow/Nodes/styles.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../auth";
import { GET_USER, get_user_method } from "../AdminPage/Projects/gqlProject";
import LoadingIcon from "../LoadingIcon";
import { ApolloQueryResult } from "@apollo/client";
import classNames from "classnames";

// LoadingIcon component

// ExpandableChip component
// ExpandableChip component
function ExpandableChip({ onRename, onDelete }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="expandable-chip">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`expand-button ${expanded ? 'expanded' : ''}`}
      >
        {expanded ? <span>X</span> : <span>...</span>}
      </button>
      {expanded && (
        <div className="expand-content">
          <button className="action-button" onClick={onRename}>
            Rename <FiEdit2 size={18} className="icon" />
          </button>
          <button className="action-button" onClick={onDelete}>
            Delete <FiDelete size={18} className="icon" />
          </button>
        </div>
      )}
    </div>
  );
}


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
        <Icon size={20} className="stroke-2 text-gray-700" />
      </button>
    );
  } else {
    return <div className="spacer" />;
  }
}

/**
 * It returns an icon based on the props passed in.
 * @param {any} - isFolder - whether the node is a folder or not.
 * @param {any} - isOpen - whether the folder is open or not.
 */
function Icon({ isFolder, isSelected, isOpen }: any) {
  const cname = "rounded text-blue-500 w-5 h-5 pb-[1px]";
  if (isFolder) {
    if (isOpen) {
      return <AiFillFolderOpen className={cname} size={18} />;
    } else {
      return <AiFillFolder className={cname} size={18} />;
    }
  } else {
    return <AiOutlineFile className={cname} size={18} />;
  }
}

type FormProps = { defaultValue: string } & NodeHandlers;

/**
 * It's a React component that handles the renaming of a file or folder.
 * @param {FormProps} - FormProps
 * @returns An input field.
 */
function RenameForm({ defaultValue, submit, reset }: FormProps) {
  const inputProps = {
    defaultValue,
    autoFocus: true,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      submit(e.currentTarget.value);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  const updateBreadCrumbs = nodeStore((state)=>state.updateBreadCrumbs)
  // ! This code below is called every frame, which is annoying but works for now
  if (state.isSelected) {
    updateCurrentFlowchart(name, Id);
    if(data.type==="file"){
      updateBreadCrumbs(data,Id)
    }

  }

  function loadNewFlow(
    handlers: NodeRendererProps<MyData> & {
      select: (e: SyntheticEvent<Element, Event>) => void;
    },
    data: MyData
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

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        <LoadingIcon color="black" />
      </div>
    );
  }

  function handleRename() {
    handlers.edit();
  }

  function handleDelete() {
    delete_item(id);
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
          <Icon
            isFolder={folder}
            isSelected={state.isSelected}
            isOpen={open}
          />
        </i>
        {state.isEditing ? (
          <RenameForm defaultValue={name} {...handlers} />
        ) : (
          <span className="flex flex-row text-sm">
            {name}{" "}
            {state.isSelected &&
              !state.isEditing &&
              accessLevel.toLowerCase() !== "user" && (
                <div className="flex flex-row pl-2">
                  <ExpandableChip
                    onRename={handleRename}
                    onDelete={handleDelete}
                  />
                </div>
              )}
          </span>
        )}
      </div>
    </div>
  );
};
