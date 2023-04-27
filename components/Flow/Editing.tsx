import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { nodeShapeMap } from "./Nodes/nodeTypes";
import nodeStore from "./Nodes/nodeStore";
import edgeStore from "./Edges/edgeStore";
import { LinkTree } from "../TreeView/fileRenderer";
import fileStore from "../TreeView/fileStore";
import { BsArrowLeft } from "react-icons/bs";
import { findNode, getNode } from "./Nodes/gqlNodes";
import { getFile, getFileByNode } from "../TreeView/gqlFiles";

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
      className={`absolute overflow-hidden rounded-lg border-[1px] border-neutral-500 bg-white shadow transition-all duration-100 ease-in-out ${isCollapsed ? expTrue : expFalse
        } ${positioningCSS} dark:bg-neutral-900 `}
    >
      <div className="ml-1 mt-[1px] flex text-black dark:text-white">
        <div className="flex-none">{title}</div>
        <FiChevronRight
          className={`-mt-[2px] h-5 w-5 flex-none cursor-pointer stroke-slate-800 transition-transform dark:stroke-slate-200 ${isCollapsed ? "" : "rotate-90"
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

/* A React component that is used to edit the properties of a node or edge.*/
export function Editing({
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
  CSSMap: object;
  description: string;
  updateDescription: Function
  bidirectionalArrows: boolean;
}) {
  const pEtrue = isEdge ? "w-14 h-5 top-10" : "w-14 h-5 -top-5";
  const pEfalse = isEdge ? "w-36 h-[52px] top-10" : "w-36 h-20 -top-5";
  const sEfalse = "w-24 h-14 ";
  const dEtrue = "w-[90px] h-5";
  const dEfalse = "w-[90px] h-20";
  const Ltrue = "w-[70px] h-5";
  const Lfalse = "w-40 h-40";
  const Atrue = "w-[70px] h-5";
  const Afalse = "w-28 h-20";
  const leftPositioning = isEdge ? "left-8" : "left-1";
  const inputSize = isEdge ? "w-14 h-4" : "h-6 w-28";
  const updateShape = nodeStore((state) => state.updateShape);
  const updateArrows = edgeStore((state) => state.updateArrows);
  const linkNodes = fileStore((state) => state.linkNodes);
  const updateLinkNodes = fileStore((state) => state.updateLinkNodes);
  const updateLinks = nodeStore((state) => state.updateLinks);
  const linkNodeId = fileStore((state) => state.linkNodeId)
  const updateLinkedBy = nodeStore((state) => state.updateLinkedBy)






  const addLinkMethod = async (key: string) => {
    //id of the current node 
    const id = linkNodes.nodes[key].id;

    // finding the node to collect the label of the node 
    let nodeData = await findNode(getNode, linkNodeId)

    // getting the current file data 
    const { data } = await getFileByNode(linkNodeId, getFile)

    updateLinks(linkNodeId, { label: linkNodes.nodes[key].hasdataNodedata.label, flag: true, id, fileId: linkNodes.fileID })

    updateLinkedBy(id, { label: nodeData[0].data.label, id: linkNodeId, fileId: data.files[0].id, flag: true }, getFile)
  }

  const handleSubmit = (event:any) =>{
    event.preventDefault()
    updateDescription(id,event.target.description.value)
  }

  const handleChanges = (event:any) =>{
    if(event.keyCode==13) updateDescription(id,event.target.value)
  }



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
            ${
              // @ts-ignore
              isEdge ? CSSMap[key][1] : CSSMap[key]
              }`}
            id={key}
            onClick={() => {
              toggleDraggable(id, true);
              // @ts-ignore
              updateNodeType(id, isEdge ? CSSMap[key] : key);
            }}
          ></div>
        ))}
      />
      {isEdge ? (
        <div>
          <ExpandableChip
            title="Arrows"
            expTrue={Atrue}
            expFalse={Afalse}
            positioningCSS={"left-[90px] top-10"}
            objects={
              <form
                className="scale-75"
                onChange={(e) =>
                  // @ts-ignore
                  updateArrows(id, e.target.value === "bidirectional")
                }
              >
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
        </div>
      ) : (
        <div>
          <ExpandableChip
            title="Shape"
            expTrue={pEtrue}
            expFalse={sEfalse}
            positioningCSS={"left-16 -top-5"}
            objects={Object.keys(nodeShapeMap).map((key, _) => (
              <div
                key={key}
                // @ts-ignore
                className={`mx-1 my-1 !h-5 !w-5 !translate-x-0 !translate-y-0 cursor-pointer bg-neutral-600 transition-opacity duration-75 ease-in-out ${nodeShapeMap[key][1]}`}
                id={key}
                onClick={() => {
                  toggleDraggable(id, true);
                  updateShape(id, key);
                }}
              ></div>
            ))}
          />
          <ExpandableChip
            title="Description"
            expTrue={dEtrue}
            expFalse={dEfalse}
            positioningCSS={"left-1 -top-12"}
            objects={
              <form
              onSubmit={(e)=>handleSubmit(e)}
                autoComplete="off"
              >
                <textarea
                  className={`h-14 w-full  bg-transparent pl-1 text-center border text-[10px] leading-[10px] text-black`}
                  name="description" //@ts-ignore
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
            positioningCSS={"left-24 -top-12"}
            objects={
              <div>
                <div className="absolute top-5 left-1 text-black">
                  <button
                    type="button"
                    className="absolute right-2 -top-[19px] flex whitespace-nowrap rounded-md bg-neutral-200 p-0.5"
                    onClick={() => {
                      updateLinkNodes({}, linkNodes.fileID);
                    }}
                  >
                    <BsArrowLeft className="h-4 w-4 pt-0" />
                    Back
                  </button>
                  {linkNodes.nodes &&
                    Object.keys(linkNodes.nodes).length !== 0 ? (
                    <div className="h-32 overflow-y-scroll">
                      {
                        // ? Loop to generate tiles for the nodes
                        Object.keys(linkNodes.nodes).map((key, _) => (
                          <button
                            key={key}
                            id={key}
                            type="button"
                            onClick={(e) => addLinkMethod(key)}
                            className="my-0.5 w-36 cursor-pointer rounded-md border-[1px] px-2 py-1 text-left
                              font-medium
                               hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:border-gray-600
                              dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
                          >
                            {linkNodes.nodes[key].hasdataNodedata.label}
                          </button>
                        ))
                      }
                    </div>
                  ) : (
                    <div className=" -translate-x-10 -translate-y-5 scale-75 overflow-visible text-black">
                      <div className="h-40 w-60">
                        <LinkTree />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </div>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setEditing(false);
          toggleDraggable(id, true);
          // @ts-expect-error
          updateLabel(id, event.target.label.value);
        }}
        autoComplete="off"
      >
        <input
          className={`max-w-full rounded border-2 border-gray-700 bg-transparent pb-[2px] text-center text-xs focus:border-2 ${inputSize}`}
          autoFocus
          name="label" //@ts-ignore
          defaultValue={label}
        />
      </form>
    </div>
  );
}
