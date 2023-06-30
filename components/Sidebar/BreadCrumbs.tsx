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
      <div className="flex items-center">
        {isFirst ? null : <MdOutlineArrowForwardIos className="h-5 w-5" />}
        <div className="mx-1 ml-2 flex items-center justify-center bg-purple-100 p-3 text-lg font-normal text-black-400 rounded-tl-lg rounded-tr-lg shadow-md dark:text-white-400 dark:hover:text-white breadcrumb-trapezoid-purple min-w-max">
          {name}
          <div className="breadcrumb-triangle" />
        </div>
      </div>
    </li>
  );
}

/* This function manages the actual breadcrumb tiles */
function BreadCrumbs() {
  const breadCrumbs = nodeStore((state) => state.breadCrumbs);
  return (
    <div className="relative left-[25vw] top--2" style={{ marginTop: 75 }}>
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex space-x-3 py-2 pr-2">
          {breadCrumbs.map((value: any, index) => {
            return (
              <div key={index}> {BCTile(value, index === 0)} </div>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default BreadCrumbs;
