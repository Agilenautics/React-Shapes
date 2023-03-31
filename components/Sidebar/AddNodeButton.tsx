import { useMutation } from "@apollo/client";
import { updateEdge, useReactFlow } from "react-flow-renderer";
import { MdOutlineAdd } from "react-icons/md";
import { newNode, createNode } from "../Flow/Nodes/gqlNodes";
import nodeStore from "../Flow/Nodes/nodeStore";
import fileStore from "../TreeView/fileStore";
/**
 * This is a FAB that is positioned over the minimap view.
 * @returns A button that when clicked will add a new node to the graph at a fixed position.
 */
function AddNodeButton() {
  const currentFlowchart = fileStore((state) => state.currentFlowchart);
  const currentId = fileStore((state)=> state.Id);
  console.log (currentId,"file id");
  const updateNode = nodeStore((state)=>state.updateNodes)

  return (
    <div className="absolute bottom-48 right-10">
      <button
        type="button"
        className="inline-flex items-center rounded-3xl bg-blue-600 p-2.5 text-center text-sm
         text-white shadow-lg shadow-blue-300 transition-all hover:bg-blue-700 focus:outline-none dark:shadow-blue-800"
        onClick={()=>createNode(newNode,currentId,currentFlowchart,updateNode)} 
      >
        <MdOutlineAdd className="h-10 w-10" />
      </button>
    </div>
  );
}

export default AddNodeButton;
