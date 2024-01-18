import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { EditingProps } from "../../../../lib/appInterfaces";
interface DescriptionPropes {
  description: string;
  onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editing: EditingProps;
  updateNode: (nodeData: string, type: string) => void;
}

const Description: React.FC<DescriptionPropes> = ({
  description,
  onDescriptionChange,
  editing,
  updateNode,
}) => {
  const [showDescriptionBox, setShowDescriptionBox] = useState(false);

  const handleExpandClick = () => {
    setShowDescriptionBox(!showDescriptionBox);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateNode(description, editing.type);
  };

  return (
    <div className="text-blue- absolute -left-10 bottom-7 flex flex-wrap  items-center justify-between gap-2 rounded-sm border border-gray-300 bg-white px-4 py-2 shadow">
      <h2 className="text-md">
        Description
        <button className="expand-icon">
          <IoIosClose className="h-4 w-4" />
        </button>
        <button className="expand-icon" onClick={handleExpandClick}>
          <img src="/icons/maximize-4.svg" alt="Expand" className="h-4 w-4" />
        </button>
      </h2>
      {showDescriptionBox && (
        <div>
          <p className="description-text">{description}</p>
          <form autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <textarea value={description} onChange={onDescriptionChange} />
            <button type="submit">Update Description</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Description;
