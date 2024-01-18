import React from "react";
import { FaCheck } from "react-icons/fa";
import { colors } from "../edgeNodeColor";

interface NodeColorsProps {
  onSelectColor: (color: string) => void;
  selectedColor: string | null;
}

const NodeColors: React.FC<NodeColorsProps> = ({
  onSelectColor,
  selectedColor,
}) => {
  return (
    <div className="absolute -left-10 bottom-7 grid grid-cols-5 gap-2  rounded border border-gray-300 bg-white p-2 shadow-md">
      {colors.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color,
          }}
          className="flex h-4 w-4 flex items-center justify-center cursor-pointer rounded-full"
          onClick={() => onSelectColor(color)}
        >
          {color === selectedColor && (
            <FaCheck
              size={8}
              style={{
                color: "#fff",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NodeColors;
