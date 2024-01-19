// CustomMinimap.js
import React from "react";
import { MiniMap } from "reactflow";

const CustomMinimap = () => {
  return (
    <div
      style={{
        border: "1px solid #C0D5E7",
        backgroundColor: "#ffffff", // Set background color to white
        overflow: "hidden", // Hide overflowing content
      }}
    >
      <MiniMap style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default CustomMinimap;
