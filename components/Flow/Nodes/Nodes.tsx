import Editing from "../Editing";
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import nodeStore from "./nodeStore";
import { nodeCSSMap, nodeShapeMap } from "./nodeTypes";
import fileStore from "../../TreeView/fileStore";
import edgeStore from "../Edges/edgeStore";
import { BiArrowToRight, BiArrowBack } from "react-icons/bi";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { useRouter } from "next/router";

/* This is the custom node component that is used */
function PrototypicalNode(css_props: string, data: any, id: string) {
  const [editing, setEditing] = useState(false);
  const handlePositions: { [id: string]: Position } = {
    a: Position.Left,
    b: Position.Top,
    c: Position.Right,
    d: Position.Bottom,
  };
  const updateLabel = nodeStore((state) => state.updateLabel);
  const updateNodeType = nodeStore((state) => state.updateNodeType);
  const toggleDraggable = nodeStore((state) => state.toggleDraggable);
  const updateNodes = nodeStore((state) => state.updateNodes);
  const findFile = fileStore((state) => state.find_file);
  const updateDescription = nodeStore((state) => state.updateDescription);
  const updateBreadCrumbs = nodeStore((state) => state.updateBreadCrumbs);

  const router = useRouter();
  const projectId = router.query.projectId as string;

  const label = data.label;
  const shapeCSS = nodeShapeMap[data.shape];
  const description = data.description;
  // let getBpmn = shapeCSS[1]?.split("-")[0];
  // console.log(shapeCSS[1],getBpmn)
  // const flag = getBpmn === "bpmn";
  const linkedTo = () => {
    const x = findFile(data.isLinked.hasFile.id);
    // @ts-ignore
    const nodes = x.hasNodes;
    console.log(nodes);
    const nodeData = nodes.map((items: any) => {
      const { x, y, label, shape, ...rest } = items;
      return { ...rest, data: { label, shape }, position: { x, y } };
    });
    // const edges = x.hasEdges;
    // const edgeData = JSON.stringify(edges).replaceAll(
    //   '"hasedgedataEdgedata":',
    //   '"data":'
    // );
    if (x.children == null) {
      // @ts-ignore
      //updateEdges(JSON.parse(edgeData));
      updateNodes(nodeData);
    }
    updateBreadCrumbs(x, x.id, "push");
  };

  // const linkedBy = () => {
  //   const x = findFile(data.hasLinkedBy.fileId);
  //   // @ts-ignore
  //   const nodes = x.hasNodes;
  //   const nodeData = JSON.stringify(nodes)
  //     .replaceAll('"hasdataNodedata":', '"data":')
  //     .replaceAll('"haspositionPosition":', '"position":');
  //   // @ts-ignore
  //   const edges = x.hasEdges;
  //   const edgeData = JSON.stringify(edges).replaceAll(
  //     '"hasedgedataEdgedata":',
  //     '"data":'
  //   );
  //   if (x.children == null) {
  //     updateEdges(JSON.parse(edgeData));
  //     updateNodes(JSON.parse(nodeData));
  //   }
  //   updateBreadCrumbs(x, x.id, "new");
  // };

  const toDetails = (nodeId: string) => {
    router.push({
      pathname: `/projects/${projectId}/backlogs/edit/`,
      query: { id: nodeId },
    });
  };
  return (
    <div>
      <div
        className={`rounded bg-transparent p-1 py-2 ${shapeCSS[0]}  group relative`}
      >
        {Object.keys(handlePositions).map((key) => (
          <Handle
            type="source"
            key={key}
            className="handle relative"
            position={handlePositions[key]}
            id={key}
          />
        ))}

        {/* here iam performing toolTip of description */}
        {description ? (
          <div className="invisible absolute top-full  z-10 mt-2 whitespace-nowrap rounded border bg-slate-50 p-1 text-xs font-extralight transition  group-hover:visible dark:text-black">
            {description}
          </div>
        ) : null}

        <div
          className={`${css_props} h-auto font-sans ${
            shapeCSS[1]
          } mx-1 flex  items-center justify-center border-b-2 text-xs font-normal shadow-md ${
            editing ? "cursor-default" : ""
          }`}
          onDoubleClick={() => {
            if (!(shapeCSS[1].substring(0, 4) === "bpmn")) {
              setEditing(true);
              toggleDraggable(id, false);
            }
          }}
        >
          <div className={shapeCSS[2]}>
            {editing ? (
              <div
              // className={`relative h-auto flex-row text-center ${
              //   data.hasLinkedTo.flag && "mt-7"
              // }`}
              >
                <Editing
                  isEdge={false}
                  toggleDraggable={toggleDraggable}
                  id={id}
                  updateNodeType={updateNodeType}
                  setEditing={setEditing}
                  updateLabel={updateLabel}
                  label={label}
                  CSSMap={nodeCSSMap}
                  description={description}
                  updateDescription={updateDescription}
                  bidirectionalArrows={false}
                />
                {/* {data.isLinkedConnection.edges.flag ? (
                  <div
                    className="flex h-auto h-auto cursor-pointer rounded border bg-white p-1 text-xs text-gray-800 hover:bg-slate-100 dark:text-black "
                    onClick={linkedTo}
                  >
                    <div className="h-auto text-xs ">
                      {" "}
                      {data.hasLinkedTo.label}{" "}
                    </div>
                    <div>
                      <BiArrowToRight className="h-4 w-4" />{" "}
                    </div>
                  </div>
                ) : null} */}
              </div>
            ) : (
              <div>
                {/* {flag ? null : ( */}
                <p className="py-1 text-center text-[0.6rem]">{label}</p>
                {/* )} */}
                {/*{data.hasLinkedTo.flag ? (
                  <div
                    className="absolute left-36 top-12 flex min-w-max cursor-pointer rounded border bg-white p-1 text-xs text-gray-800 hover:bg-slate-100 dark:text-black "
                    onClick={linkedTo}
                  >
                    <div className="text-xs"> {data.hasLinkedTo.label} </div>
                    <div>
                      <BiArrowToRight className="h-4 w-4" />
                    </div>
                  </div>
               ) : null} */}
              </div>
            )}
            {/* LinkedTo */}

            {/* linked by node  */}
            {
              // @ts-ignore
              // data.hasLinkedBy.flag ? (
              //   <div
              //     className="absolute right-24 top-16 flex min-w-max cursor-pointer rounded border bg-white p-1 text-xs text-gray-800 hover:bg-slate-100 dark:text-black "
              //     onClick={linkedBy}
              //   >
              //     <div className="text-xs"> {data.hasLinkedBy.label} </div>
              //     <div>
              //       <BiArrowBack className="h-4 w-4" />{" "}
              //     </div>
              //   </div>
              // ) : null
            }
          </div>
        </div>
      </div>
      {/* <Tags /> */}
      {/* <Progress progress={11} /> */}
    </div>
  );
}

// ! These functions have basically become outdated since you can change
// ! the CSS directly, so need to phase this out by changing how the nodes
// ! are updated.
//@ts-ignore
function defaultNode({ data, id }) {
  return PrototypicalNode(
    "border-slate-400 bg-slate-300 text-slate-900",
    data,
    id
  );
}

//@ts-ignore
function BrightblueNode({ data, id }) {
  return PrototypicalNode(
    "border-node-blue-100 bg-node-blue-200 text-white",
    data,
    id
  );
  // return PrototypicalNode(
  //   "border-node-blue-100 bg-node-blue-200 text-white",
  //   data,
  //   id
  // );
}
//@ts-ignore
function blueNode({ data, id }) {
  return PrototypicalNode(
    "border-node-blue-100 bg-node-blue-50 text-node-blue-200",
    data,
    id
  );
}

//@ts-ignore
function BrightgreenNode({ data, id }) {
  return PrototypicalNode(
    "border-node-green-100 bg-node-green-200 text-white",
    data,
    id
  );
}
//@ts-ignore
function greenNode({ data, id }) {
  return PrototypicalNode(
    "border-node-green-100 bg-node-green-50 text-node-green-200",
    data,
    id
  );
}

//@ts-ignore
function BrightredNode({ data, id }) {
  return PrototypicalNode(
    "border-node-red-100 bg-node-red-200 text-white",
    data,
    id
  );
}
//@ts-ignore
function redNode({ data, id }) {
  return PrototypicalNode(
    "border-node-red-100 bg-node-red-50 text-node-red-200",
    data,
    id
  );
}
//@ts-ignore
function BrightorangeNode({ data, id }) {
  return PrototypicalNode(
    "border-node-orange-100 bg-node-orange-200 text-white",
    data,
    id
  );
}
//@ts-ignore
function orangeNode({ data, id }) {
  return PrototypicalNode(
    "border-node-orange-100 bg-node-orange-50 text-node-orange-200",
    data,
    id
  );
}
//@ts-ignore
function BrightpurpleNode({ data, id }) {
  return PrototypicalNode(
    "border-node-purple-100 bg-node-purple-200 text-white",
    data,
    id
  );
}
//@ts-ignore
function purpleNode({ data, id }) {
  return PrototypicalNode(
    "border-node-purple-100 bg-node-purple-50 text-node-purple-200",
    data,
    id
  );
}
// @ts-ignore
function WelcomeNode({ data, id }) {
  // @ts-ignore
  const label = data.label;

  return (
    <div className="group h-32 w-40 cursor-default rounded border-2 border-gray-300 bg-transparent p-1 py-2 text-gray-500">
      <p>{label}</p>
    </div>
  );
}
export {
  defaultNode,
  BrightblueNode,
  blueNode,
  BrightgreenNode,
  greenNode,
  BrightredNode,
  redNode,
  BrightorangeNode,
  orangeNode,
  BrightpurpleNode,
  purpleNode,
  WelcomeNode,
};
