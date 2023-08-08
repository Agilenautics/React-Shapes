import React, { useState, useEffect, SyntheticEvent } from "react";
import { ChevronDown, ChevronRight } from "react-feather";
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
import TreeModel from "tree-model-improved";
import useBackend from './backend'

// LoadingIcon component
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
        <Icon size={20} className=" stroke-2 text-gray-700 dark:text-white" />
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
  const id = data.id;
  const delete_item = fileStore((state) => state.delete_item);
  const updateNodes = nodeStore((state) => state.updateNodes);
  const updateEdges = edgeStore((state) => state.updateEdges);
  const updateCurrentFlowchart = fileStore(
    (state) => state.updateCurrentFlowchart
  );
  const updateBreadCrumbs = nodeStore((state) => state.updateBreadCrumbs);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [accessLevel, setAccessLevel] = useState("");
  const { onDelete } = useBackend();

  const verifyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        get_user_method(user.email, GET_USER).then((res: any) => {
          setUser(res[0].userType);
          setAccessLevel(res[0].userType);
        });
      } else {
        setUser([]);
        setAccessLevel("");
      }
    });
  };

  useEffect(() => {
    verifyAuthToken();
  }, []);

  if (state.isSelected) {
    updateCurrentFlowchart(name, id);
    if (data.type === "file") {
      updateBreadCrumbs(data, id, "new");
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
        setIsLoading(true);
        getNodes(allNodes, data.id)
          .then((result) => {
            updateNodes(result.nodes);
            updateEdges(result.edges);
          })
          .finally(() => {
            setIsLoading(false);
          });
        getEdges(allEdges, data.id)
          .then((result) => {
            updateEdges(result);
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

  function handleRename() {
    handlers.edit();
  }

  function handleDelete() {
    delete_item(id);
  }

  return (
    // <> {name} </>
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
          <Icon
            isFolder={folder}
            isSelected={state.isSelected}
            isOpen={open}
          />
        </i>
        {state.isEditing ? (
          <RenameForm defaultValue={name} {...handlers} />
        ) : (
          <span className="flex flex-row text-sm group font-sans dark:text-white">
            {name}{" "}
            {state.isSelected &&
              !state.isEditing &&
              accessLevel.toLowerCase() !== "user" && (
                <div className="flex flex-row pl-2">
                  <button className="text-gray-900" onClick={handlers.edit}>
                    <FiEdit2 size={20} className="dark:text-white" />
                  </button>
                  <button
                    onClick={() => {
                      const confirmation = window.confirm('Are you sure you want to delete?');
                      // console.log(confirmation)

                      if (confirmation) {

                        onDelete(id);

                      }
                    }}
                    className="ml-2"
                  >
                    <FiDelete size={20} className="dark:text-white" />
                  </button>
                </div>
              )}
          </span>
        )}
      </div>
    </div>
  );
};

//backlogs

export const BacklogsView = ({ innerRef,data,styles,state,handlers,tree }: NodeRendererProps<MyData>) => {
  console.log(data)
  return (
      <div>{data.name}</div>
  )
}


export const TreeNode2 = ({
  innerRef,
  data,
  styles,
  state,
  handlers,
  tree,
}: any) => {
  const folder = Array.isArray(data.children);
  const open = state.isOpen;
  const name = data.name;
  const id = data.id;
  ////console.log(data);
  var selectedNodeId: string;

  if (state.isSelected) {
    selectedNodeId = data.id!;
    // console.log("S:", selectedNodeId);
  }
  const customQuery = gql`
    query FindFileById($nodeId: String!) {
      files(where: { hasflowchart: { nodes: { id: { equals: $nodeId } } } }) {
        id
      }
    }
  `;
  let result: any;
  async function getfileId() {
    try {
      result = await getFileByNode(selectedNodeId, customQuery);
      // console.log("R=", result);
    } catch (error) {
      console.error("Error retrieving file ID:", error);
    }
  }

  const fileId = nodeStore((state) => state.fileId);
  const currentFileId = fileId; //'b04c5b0e-e3da-45ad-af2c-31ada8dff3dd'; // Replace with the actual current file's ID

  const updateLinkNodes = fileStore((state) => state.updateLinkNodes);

  function loadFlowNodes(handlers: any, data: any) {
    return (e: SyntheticEvent) => {
      if (data.id === currentFileId) {
        e.stopPropagation(); // Prevent event propagation for the current file's node
        return; // Disable click for the current file's node
      }
      handlers.select(e);
      if (data.children == null) {
        return updateLinkNodes(data.hasflowchart.nodes, data.id);
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
      className={`${classNames("row", state, disabledCursorClass)} dark:text-white`}
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
          <RenameForm
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



