import React, { useState, useEffect, SyntheticEvent } from "react";
import { ChevronDown, ChevronRight } from "react-feather";
import { NodeHandlers, NodeRendererProps } from "react-arborist";
import { MyData } from "./backend";
import { FiEdit2, FiDelete } from "react-icons/fi";
import { AiOutlineFile, AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import fileStore from "./fileStore";
import nodeStore from "../Flow/Nodes/nodeStore";
import edgeStore from "../Flow/Edges/edgeStore";
import {
  GET_NODES,
  getNodes,
  //allEdges,
  //getEdges,
  // getFileByNode,
} from "../../gql";
import { gql } from "graphql-tag";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../auth";
import { get_user_method, GET_PROJECTS } from "../../gql";
import LoadingIcon from "../LoadingIcon";
import useBackend from "./backend";
import { useRouter } from "next/router";
import { FaAngleRight } from "react-icons/fa6";

// LoadingIcon component
import classNames from "classnames";
import RenameFormForTreeStructur from "./renameForm";
import MaybeToggleButton from "./toggleArrowbuttons";
import Icon from "./IconsForFolderAndFile";
import getNodeAndEdges from "../Flow/middleWares/getNodesAndEdges";
import { ApolloQueryResult } from "@apollo/client";
import userStore from "../AdminPage/Users/userStore";

// LoadingIcon component

// ExpandableChip component
// ExpandableChip component
function ExpandableChip({ onRename, onDelete }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="expandable-chip">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`expand-button ${expanded ? "expanded" : ""}`}
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


/**
 * It returns an icon based on the props passed in.
 * @param {any} - isFolder - whether the node is a folder or not.
 * @param {any} - isOpen - whether the folder is open or not.
 */



/**
 * It's a React component that handles the renaming of a file or folder.
 * @param {FormProps} - FormProps
 * @returns An input field.
 */


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
  const id = data.id;
  const updateNodes = nodeStore((state) => state.updateNodes);
  const updateEdges = edgeStore((state) => state.updateEdges);
  const updateCurrentFlowchart = fileStore(
    (state) => state.updateCurrentFlowchart
  );
  const updateBreadCrumbs = nodeStore((state) => state.updateBreadCrumbs);
  const [isLoading, setIsLoading] = useState(false);
  const {userType} = userStore()
  const { onDelete } = useBackend();
  const router = useRouter();
  const projectId = router.query.projectId;

  if (state.isSelected) {
    updateCurrentFlowchart(name, id);
    if (data.type === "file") {
      updateBreadCrumbs(data, id, "new");
    }
  }
  const toDetailPage = (selectedId: string) => {
    router.push({
      pathname: `/projects/${projectId}/backlogs/edit/`,
      query: { id: selectedId },
    });
  };

  function loadNewFlow(
    handlers: NodeRendererProps<MyData> & {
      select: (e: SyntheticEvent<Element, Event>) => void;
    },
    data: MyData
  ) {
    return (e: SyntheticEvent) => {
      handlers.select(e);
      if (data.children == null) {
        setIsLoading(true);
        // here we need to get nodes and edges from the getProect by query
        getNodes(GET_NODES, data.id)
          .then((result: any) => {
            const {
              data: { files },
            } = result;
            const { nodes, edges } = getNodeAndEdges(files[0]);
            updateNodes(nodes);
            updateEdges(edges);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
  }
  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center  bg-opacity-75">
        <LoadingIcon color="black" />
      </div>
    );
  }

  return (
    <div
      ref={innerRef}
      style={styles.row}
      className={classNames("row", state)}
      //@ts-ignore
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
          <RenameFormForTreeStructur defaultValue={name} {...handlers} />
        ) : (
          <span className="group flex flex-row font-sans text-sm dark:text-white">
            {name}
            {state.isSelected &&
              !state.isEditing &&
              userType.toLowerCase() !== "user" && (
                <div className="flex flex-row pl-2">
                  <button className="text-gray-900" onClick={handlers.edit}>
                    <FiEdit2 size={20} className="dark:text-white" />
                  </button>
                  <button
                    onClick={() => {
                      const confirmation = window.confirm(
                        "Are you sure you want to delete?"
                      );
                      if (confirmation) {
                        onDelete(id);
                      }
                    }}
                    className="ml-2"
                  >
                    <FiDelete size={20} className="dark:text-white" />
                  </button>
                  <button
                    onClick={() => toDetailPage(id)}
                    className="ml-5 cursor-pointer hover:scale-110 hover:text-black"
                  >
                    <FaAngleRight />
                  </button>
                </div>
              )}
          </span>
        )}
      </div>
    </div>
  );
};

