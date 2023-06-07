import classNames from "classnames";
import React, { useState, FocusEvent, KeyboardEvent, SyntheticEvent, useEffect } from "react";
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
import { getFileByNode } from "./gqlFiles";
import { gql } from "graphql-tag";
import styles from "../Flow/Nodes/styles.module.css";
import userStore from "../AdminPage/Users/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../auth";
import { GET_USER, get_user_method } from "../AdminPage/Projects/gqlProject";

// LoadingIcon component
const LoadingIcon: React.FC = () => {
  return (
    <div className="loading-icon">
      <svg
        className="animate-spin h-10 w-10 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="11"
          stroke="currentColor"
          strokeWidth="2"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M9.5 16A6.5 6.5 0 016 12.5c0-1.623.61-3.105 1.61-4.22l1.564 1.564A4.5 4.5 0 008 12.5a4.5 4.5 0 004.5 4.5 4.5 4.5 0 004.22-6.15l1.565-1.565A6.5 6.5 0 0114.5 16h-5z"
        ></path>
      </svg>
    </div>
  );
};

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
  const id = data.id;
  const delete_item = fileStore((state) => state.delete_item);
  const updateNodes = nodeStore((state) => state.updateNodes);
  const updateEdges = edgeStore((state) => state.updateEdges);
  const updateCurrentFlowchart = fileStore(
    (state) => state.updateCurrentFlowchart
  );
  const updateBreadCrumbs = nodeStore((state) => state.updateBreadCrumbs);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState([])


  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // @ts-ignore
        get_user_method(user.email, GET_USER).then((res) => {
          setUser(res[0].userType)
        })
      } else {
        setUser([])
      }
    })
  }

  useEffect(() => {
    verfiyAuthToken()
  }, [])



  var accessLevel = user; // Set the access level here

  if (state.isSelected) {
    updateCurrentFlowchart(name, id);
    if (data.type === "file") {
      updateBreadCrumbs(data, id, "new");
    }
  }

  function loadNewFlow(
    handlers: NodeRendererProps<MyData>,
    data: NodeRendererProps<MyData>
  ) {
    return (e: SyntheticEvent) => {
      handlers.select(e);
      if (data.children == null) {
        setIsLoading(true);
        getNodes(allNodes, data.id)
          .then((result) => {
            updateNodes(result);
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

  const isUser = accessLevel === "user";
  const canEditAndDelete = !isUser;

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
            {state.isSelected && canEditAndDelete && (
              <div className="flex flex-row pl-2">
                <button className="text-gray-900" onClick={handlers.edit}>
                  <FiEdit2 size={20} className="dark:text-white" />
                </button>
                <button
                  onClick={() => {
                    delete_item(id);
                  }}
                  className="ml-2"
                >
                  <FiDelete size={20} className="dark:text-white" />
                </button>
              </div>
            )}
          </span>
        )}
        {isLoading && <LoadingIcon />}
        {!isLoading && !state.isEditing && (
          <>
            <FiEdit2
              onClick={handlers.edit}
              className="cursor-pointer stroke-2 mx-1"
              size={18}
            />
            <FiDelete
              onClick={(e) => {
                e.stopPropagation();
                delete_item(Id);
              }}
              className="cursor-pointer stroke-2"
              size={18}
            />
          </>
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
}: any) => {
  const folder = Array.isArray(data.children);
  const open = state.isOpen;
  const name = data.name;
  const id = data.id;
  //console.log(data);
  var selectedNodeId: string;

  if (state.isSelected) {
    selectedNodeId = data.id!;
    console.log("S:", selectedNodeId);
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
      console.log("R=", result);
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
      className={classNames("row", state, disabledCursorClass)}
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
