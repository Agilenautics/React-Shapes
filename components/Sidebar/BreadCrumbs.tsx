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
    <li >
      <div className="flex items-center">
        {isFirst ? null : <MdOutlineArrowForwardIos />}
        <div className="mx-1 flex items-center font-sans text-sm justify-center bg-purple-100 p-2 text-lg font-normal text-black-400 rounded-tl-lg rounded-tr-lg shadow-md dark:text-gray-400 dark:hover:text-white breadcrumb-trapezoid-purple dark:text-white">
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
    <div >
      <nav className="flex fixed top-24" aria-label="Breadcrumb">
        <ol className="flex space-x-1 px-2">
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
