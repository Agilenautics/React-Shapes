import React, { memo, useRef, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { nodeShapeMap } from "./nodeTypes";
import NodeEditing from "./NodesEditing";

const CustomNode: React.ComponentType<NodeProps> = ({ id, data }) => {
  const [editing, setEditing] = useState({
    flag: false,
    type: "",
  });
  const shapeRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isLinkFlag, setIsLinkFlag] = useState<Boolean>(false);
  const label = data.label;
  const shapeCSS = nodeShapeMap[data.shape];

  const handlePosition: { [id: string]: Position } = {
    a: Position.Left,
    b: Position.Top,
    c: Position.Right,
    d: Position.Bottom,
  };

  return (
    <div className="relative p-[3px]">
      <div className={`${shapeCSS[0]} group`} ref={shapeRef}>
        {Object.keys(handlePosition).map((key) => (
          <Handle
            type="source"
            key={key}
            className="handle"
            position={handlePosition[key]}
            id={key}
          />
        ))}
        <div
          onDoubleClick={() => {
            if (!(shapeCSS[1].substring(0, 4) === "bpmn")) {
              setEditing({
                type: "",
                flag: !editing.flag,
              });
              //   toggleDraggable(id, !editing);
            }
          }}
          style={{
            backgroundColor: data.nodeColor,
          }}
          className={`${shapeCSS[1]} flex items-center justify-center p-1 text-xs`}
        >
          <div
            style={{
              color: "#FFFF",
            }}
            className={`${shapeCSS[2]}  `}
          >
            {label}
          </div>
        </div>
      </div>
      {/* progress or links icons */}

      {editing.flag && shapeRef.current && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: shapeRef.current.offsetHeight + 12,
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative rounded-sm border border-blue-300 bg-white px-2 py-1 shadow-md">
            <NodeEditing
              id={id}
              data={data}
              editing={editing}
              setEditing={setEditing}
            />
            <div className="flex items-center justify-center gap-3 px-1 py-0.5 text-sm">
              <button
                className={`h-4 w-4 `}
                onClick={() => {
                  setEditing({
                    flag: true,
                    type: editing.type?"":"Shape" ,
                  });
                }}
              >
                <img src="/icons/shapes.svg" alt="Shape" />
              </button>
              <button
                style={{ backgroundColor: data.nodeColor }}
                className="h-4 w-4 rounded-full"
                onClick={() => {
                  setEditing({
                    flag: true,
                    type: "Color",
                  });
                }}
              ></button>
              <button
                className={`h-4 w-4 `}
                onClick={() => {
                  setEditing({
                    flag: true,
                    type: "Link",
                  });
                }}
              >
                <img
                  src="/icons/arrow-up.svg"
                  alt="Link"
                  style={{ height: "100%", width: "100%" }}
                />
              </button>
              <button
                className={`h-4 w-4`}
                onClick={() => {
                  setEditing({
                    flag: editing.flag,
                    type: "Description",
                  });
                }}
              >
                <img src="/icons/message-text.svg" alt="Description" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 
      {data.isLinked && data.isLinked.length !== 0 && (
        <div className="flex justify-end">
          <div className="w-auto rounded border px-1 text-[0.5rem]">
            <span
              className="cursor-pointer"
              onClick={() => setIsLinkFlag(!isLinkFlag)}
            >
              Links <BiArrowToRight className="inline" />
            </span>
            {isLinkFlag && (
              <>
                {data.isLinked.map((value: any, index: number) => {
                  const {
                    label,
                    id: nodeId,
                    hasFile: { id: fileId },
                  } = value;

                  return (
                    <div
                      key={index}
                      className="flex cursor-pointer justify-between gap-1"
                    >
                      <div
                        className="hover:underline"
                        onClick={() => linkedTo(fileId)}
                      >
                        {label}
                      </div>
                      <div
                        className="flex cursor-pointer items-center justify-center"
                        onClick={() => delete_link_node(id, nodeId)}
                      >
                        <RxCross2 />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default memo(CustomNode);
