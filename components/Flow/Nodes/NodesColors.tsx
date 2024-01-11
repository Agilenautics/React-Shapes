// NodeColors.tsx
import React from "react";
import { FaCircle, FaCheck } from "react-icons/fa";

interface NodeColorsProps {
  onSelectColor: (color: string) => void;
  selectedColor: string | null;
}

const NodeColors: React.FC<NodeColorsProps> = ({
  onSelectColor,
  selectedColor,
}) => {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-pink-400",
    "text-purple-400",
    "text-yellow-400",
    "text-green-400",
    "text-orange-400",
    "text-blue-800",
    "text-red-200",
    "text-green-200",
  ];

  return (
    <div className="text-blue- absolute -left-10 bottom-7 flex  max-w-xs flex-wrap  items-center justify-between gap-2 rounded border border-gray-300 bg-white px-4 py-2 shadow">
      {colors.map((color, index) => (
        <div key={index} style={{ position: "relative" }}>
          <FaCircle
            style={{ cursor: "pointer" }}
            className={color + " h-4 w-4"}
            onClick={() => onSelectColor(color)}
          />
          {color === selectedColor && (
            <FaCheck
              size={8}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
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
