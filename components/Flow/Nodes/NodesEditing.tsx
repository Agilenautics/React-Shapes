import React, { FunctionComponent, useState } from "react";
import ShapesTray from "./NodesShapes";
import NodeColors from "./NodesColors";
import Description from "./Description/NodeDesc";
import { NodeData, EditingProps } from "../../../lib/appInterfaces";
import nodeStore from "./nodeStore";
import { GET_NODES, UPDATE_NODE, updateNodeData } from "../../../gql";
import fileStore from "../../TreeView/fileStore";

interface EdgeEditingProps {
  id: string;
  data: NodeData;
  editing: EditingProps;
  setEditing: any;
}

const NodeEditing: FunctionComponent<EdgeEditingProps> = ({
  id,
  data,
  editing,
  setEditing,
}) => {
  const { updateNodeType, updateShape, updateDescription } = nodeStore();
  const { Id } = fileStore();
  const [descriptionText, setDescriptionText] = useState(data.description);
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionText(event.target.value); // Update description text on change
  };

  const updateNode = async (nodeData: string, type: string) => {
    let newData = {
      ...data,
      id,
    };
    switch (type) {
      case "Color":
        newData.nodeColor = nodeData;
        await updateNodeData(newData, UPDATE_NODE, GET_NODES, Id);
        updateNodeType(id, nodeData);
        break;
      case "Shape":
        updateShape(id, nodeData);
        break;
      case "Description":
        newData.description = descriptionText;
        await updateNodeData(newData, UPDATE_NODE, GET_NODES, Id);
        updateDescription(id, nodeData);
        break;
      default:
    }
    setEditing({
      ...editing,
      flag: false,
      type: "",
    });
  };

  switch (editing.type) {
    case "Shape":
      return (
        <ShapesTray
          onSelectShape={(shape) => console.log(`Selected shape: ${shape}`)}
        />
      );
    case "Color":
      return (
        <NodeColors
          onSelectColor={(color) => updateNode(color, editing.type)}
          selectedColor={data.nodeColor}
        />
      );
    case "Description":
      return (
        <Description
          description={descriptionText}
          onDescriptionChange={handleDescriptionChange}
          editing={editing}
          updateNode={updateNode}
        />
      );
    default:
      return null;
  }

  // return (
  //   <div className="relative">
  //     <div className="flex items-center justify-center gap-3 px-1 py-0.5 text-sm">
  //       <button
  //         className={`h-4 w-4 ${
  //           selectedButton === "Shape" ? "text-green-400" : ""
  //         }`}
  //         onClick={() => handleButtonClick("Shape")}
  //       >
  //         <img src="/icons/shapes.svg" alt="Shape" />
  //       </button>
  //       <button
  //         className={`h-4 w-4 ${
  //           selectedButton === "Color" ? "text-green-400" : ""
  //         }`}
  //         onClick={() => handleButtonClick("Color")}
  //       >
  //         <img src="/icons/minus-cirlce.svg" alt="Color" />
  //       </button>
  //       <button
  //         className={`h-4 w-4 ${
  //           selectedButton === "Link" ? "text-green-400" : ""
  //         }`}
  //         onClick={() => handleButtonClick("Link")}
  //       >
  //         <img
  //           src="/icons/arrow-up.svg"
  //           alt="Link"
  //           style={{ height: "100%", width: "100%" }}
  //         />
  //       </button>
  //       <button
  //         className={`h-4 w-4 ${
  //           selectedButton === "Description" ? "text-green-400" : ""
  //         }`}
  //         onClick={() => handleButtonClick("Description")}
  //       >
  //         <img src="/icons/message-text.svg" alt="Description" />
  //       </button>
  //     </div>
  //     {showShapesEditing && (
  //       <ShapesTray
  //         onSelectShape={(shape) => console.log(`Selected shape: ${shape}`)}
  //       />
  //     )}
  //     {showNodeColors && (
  //       <NodeColors
  //         onSelectColor={(color) => console.log(`Selected color: ${color}`)}
  //         selectedColor={currentNodeColor}
  //       />
  //     )}
  //     {showDescription && (
  //       <Description
  //         descriptionText={descriptionText}
  //         onDescriptionChange={handleDescriptionChange}
  //         //onCloseDescription={handleCloseDescription}
  //       />
  //     )}
  //   </div>
  // );
};

export default NodeEditing;
