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
    <div className="text-blue- absolute -left-10 bottom-7 flex  max-w-xs flex-wrap  items-center justify-between gap-2 rounded border border-blue-300 bg-white px-4 py-2 shadow">
      {colors.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color,
          }}
          className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full"
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
