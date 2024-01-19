import React, {
  HTMLInputTypeAttribute,
  memo,
  useState,
  useEffect,
} from "react";
import { FiChevronRight } from "react-icons/fi";
import { nodeShapeMap } from "./Nodes/nodeTypes";
import nodeStore from "./Nodes/nodeStore";
import edgeStore from "./Edges/edgeStore";
import fileStore from "../TreeView/fileStore";
import { BsArrowLeft } from "react-icons/bs";
import useStore from "../Sidebar/SidebarContext";
import { GET_NODES, linkNodeAnotherNodeMethod, ADD_LINK } from "../../gql";
import LinkTree from "../TreeView/FileTreeRenderer";

// ! This file and component structure can be cleaned up a bit to reduce prop drilling and clutter
/**
 * This function takes in a title, two strings for the CSS positioning, and an array of objects. It
 * returns a div that is either collapsed or expanded based on the state of the isCollapsed variable
 * @param  - title: string;
 * @returns A React component that takes in a title, two strings for the CSS classes, a string for the
 * positioning CSS, and an array of objects.
 */
function ExpandableChip({
  title,
  expTrue,
  expFalse,
  positioningCSS,
  objects,
}: {
  title: string;
  expTrue: string;
  expFalse: string;
  positioningCSS: string;
  objects: any;
}) {
  const [isCollapsed, setCollapsed] = useState(true);
  return (
    <div
      className={`absolute overflow-hidden ${
        !isCollapsed && !(title === "Add Link") ? "overflow-y-auto" : ""
      } rounded-lg border-[1px] border-neutral-500 bg-white shadow transition-all duration-100 ease-in-out ${
        isCollapsed ? expTrue : expFalse
      } ${positioningCSS} dark:bg-neutral-900 `}
    >
      <div className="ml-1 mt-[1px] flex text-[9px] font-medium text-black dark:text-white">
        <div className="flex-none">{title}</div>
        <FiChevronRight
          className={`-mt-[2px] h-5 w-5 flex-none cursor-pointer stroke-slate-800 transition-transform dark:stroke-slate-200 ${
            isCollapsed ? "" : "rotate-90"
          }`}
          onClick={() => {
            setCollapsed(!isCollapsed);
          }}
        />
      </div>
      <div className="flex flex-row flex-wrap">{objects}</div>
    </div>
  );
}

interface CSSMapType {
  [key: string]: string | [string, string];
}
/* A React component that is used to edit the properties of a node or edge.*/
function Editing({
  isEdge = false,
  toggleDraggable,
  id,
  updateNodeType,
  setEditing,
  updateLabel,
  label,
  CSSMap = {},
  description,
  updateDescription,
  bidirectionalArrows = false,
}: {
  isEdge: boolean;
  toggleDraggable: Function;
  id: string;
  updateNodeType: Function;
  setEditing: Function;
  updateLabel: Function;
  label: string;
  CSSMap: CSSMapType;
  description: string;
  updateDescription: Function;
  bidirectionalArrows: boolean;
}) {
  const pEtrue = isEdge ? "w-[43px] h-5 top-10" : "w-[47px] h-5 -top-5";
  const pEfalse = isEdge
    ? "w-36 h-[52px] top-10 z-10"
    : "w-36 h-20 -top-5 z-10";
  const sEtrue = "w-[49px] h-5 -top-16";
  const sEfalse = "w-[119px] h-14 z-10";
  const dEtrue = "w-[70px] h-5";
  const dEfalse = "w-[90px] h-20";
  const Ltrue = "w-[60px] h-5";
  const Lfalse = "w-40 h-40";
  const Atrue = "w-[51px] h-5";
  const Afalse = "w-28 h-20";
  const leftPositioning = isEdge ? "left-8" : "-top-8";
  const inputSize = isEdge ? "w-14 h-4" : "h-6 w-28";
  const updateShape = nodeStore((state) => state.updateShape);
  const updateArrows = edgeStore((state) => state.updateArrows);
  const linkNodes = fileStore((state) => state.linkNodes);
  const updateLinkNodes = fileStore((state) => state.updateLinkNodes);
  const addLinkNode = nodeStore((state) => state.addLinkNode);
  const Id = fileStore((state) => state.Id);
  const { isSideBarOpen, setIsSideBarOpen } = useStore();
  const addLinkMethod = async (
    currentNodeId: string,
    anotherNodeId: string
  ) => {
    const response = await linkNodeAnotherNodeMethod(
      currentNodeId,
      ADD_LINK,
      anotherNodeId,
      GET_NODES,
      Id
    );
    addLinkNode(
      currentNodeId,
      response?.data.updateFlowNodes.flowNodes[0],
      anotherNodeId
    );
    setEditing(false);
    toggleDraggable(currentNodeId, true);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    updateDescription(id, event.target.description.value);
  };

  const handleChanges = (event: any) => {
    if (event.keyCode == 13) {
      updateDescription(id, event.target.value);
      setEditing(false);
    }
  };
  const handleArrows = (e: React.ChangeEvent<HTMLFormElement>) => {
    updateArrows(id, e.target.value === "bidirectional");
    setEditing(false);
  };
  useEffect(() => {
    const unsubscribe = fileStore.subscribe((state) => {
      if (state.Id !== Id) {
        setEditing(false);
        setIsSideBarOpen(false);
      }
    });

    return () => unsubscribe();
  }, [Id, isSideBarOpen]);

  useEffect(() => {
    const unsubscribe = nodeStore.subscribe((state) => {
      if (state.fileId !== id) {
        setEditing(false);
        setIsSideBarOpen(false);
      }
    });

    if (id) {
      return () => unsubscribe();
    }
  }, [id, Id, isSideBarOpen]);

  return (
    <div>
      <ExpandableChip
        title="Color"
        expTrue={pEtrue}
        expFalse={pEfalse}
        positioningCSS={leftPositioning}
        objects={Object.keys(CSSMap).map((key, _) => (
          <div
            key={key}
            className={`mx-1 my-1 h-5 w-5 cursor-pointer rounded transition-opacity duration-75 ease-in-out
            ${isEdge ? CSSMap[key][1] : CSSMap[key]}`}
            id={key}
            onClick={() => {
              toggleDraggable(id, true);
              updateNodeType(id, isEdge ? CSSMap[key] : key);
              setEditing(false);
            }}
          ></div>
        ))}
      />
      {isEdge ? (
        <>
          <ExpandableChip
            title="Arrows"
            expTrue={Atrue}
            expFalse={Afalse}
            positioningCSS={"left-[90px] top-10"}
            objects={
              <form className="scale-75" onChange={handleArrows}>
                <div className="mb-4 flex items-center">
                  <input
                    checked={!bidirectionalArrows}
                    id="default-radio-1"
                    type="radio"
                    value="unidirectional"
                    name="default-radio"
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ml-2 font-medium text-gray-900 dark:text-gray-300"
                  >
                    Unidirectional
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    checked={bidirectionalArrows}
                    id="default-radio-2"
                    type="radio"
                    value="bidirectional"
                    name="default-radio"
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label
                    htmlFor="default-radio-2"
                    className="ml-2 font-medium text-gray-900 dark:text-gray-300"
                  >
                    Bidirectional
                  </label>
                </div>
              </form>
            }
          />
        </>
      ) : (
        <>
          <ExpandableChip
            title="Shape"
            expTrue={sEtrue}
            expFalse={sEfalse}
            positioningCSS={"-top-[56px] 1eft-1.5"}
            objects={Object.keys(nodeShapeMap)
              // .slice(0, 4)
              .map((key, _) => {
                const getBpmn = nodeShapeMap[key][1].split("-")[0];
                const flag = getBpmn === "bpmn";
                return (
                  <>
                    <div
                      key={key}
                      className={`mx-1 !h-5 !w-5 cursor-pointer ${
                        flag ? "text-black" : "my-1  bg-neutral-600 "
                      }  !translate-x-0 !translate-y-0  transition-opacity duration-75 ease-in-out ${
                        key === "diamond"
                          ? "translate-x-[10px] translate-y-[9px] -rotate-45 rotate-45 rounded-md"
                          : nodeShapeMap[key][1]
                      }`}
                      id={key}
                      onClick={() => {
                        toggleDraggable(id, true);
                        updateShape(id, key);
                        setEditing(false);
                      }}
                    ></div>
                  </>
                );
              })}
          />
          <ExpandableChip
            title="Description"
            expTrue={dEtrue}
            expFalse={dEfalse}
            positioningCSS={"-top-8 left-14"}
            objects={
              <form onSubmit={(e) => handleSubmit(e)} autoComplete="off">
                <textarea
                  className={`h-14 w-full  border bg-transparent pl-1 text-center text-[10px] leading-[10px] text-black`}
                  name="description"
                  defaultValue={description}
                  placeholder="Enter a description for the node"
                  onKeyDown={handleChanges}
                />
              </form>
            }
          />

          <ExpandableChip
            title="Add Link"
            expTrue={Ltrue}
            expFalse={Lfalse}
            positioningCSS={"left-14 -top-[56px]"}
            objects={
              <div>
                <div className="absolute left-1 top-5 text-black">
                  <button
                    type="button"
                    className="absolute -top-[19px] right-2 flex whitespace-nowrap rounded-md bg-neutral-200 p-0.5 "
                    onClick={() => {
                      updateLinkNodes([], linkNodes.fileID);
                    }}
                  >
                    <BsArrowLeft className="h-4 w-4 pt-0" />
                    Back
                  </button>
                  {linkNodes.nodes &&
                  Object.keys(linkNodes.nodes).length !== 0 ? (
                    <div className="h-32 overflow-y-scroll" key={id}>
                      {
                        // ? Loop to generate tiles for the nodes
                        Object.keys(linkNodes.nodes).map((key, _) => {
                          const flag = "message" in linkNodes.nodes[key];
                          return (
                            <>
                              {flag ? (
                                <div
                                  className="flex h-full items-center justify-center p-1 text-red-500 "
                                  key={key}
                                >
                                  {linkNodes.nodes[key].message}
                                </div>
                              ) : (
                                <button
                                  key={key}
                                  id={key}
                                  type="button"
                                  onClick={(e) =>
                                    addLinkMethod(id, linkNodes.nodes[key].id)
                                  }
                                  className="my-0.5 w-36 cursor-pointer rounded-md border-[1px] px-2 py-1 text-left
                              font-medium
                               hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:border-gray-600
                               dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
                                >
                                  {linkNodes.nodes[key].data.label}
                                </button>
                              )}
                            </>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <div className="h-60 w-60 -translate-x-11 -translate-y-12  scale-[0.6] overflow-auto overflow-visible text-black">
                      <LinkTree />
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </>
      )}
      <form
        onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          setEditing(false);
          toggleDraggable(id, true);
          updateLabel(id, event.target.label.value);
        }}
        autoComplete="off"
      >
        <input
          className={`max-w-full rounded border-2 border-gray-700 bg-transparent pb-[2px] text-center text-xs focus:border-2 ${inputSize}`}
          autoFocus
          name="label"
          defaultValue={label}
        />
      </form>
    </div>
  );
}

export default memo(Editing);
