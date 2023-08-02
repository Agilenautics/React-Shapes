import { useEffect, useState } from "react";
import { Editing } from "../Editing";
import {
  getSmoothStepPath,
  getBezierPath,
  Position,
} from "reactflow";
import edgeStore from "./edgeStore";
const fO = 144;
const fOHeight = fO;
const fOWidth = fO + 100;
import 'reactflow/dist/style.css';
import { edgeCSSMap } from "./edgeTypes";
import nodeStore from "../Nodes/nodeStore";
import { EdgeTypes } from "reactflow";
import { lineColors } from "../constants";

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
    id:string;
    label: string;
    pathCSS: string;
    boxCSS: string;
    bidirectional: boolean;
  };
  style: Object;
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(false);
  const updateLabel = edgeStore((state) => state.updateLabel);
  const updateEdgeType = edgeStore((state) => state.updateEdgeCSS);
  const updateDescription = nodeStore((state) => state.updateDescription);
  const [lineColor, setLineColor] = useState("green");
  const markerStartCheck = data.bidirectional
    ? `url(#marker-end-${id})`
    : `url(#marker-start-${id})`;
  useEffect(() => {
    const lineColorPath = data.pathCSS.split(" ").slice(-1)[0];
    const fillPath = lineColorPath.split("-").slice(0, 3).join("-");
    const strokeWidth = lineColorPath.split("-").slice(-1)[0];
    // @ts-ignore
    setLineColor(lineColors[fillPath][strokeWidth]);
  }, [data.pathCSS]);

  const markerSize = 6; // Adjust the size of the markers here

  return (
    <>

      {/* Edge marker at the end */}
      <marker
        id={`marker-end-${id}`}
        markerWidth={markerSize}
        markerHeight={markerSize}
        refX={markerSize / 2}
        refY={markerSize / 2}
        orient="auto-start-reverse"
        fill={lineColor} // Set the same color for the marker
      >
        <path d={`M0,0 L0,${markerSize} L${markerSize},${markerSize / 2} z`} className="edge-marker" /> {/* Smaller arrow */}
      </marker>
      {/* Edge marker at the start */}
      <marker
        id={`marker-start-${id}`}
        markerWidth={markerSize}
        markerHeight={markerSize}
        refX={markerSize / 2}
        refY={markerSize / 2} // Orient the marker at the start of the edge
        fill={lineColor} // Set the same color for the marker
      >
        <circle cx={markerSize / 2} cy={markerSize / 2} r={markerSize / 3} /> {/* Smaller circle */}
      </marker>

      {/* Edge path */}
      <path
        key={id}
        id={id}
        style={style}
        className={`react-flow__edge-path ${data.pathCSS} ${
          selected ? "!stroke-[5]" : ""
        }`}
        d={edgePath}
        markerStart={markerStartCheck} // Add the start marker
        markerEnd={`url(#marker-end-${id})`} // Add the end marker
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
        x={labelX - fOWidth / 2}
        y={labelY - 145 / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="flex h-full items-center justify-center">
          {data.label.length !== 0 ? (
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
