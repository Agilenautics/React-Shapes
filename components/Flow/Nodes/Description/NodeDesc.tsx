import React, { useState, useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useDescSidebarStore } from "./SidebarStore";
import nodeStore from "../nodeStore";
import { useEditingNodeId } from "../../NodeEditingStore";
import { EditingProps } from "../../../../lib/appInterfaces";

interface DescriptionProps {
  descriptionText: string;
  onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCloseDescription: any;
  editing: EditingProps;
  updateNode: (nodeData: string, type: string) => Promise<null | undefined>;
}

const Description: React.FunctionComponent<DescriptionProps> = ({
  descriptionText,
  onDescriptionChange,
  onCloseDescription,
}) => {
  const openSidebar = useDescSidebarStore((state) => state.openDescSidebar);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const { updateDescription } = nodeStore();
  const { editingNodeId } = useEditingNodeId();

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "5rem";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      // Show save button if there is input in the textarea
      setIsSaveButtonVisible(textareaRef.current.value.trim() !== "");
    }
  };

  const handleMaximize = () => {
    openSidebar();
    onCloseDescription();
  };

  useEffect(() => {
    handleTextareaResize();
  }, [descriptionText]); // Re-run the effect when descriptionText changes

  return (
    <div className="relative">
      {/* Description container */}
      <div className="absolute bottom-0 left-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#C0D5E7] bg-white shadow duration-300 ease-in-out">
        <div className="flex items-center justify-between  border-b border-[#C0D5E7] px-2 py-1">
          <h2 className="text-md font-semibold text-[#292D32]">Description</h2>
          <div className="ml-16 flex gap-2">
            <button className="h-5 w-5" onClick={handleMaximize}>
              <img src="/icons/maximize-4.svg" alt="Maximize" />
            </button>
            <button>
              <IoIosClose className="h-5 w-5" onClick={onCloseDescription} />
            </button>
          </div>
        </div>
        <div className="w-full px-2">
          <textarea
            ref={textareaRef}
            className="w-full resize-none text-xs outline-none"
            placeholder="Add description..."
            value={descriptionText}
            onChange={(e) => {
              onDescriptionChange(e);
              handleTextareaResize();
            }}
          />
        </div>
        {isSaveButtonVisible && (
          <button
            className="w-full rounded-b-lg bg-[#3B9D55] py-1 text-white"
            onClick={() => {
              if (editingNodeId) {
                updateDescription(editingNodeId, descriptionText);
                onCloseDescription();
              }
            }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Description;
