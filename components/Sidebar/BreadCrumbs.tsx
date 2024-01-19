import React from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import nodeStore from "../Flow/Nodes/nodeStore";

/**
 * It creates a breadcrumb tile
 * @param {string} name - The name of the tile
 * @param {boolean} [isFirst=false] - boolean = false
 * @returns A React component
 */
function BCTile(name: string, isFirst: boolean = false) {
  return (
    <li>
      <div className="flex items-center rounded-md border-[#C0D5E7] bg-white p-2 shadow-sm shadow-[#C0D5E7]">
        {isFirst ? null : <MdOutlineArrowForwardIos />}
        <div
          className={`${
            isFirst ? "font-semibold" : "font-normal"
          } text-black-400 `}
        >
          {name.length >= 10 ? name.slice(0, 12).concat("...") : name}
          {/* <div className="breadcrumb-triangle" /> */}
        </div>
      </div>
    </li>
  );
}

/* This function manages the actual breadcrumb tiles */
function BreadCrumbs() {
  const breadCrumbs = nodeStore((state) => state.breadCrumbs);

  return (
    <div>
      <nav className="fixed top-16 ml-2 flex text-sm" aria-label="Breadcrumb">
        <ol className="flex space-x-1 px-2">
          {breadCrumbs.map((value: any, index) => {
            return <div key={index}> {BCTile(value, index === 0)} </div>;
          })}
        </ol>
      </nav>
    </div>
  );
}

export default BreadCrumbs;
