import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";

const Description = ({
  descriptionText,
  onDescriptionChange,
  onCloseDescription,
}) => {
  const [showDescriptionBox, setShowDescriptionBox] = useState(false);

  const handleExpandClick = () => {
    setShowDescriptionBox(!showDescriptionBox);
  };

  return (
    <div className="text-blue- absolute -left-10 bottom-7 flex flex-wrap  items-center justify-between gap-2 rounded-sm border border-gray-300 bg-white px-4 py-2 shadow">
      <h2 className="text-md">
        Description
        <button className="expand-icon" onClick={onCloseDescription}>
          <IoIosClose className="h-4 w-4" />
        </button>
        <button className="expand-icon" onClick={handleExpandClick}>
          <img src="/icons/maximize-4.svg" alt="Expand" className="h-4 w-4" />
        </button>
      </h2>
      {showDescriptionBox && (
        <div>
          <p className="description-text">{descriptionText}</p>
          <form>
            <textarea value={descriptionText} onChange={onDescriptionChange} />
            <button type="submit">Update Description</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Description;
