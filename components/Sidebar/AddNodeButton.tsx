import { useState } from "react";
import { useMutation } from "@apollo/client";
import { updateEdge, useReactFlow } from "reactflow";
import { MdOutlineAdd } from "react-icons/md";
import { newNode, createNode } from "../Flow/Nodes/gqlNodes";
import nodeStore from "../Flow/Nodes/nodeStore";
import fileStore from "../TreeView/fileStore";
import LoadingIcon from "../LoadingIcon";

/**
 * This is a FAB that is positioned over the minimap view.
 * @returns A button that when clicked will add a new node to the graph at a fixed position.
 */
//import LoadingIcon from "../LoadingIcon";
import { nodeShapeMap } from "../Flow/Nodes/nodeTypes";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import backlogStore from "../Backlogs/backlogStore";

function AddNodeButton() {
  const currentFlowchart = fileStore((state) => state.currentFlowchart);
  const currentId = fileStore((state) => state.Id);
  const updateNode = nodeStore((state) => state.updateNodes);
  const [isLoading, setIsLoading] = useState(false);
  const [isBPMNLoading, setIsBPMNLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedAdd, setIsExpandedAdd] = useState(false);
  const addRow = backlogStore(state => state.addRow);

  const handleAddNode = async (symbol: string) => {
    setIsExpandedAdd(!isExpandedAdd);
    setIsLoading(true);
    const data = {
      story : currentId,
      symbol,
      label : "New Node",
      type : "blueNode",
      description : "",
      assignedTo : "",
    }
    try {
      await createNode(newNode, updateNode, data, addRow);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBPMNClick = async (symbol: string) => {
    setIsExpanded(!isExpanded);
    setIsLoading(true);
    const data = {
      story : currentId,
      symbol,
      label : "",
      type : "defaultNode",
      description : "",
      assignedTo : "",
    }
    try {
      await createNode(newNode, updateNode, data, addRow);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-44 right-6">
      <div className="flex flex-col items-center space-y-4">
        {isExpandedAdd && (
          <div className="bg-white rounded-lg shadow p-4 max-h-40 overflow-y-auto">
            <div className="grid grid-cols-4 gap-1">
              <div className="col-span-4">
                <span className="font-sm">Shapes</span>
              </div>
              {Object.keys(nodeShapeMap).slice(0, 4).map((key, _) => (
                <div
                  key={key}
                  className={`mx-1 my-1 !h-5 !w-5 !translate-x-0 !translate-y-0 cursor-pointer bg-neutral-600 transition-opacity duration-75 ease-in-out ${
                    //@ts-ignore
                    nodeShapeMap[key][1]}`}
                  onClick={() => handleAddNode(key)}
                ></div>
              ))}
              <div className="col-span-4">
                <button className="font-sm" onClick={() => setIsExpanded(!isExpanded)}>
                  BPMN Shapes {isExpanded ? "▲" : "▼"}
                </button>
              </div>
              {isExpanded &&
                Object.entries(nodeShapeMap).slice(4).map(([symbol, styles], index) => (
                  <div key={index} className="text-center">
                    <span
                      className={`cursor-pointer ${styles[1]}`}
                      onClick={() => handleBPMNClick(symbol)}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className="inline-flex flex-col items-center rounded-3xl bg-blue-600 p-2.5 text-center text-sm
   text-white shadow-lg shadow-blue-300 transition-all hover:bg-blue-700 focus:outline-none dark:shadow-blue-800"
          disabled={isLoading}
          onClick={() => setIsExpandedAdd(!isExpandedAdd)}
        >
          {isLoading ? (
            //<LoadingIcon color="white" />
            <MdOutlineAdd
              className="h-6 w-6"
              style={{ color: "white" }}
            />
          ) : (
            <>
              <MdOutlineAdd
                className="h-6 w-6"
                style={{ color: "white" }}
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default AddNodeButton;
