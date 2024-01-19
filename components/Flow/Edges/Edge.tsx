import React, { useEffect, useState } from "react";
import { getSmoothStepPath, EdgeLabelRenderer, EdgeProps } from "reactflow";
import edgeStore from "./edgeStore";
import "reactflow/dist/style.css";
import nodeStore from "../Nodes/nodeStore";
import EdgeEditing from "./EdgeEditing";

const CustomEdge: React.ComponentType<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [editing, setEditing] = useState({
    active: false,
    type: "",
  });
  const [edgeData, setEdgeData] = useState(data);
  const [selected, setSelected] = useState(false);
  const { updateLabel, updateEdgeCSS: updateEdgeType } = edgeStore();
  const { updateDescription } = nodeStore();
  // const [lineColor, setLineColor] = useState("green");
  const markerStartCheck = edgeData.bidirectional
    ? `url(#marker-end-${id})`
    : `url(#marker-start-${id})`;
  // useEffect(() => {
  //   const lineColorPath = data.pathCSS.split(" ").slice(-1)[0];
  //   const fillPath = lineColorPath.split("-").slice(0, 3).join("-");
  //   const strokeWidth = lineColorPath.split("-").slice(-1)[0];
  //   setLineColor(lineColors[fillPath][strokeWidth]);
  // }, [data.pathCSS]);

  const markerSize = 6; // Adjust the size of the markers here

  // const onhandleEdgeLine = () => {
  //   setEditing(true);
  // };
  const handleToggleEditing = (type: string) => {
    setEditing((prevEditing) => ({
      ...prevEditing,
      type: prevEditing.type === type ? "" : type,
    }));
  };

  return (
    <>
      {/* <defs>
        <marker
          key={`circle-${edgeData.id}`}
          id={`circle-${edgeData.id}`}
          fill={edgeData.pathCSS} // Use lineColor variable as fill color
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="3"
          markerHeight="3"
        >
          <circle cx="5" cy="5" r="5" />
        </marker>
        <marker
          key={`arrow-${edgeData.id}`}
          id={`arrow-${edgeData.id}`}
          fill={edgeData.pathCSS} // Use lineColor variable as fill color
          viewBox="0 -5 10 10"
          refX="5"
          refY="0"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0,-5L10,0L0,5" fill={edgeData.pathCSS}></path>
        </marker>
      </defs> */}

      {/* Edge marker at the end */}
      <marker
        id={`marker-end-${id}`}
        markerWidth={markerSize}
        markerHeight={markerSize}
        refX={markerSize / 2}
        refY={markerSize / 2}
        orient="auto-start-reverse"
        fill={edgeData.pathCSS} // Set the same color for the marker
      >
        <path
          d={`M0,0 L0,${markerSize} L${markerSize},${markerSize / 2} z`}
          className="edge-marker"
        />
        {/* Smaller arrow */}
      </marker>
      {/* Edge marker at the start */}
      <marker
        id={`marker-start-${id}`}
        markerWidth={markerSize}
        markerHeight={markerSize}
        refX={markerSize / 2}
        refY={markerSize / 2} // Orient the marker at the start of the edge
        fill={edgeData.pathCSS} // Set the same color for the marker
      >
        <circle cx={markerSize / 2} cy={markerSize / 2} r={markerSize / 3} />{" "}
        {/* Smaller circle */}
      </marker>

      {/* Edge path */}
      <path
        key={id}
        id={id}
        style={{ stroke: `${edgeData.pathCSS}` }}
        className={`react-flow__edge-path border ${edgeData.pathCSS} ${
          selected ? "!stroke-[2]" : ""
        }`}
        d={edgePath}
        markerStart={markerStartCheck} // Add the start marker
        markerEnd={`url(#marker-end-${id})`} // Add the end marker
        onClick={() => {
          setSelected(!selected);
        }}
        onDoubleClick={() => {
          setEditing((prevEditing) => ({
            ...prevEditing,
            active: !prevEditing.active,
          }));
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            pointerEvents: "all",
          }}
        >
          {editing.active ? (
            <>
              <div
                style={{
                  position: "absolute",
                  transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                }}
                className="flex flex-col items-center"
              >
                <EdgeEditing
                  id={id}
                  labelX={labelX}
                  labelY={labelY}
                  data={edgeData}
                  setEdgeData={setEdgeData}
                  editing={editing}
                  setEditing={setEditing}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  transform: `translate(-50%, -50%) translate(${labelX}px,${
                    labelY + 30
                  }px)`,
                }}
                className="flex w-14 translate-y-4 items-center justify-around rounded border border-[#C0D5E7] bg-white py-1 shadow-md"
              >
                <button
                  className="h-3 w-3"
                  onClick={() => handleToggleEditing("arrows")}
                >
                  <img
                    src="/assets/editingEdgeIcons/RightGreen.svg"
                    alt="edgedirection"
                  />
                </button>
                <button
                  onClick={() => handleToggleEditing("colors")}
                  style={{ backgroundColor: `${edgeData.pathCSS}` }}
                  className={`h-3 w-3 cursor-pointer rounded-full`}
                ></button>
                <button
                  className="h-3 w-3"
                  onClick={() => handleToggleEditing("label")}
                >
                  <img
                    src="/assets/editingEdgeIcons/Text.svg"
                    alt="edgedirection"
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              {edgeData.label ? (
                <div
                  onClick={(e) => {
                    setEditing((prevEditing) => ({
                      ...prevEditing,
                      active: !prevEditing.active,
                      type: "label",
                    }));
                  }}
                  style={{
                    position: "absolute",
                    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    borderColor: `${edgeData.pathCSS}`,
                    color: `${edgeData.pathCSS}`,
                  }}
                  className={`w-11 rounded-[30px] border bg-white text-center text-[7px] outline-0`}
                >
                  {edgeData.label}
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                  }}
                  className="cursor-pointer"
                  onClick={(e) => {
                    setEditing((prevEditing) => ({
                      ...prevEditing,
                      active: !prevEditing.active,
                    }));
                  }}
                >
                  <img
                    className="h-3 w-3"
                    src="/assets/editingEdgeIcons/add-square.svg"
                    alt="Edit_Edge"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
