import { useState } from "react";
import { Editing } from "../Editing";
import {
  getSmoothStepPath,
  getEdgeCenter,
  Position,
} from "react-flow-renderer";
import edgeStore from "./edgeStore";
const fO = 144;
const fOHeight = fO;
const fOWidth = fO + 100;

import { edgeCSSMap } from "./edgeTypes";
import nodeStore from "../Nodes/nodeStore";
// ! The label placement needs to be improved
/* This is the custom node component that is used */
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}: {
  id: any;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  data: {
    id: string;
    label: string;
    pathCSS: string;
    boxCSS: string;
    bidirectional: boolean;
  };
  style: Object;
}) {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(false);
  const updateLabel = edgeStore((state) => state.updateLabel);
  const updateEdgeType = edgeStore((state) => state.updateEdgeCSS);
  const markerFill = edgeStore((state) => state.markerFill);

  const updateDescription = nodeStore((state) => state.updateDescription);
  const markerStart = data.bidirectional
    ? `url(#arrow-${data.id})`
    : `url(#circle-${data.id})`;
  const markerEnd = `url(#arrow-${data.id})`;

  return (
    <>
      <defs>
        {markerFill.map((fill, i) => (
          <marker
            key={`circle-${data.id}-${fill}`}
            id={`circle-${data.id}`}
            fill={fill}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="3"
            markerHeight="3"
          >
            <circle cx="5" cy="5" r="5" />
          </marker>
        ))}
        {markerFill.map((fill, i) => (
          <marker
            key={`arrow-${data.id}-${fill}`}
            id={`arrow-${data.id}`}
            fill={fill}
            viewBox="0 -5 10 10"
            refX="5"
            refY="0"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,-5L10,0L0,5"></path>
          </marker>
        ))}
      </defs>

      <path
        key={id}
        id={id}
        style={style}
        className={`react-flow__edge-path ${data.pathCSS} ${
          selected ? "!stroke-[5]" : ""
        }`}
        d={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        onClick={() => {
          setSelected(!selected);
        }}
        onDoubleClick={() => {
          setEditing(true);
        }}
      />

      <foreignObject
        // className="bg-red-200" // ? For debugging purposes
        width={fOWidth}
        height={fOHeight}
        x={edgeCenterX - fOWidth / 2}
        y={edgeCenterY - 145 / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="flex h-full items-center justify-center">
          {data.label.length != 0 ? (
            <div
              className={`rounded-lg !bg-white p-0.5 text-sm dark:!bg-neutral-900 ${data.boxCSS}`}
              onDoubleClick={() => {
                setEditing(true);
              }}
            >
              {editing ? (
                <div className="text-xs">
                  <Editing
                    key={id}
                    isEdge={true}
                    toggleDraggable={() => {}}
                    id={id}
                    updateNodeType={updateEdgeType}
                    setEditing={setEditing}
                    updateLabel={updateLabel}
                    updateDescription={updateDescription}
                    label={data.label}
                    CSSMap={edgeCSSMap}
                    description=""
                    bidirectionalArrows={data.bidirectional}
                  />
                </div>
              ) : (
                <p>{data.label}</p>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </foreignObject>
    </>
  );
}
