import React, { useState } from "react";
import userStore from "../AdminPage/Users/userStore";
import { MdOutlineAdd } from "react-icons/md";
import {
  GET_NODES,
  createNode,
  ADD_NODE,
  updateUidMethode,
  UPDATED_UID,
} from "../../gql";
import nodeStore from "../Flow/Nodes/nodeStore";
import fileStore from "../TreeView/fileStore";
import { useRouter } from "next/router";

/**
 * This is a FAB that is positioned over the minimap view.
 * @returns A button that when clicked will add a new node to the graph at a fixed position.
 */
//import LoadingIcon from "../LoadingIcon";
import { nodeShapeMap } from "../Flow/Nodes/nodeTypes";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import backlogStore from "../Backlogs/backlogStore";

function AddNodeButton() {
  const currentId = fileStore((state) => state.Id);
  const { addNode } = nodeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedAdd, setIsExpandedAdd] = useState(false);
  const { uid, idofUid, updateUid, Id: fileId } = fileStore();
  const userEmail = userStore((state) => state.userEmail);
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const handleAddNode = async (symbol: string) => {
    setIsExpandedAdd(!isExpandedAdd);
    setIsLoading(true);
    const data = {
      story: currentId,
      symbol,
      label: "New Node",
      
      description: "",
      assignedTo: "",
      uid,
    };
    try {
      const createNodeResponse = await createNode(ADD_NODE, data, userEmail,GET_NODES,fileId);
      addNode(createNodeResponse?.data.createFlowNodes.flowNodes);
      const updateUidResponse = (await updateUidMethode(
        idofUid,
        UPDATED_UID
      )) as any;
      updateUid(updateUidResponse.data.updateUids.uids);
    } catch (err) {
      console.log(err, "while creating node");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBPMNClick = async (symbol: string) => {
    setIsExpanded(!isExpanded);
    setIsLoading(true);
    const data = {
      story: currentId,
      symbol,
      label: "",
      type: "defaultNode",
      description: "",
      assignedTo: "",
      uid,
    };
    try {
      await createNode(ADD_NODE, data, userEmail,GET_NODES,fileId);
      const updateUidResponse = updateUidMethode(
        idofUid,
        UPDATED_UID
      ) as any;
      if (!updateUidResponse?.errors && !updateUidResponse?.data) {
        return null;
      }
    } catch (err) {
      console.log(err, "while creating bpmn symbole");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute left-80 top-32">
      <div className="relative space-x-3">
        <button
          type="button"
          className="items-center rounded-3xl bg-blue-600 p-2.5 text-center text-sm
   text-white shadow-lg shadow-blue-300  hover:bg-blue-700 focus:outline-none dark:shadow-blue-800"
          disabled={isLoading}
          onClick={() => setIsExpandedAdd(!isExpandedAdd)}
        >
          {isLoading ? (
            //<LoadingIcon color="white" />
            <MdOutlineAdd className="h-6 w-6" style={{ color: "white" }} />
          ) : (
            <>
              <MdOutlineAdd className="h-6 w-6" style={{ color: "white" }} />
            </>
          )}
        </button>
        {isExpandedAdd && (
          <div className="relative -top-16 left-10 max-h-40 overflow-y-auto rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-4 gap-1">
              <div className="col-span-4">
                <span className="font-sm">Shapes</span>
              </div>
              {Object.keys(nodeShapeMap)
                .slice(0, 4)
                .map((key, _) => (
                  <div
                    key={key}
                    className={`mx-1 my-1 !h-5 !w-5 !translate-x-0 !translate-y-0 cursor-pointer bg-neutral-600 transition-opacity duration-75 ease-in-out ${
                      //@ts-ignore
                      nodeShapeMap[key][1]
                    }`}
                    onClick={() => handleAddNode(key)}
                  ></div>
                ))}
              <div className="col-span-4">
                <button
                  className="font-sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  BPMN Shapes {isExpanded ? "▲" : "▼"}
                </button>
              </div>
              {isExpanded &&
                Object.entries(nodeShapeMap)
                  .slice(4)
                  .map(([symbol, styles], index) => (
                    <div key={index} className="text-center">
                      <span
                        //@ts-ignore
                        className={`cursor-pointer ${styles[1]}`}
                        onClick={() => handleBPMNClick(symbol)}
                      />
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AddNodeButton;
