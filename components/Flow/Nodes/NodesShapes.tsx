import React, { FunctionComponent } from "react";

interface ShapesTrayProps {
  onSelectShape: (shape: string) => void;
}

const ShapesTray: FunctionComponent<ShapesTrayProps> = ({ onSelectShape }) => {
  const shapes = [
    { name: "Rectangle", icon: "Rectangle 2.svg" },
    { name: "Circle", icon: "Rectangle 3.svg" },
    { name: "Rhombus", icon: "Rhombus.svg" },
    { name: "Ellipse", icon: "Ellipse 209.svg" },
    { name: "Ellipse", icon: "Ellipse 209.svg" },
  ];

  return (
    <div className="absolute -left-10 bottom-7 flex max-w-32 flex-wrap items-center  justify-between gap-3 rounded border border-gray-300 bg-white px-4 py-2 shadow">
      {shapes.map((shape, index) => (
        <button
          key={index}
          className="h-3 w-3 text-black"
          onClick={() => onSelectShape(shape.name)}
        >
          <img src={`/icons/${shape.icon}`} alt={shape.name} />
        </button>
      ))}
    </div>
  );
};

export default ShapesTray;
