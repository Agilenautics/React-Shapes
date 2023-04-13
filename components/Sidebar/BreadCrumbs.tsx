import { MdOutlineArrowForwardIos } from "react-icons/md";

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
        <button className="mx-1 ml-2 flex w-48 items-center justify-center whitespace-nowrap rounded-xl border-b-2 border-r-2 border-node-blue-100 bg-node-blue-50 p-2 text-xl font-normal text-node-blue-200 shadow-md hover:bg-node-blue-100 hover:text-node-blue-50 dark:text-gray-400 dark:hover:text-white">
          {name}
        </button>
      </div>
    </li>
  );
}

/* This function manages the actual breadcrumb tiles */
function BreadCrumbs() {
  const tiles = ["AWS", "Azure", "Lambda Functions"];
  return (
    <div className="relative left-[26vw] top-5">
      <nav className="flex " aria-label="Breadcrumb">
        <ol className="flex space-x-3 py-2 pr-2">
          {tiles.map((value, index) => {
            return  (
              <div key={index}> { BCTile(value, index == 0)}  </div>
            ) 
          })}
        </ol>
      </nav>
    </div>
  );
}

export default BreadCrumbs;
