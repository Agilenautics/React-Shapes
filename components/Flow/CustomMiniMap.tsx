import React from "react";
import { MiniMapNodeProps } from "reactflow";
const CustomMiniMap: React.ComponentType<MiniMapNodeProps> = ({
  id,
  x,
  y,
  width,
  height,
  className,
  borderRadius,
  shapeRendering,
  strokeColor,
  strokeWidth,
  style,
  selected,
  onClick,
}) => {
  console.log(
    // id,
    // x,
    // y,
    // width,
    // height,
    // className,
    // borderRadius,
    // shapeRendering,
    // strokeColor,
    // strokeWidth,
    // style,
    // selected,
    // onClick
  );

  return (
    // <svg width={width} height={height}>
      <circle cx={x} cy={y} r={40} shapeRendering={shapeRendering} strokeWidth={strokeWidth}  stroke="red"  />
    // </svg>
  );
};
export default CustomMiniMap;
