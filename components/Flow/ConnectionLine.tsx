/* This is the custom connection line that is used when connecting two nodes. */
import React from "react";
import { ConnectionLineComponent } from "reactflow";
const ConnectionLine: ConnectionLineComponent = ({
  fromX,
  fromY,
  toX,
  toY,
}) => {
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
};

export default ConnectionLine;
