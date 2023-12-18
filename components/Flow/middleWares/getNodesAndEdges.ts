import { File } from "../../../lib/appInterfaces";
import getEdgesMiddleWare from "./getEdgesMiddleware";

const getNodeAndEdges = (file: File | any) => {
  const { hasNodes } = file;
  const getEdges = getEdgesMiddleWare(hasNodes);
  return { nodes: hasNodes, edges: getEdges };
};

export default getNodeAndEdges;
