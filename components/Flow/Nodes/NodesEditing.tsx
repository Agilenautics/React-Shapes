import React, { FunctionComponent, useState } from "react";
import ShapesTray from "./NodesShapes";
import NodeColors from "./NodesColors";
import { IoIosClose } from "react-icons/io";
import Description from "./Description/NodeDesc";

interface EditingProps {
  updateNodeType: () => void;
  updateColor: () => void;
  updateDescription: () => void;
  isLinked: boolean;
  setIsLinkFlag: (flag: boolean) => void;
}

const Editing: FunctionComponent<EditingProps> = ({
  updateNodeType,
  updateColor,
  updateDescription,
  isLinked,
  setIsLinkFlag,
}) => {
  const [showShapesEditing, setShowShapesEditing] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");
  const [showNodeColors, setShowNodeColors] = useState(false);
  const [currentNodeColor, setCurrentNodeColor] = useState("text-blue-500");
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");
  const handleDescriptionChange = (event) => {
    setDescriptionText(event.target.value); // Update description text on change
  };

  const handleButtonClick = (buttonType: string) => {
    // Close the previously opened trays if a different button is clicked
    if (buttonType !== selectedButton) {
      setShowShapesEditing(false);
      setShowNodeColors(false);
      setShowDescription(false); // Close description box if a different button is clicked
    }

    setSelectedButton((prev) => (prev === buttonType ? "" : buttonType));

    switch (buttonType) {
      case "Shape":
        setShowShapesEditing(!showShapesEditing);
        break;
      case "Color":
        setShowNodeColors(!showNodeColors);
        break;
      case "Description":
        setShowDescription(!showDescription); // Toggle description box visibility
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-3 px-1 py-0.5 text-sm">
        <button
          className={`h-4 w-4 ${
            selectedButton === "Shape" ? "text-green-400" : ""
          }`}
          onClick={() => handleButtonClick("Shape")}
        >
          <img src="/icons/shapes.svg" alt="Shape" />
        </button>
        <button
          className={`h-4 w-4 ${
            selectedButton === "Color" ? "text-green-400" : ""
          }`}
          onClick={() => handleButtonClick("Color")}
        >
          <img src="/icons/minus-cirlce.svg" alt="Color" />
        </button>
        <button
          className={`h-4 w-4 ${
            selectedButton === "Link" ? "text-green-400" : ""
          }`}
          onClick={() => handleButtonClick("Link")}
        >
          <img
            src="/icons/arrow-up.svg"
            alt="Link"
            style={{ height: "100%", width: "100%" }}
          />
        </button>
        <button
          className={`h-4 w-4 ${
            selectedButton === "Description" ? "text-green-400" : ""
          }`}
          onClick={() => handleButtonClick("Description")}
        >
          <img src="/icons/message-text.svg" alt="Description" />
        </button>
      </div>
      {showShapesEditing && (
        <ShapesTray
          onSelectShape={(shape) => console.log(`Selected shape: ${shape}`)}
        />
      )}
      {showNodeColors && (
        <NodeColors
          onSelectColor={(color) => console.log(`Selected color: ${color}`)}
          selectedColor={currentNodeColor}
        />
      )}
      {showDescription && (
        <Description
          descriptionText={descriptionText}
          onDescriptionChange={handleDescriptionChange}
          //onCloseDescription={handleCloseDescription}
        />
      )}
    </div>
  );
};

export default Editing;
