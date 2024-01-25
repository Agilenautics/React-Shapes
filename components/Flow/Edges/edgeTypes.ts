import CustomEdge from "./Edge";
/* This file contains a list of types of edges */
const edgeTypeMap:any = {
  customEdge: CustomEdge,
};

const edgeTypes = [
  "BrightblueNode",
  "BrightgreenNode",
  "BrightredNode",
  "BrightorangeNode",
  "BrightpurpleNode",
];

const edgeCSS = [
  [
    "border-node-blue-200 bg-node-blue-50 text-node-blue-200",
    "!stroke-node-blue-200 bg-node-blue-200 fill-node-blue-200",
  ],
  [
    "border-node-green-200 bg-node-green-50 text-node-green-200",
    "!stroke-node-green-200 bg-node-green-200 fill-node-green-200",
  ],
  [
    "border-node-red-200 bg-node-red-50 text-node-red-200",
    "!stroke-node-red-200 bg-node-red-200 fill-node-red-200",
  ],
  [
    "border-node-orange-200 bg-node-orange-50 text-node-orange-200",
    "!stroke-node-orange-200 bg-node-orange-200 fill-node-orange-200",
  ],
  [
    "border-node-purple-200 bg-node-purple-50 text-node-purple-200",
    "!stroke-node-purple-200 bg-node-purple-200 fill-node-purple-200",
  ],
];

const edgeCSSMap: any = Object.fromEntries(
  edgeTypes.map((_, i) => [edgeTypes[i], edgeCSS[i]])
);

export { edgeCSSMap, edgeTypeMap };
