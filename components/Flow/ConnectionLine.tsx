//@ts-nocheck
/* This is the custom connection line that is used when connecting two nodes. */
const ConnectionLine = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  connectionLineType,
  connectionLineStyle,
}) => {
  // const y = getSmoothStepPath(sourceX,
  // sourceY,
  // sourcePosition,
  // targetX,
  // targetY,
  // targetPosition)
  // console.log(y);
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated dark:stroke-white"
        d={`M${sourceX},${sourceY} ${targetX},${targetY}`}
      />
      <circle
        cx={targetX}
        cy={targetY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
};

export default ConnectionLine;
