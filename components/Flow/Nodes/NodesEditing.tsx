import React, { FunctionComponent, useState } from "react";
import ShapesTray from "./NodesShapes";
import NodeColors from "./NodesColors";

import { NodeData, EditingProps } from "../../../lib/appInterfaces";
import nodeStore from "./nodeStore";
import { GET_NODES, UPDATE_NODE, updateNodeData } from "../../../gql";
import fileStore from "../../TreeView/fileStore";
import Description from "./Description/NodeDesc";

interface EdgeEditingProps {
  id: string;
  data: NodeData;
  editing: EditingProps;
  setEditing: React.Dispatch<
    React.SetStateAction<{ type: string; flag: boolean }>
  >;
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
    setDescriptionText(event.target.value);
  };

  const handleCloseDescription = () => {
    setEditing((prevState) => ({
      ...prevState,
      flag: false,
    }));
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
        return null;
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
          descriptionText={descriptionText}
          onDescriptionChange={handleDescriptionChange}
          editing={editing}
          updateNode={updateNode}
          onCloseDescription={handleCloseDescription}
        />
      );
    default:
      return null;
  }
};

export default NodeEditing;
