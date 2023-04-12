import { Editing } from "../Editing";
import { useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import nodeStore from "./nodeStore";
import { nodeCSSMap, nodeShapeMap } from "./nodeTypes";
import fileStore from "../../TreeView/fileStore";
import edgeStore from "../Edges/edgeStore";
import Tags from "./Tags";
import Progress from "./Progress";

/* This is the custom node component that is used */
function PrototypicalNode(css_props: string, data: object, id: string) {
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
  // @ts-ignore
  const label = data.label;
  // @ts-ignore
  const shapeCSS = nodeShapeMap[data.shape];
  // @ts-ignore
  const description = data.description;
//const Id=id;
console.log (id,"node id");
  return (
    <div>
      <div className={`rounded bg-transparent p-1 py-2 ${shapeCSS[0]} group`}>
        {
          // ? Loop to generate 4 handles
          Object.keys(handlePositions).map((key, _) => (
            <Handle
              type="source"
              key={key}
              className="handle"
              position={handlePositions[key]}
              id={key}
            />
          ))
        }
        <div
          className={`${css_props} font-sans ${
            shapeCSS[1]
          } mx-1 flex h-8 items-center justify-center border-b-2 border-r-2 text-xs font-normal shadow-md ${
            editing ? "cursor-default" : ""
          }`}
          onDoubleClick={() => {
            //console.log(id);
            setEditing(true);
            toggleDraggable(id, false);
          }}
        >
          <div className={shapeCSS[2]}>
            {editing ? (
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
                bidirectionalArrows={false}
              />
            ) : (
              <p>{label}</p>
            )}
          </div>
        </div>
      </div>
      {/* <Tags /> */}
      <Progress progress={0} />
    </div>
  );
}

// ! These functions have basically become outdated since you can change
// ! the CSS directly, so need to phase this out by changing how the nodes
// ! are updated.

//@ts-ignore
function BrightblueNode({ data, id }) {
  return PrototypicalNode(
    "border-node-blue-100 bg-node-blue-200 text-white",
    data,
    id
  );
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
