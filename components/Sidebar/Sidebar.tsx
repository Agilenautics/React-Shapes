import { useEffect, useState } from "react";
import Image from "next/image";
import { FileTree } from "../TreeView/fileRenderer";
import { AiFillFolderAdd, AiFillFileAdd, AiTwotoneHome } from "react-icons/ai";
import {GiSprint, GiChecklist} from "react-icons/gi"
import {GrOverview} from "react-icons/gr"
import {FaChalkboard, FaChevronDown} from "react-icons/fa"
import {RiFlowChart} from "react-icons/ri"
import DarkModeToggleButton from "./DarkModeToggleButton";
import fileStore from "../TreeView/fileStore";
import BreadCrumbs from "./BreadCrumbs";
import { useRouter } from "next/router";
import { getMainByUser, getTreeNodeByUser } from "../TreeView/gqlFiles";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-700 transition ease transform duration-300 dark:bg-gray-100`;
  const [menuOpen, setMenuOpen] = useState("h-0 overflow-hidden");
  const updateInitData = fileStore((state) => state.updateInitData);
  const [insightsOpen, setInsightsOpen] = useState(false);





  const add_folder = fileStore((state) => state.add_folder);
  const add_file = fileStore((state) => state.add_file);
  const setLoading = fileStore((state) => state.setLoading);

  function toggleMenu() {
    setMenuOpen(menuOpen === "h-fit" ? "h-0 overflow-hidden" : "h-fit");
    setShowSidebar(!showSidebar);
  }

  const router = useRouter();
  const projectId = router.query.projectId || "";

  const getProjectId = async (id: string) => {
    const initData = await getTreeNodeByUser(getMainByUser, id, setLoading);
    const data = initData[0];
    //@ts-ignore
    updateInitData(data);
    return initData;
  };

  useEffect(() => {
    if (projectId) {
      // @ts-ignore
      getProjectId(projectId);
    }
  }, [projectId]);

  return (
    <div>
      <div
        className={` z-50 rounded p-1 duration-700 ease-in-out focus:outline-none ${
          showSidebar ? "bg-transparent" : "bg-white dark:bg-neutral-900"
        }`}
      >
        <button
          className="group flex h-10 w-10 flex-col items-center rounded"
          onClick={toggleMenu}
        >
          <div
            className={`${genericHamburgerLine} ${
              menuOpen === "h-fit" ? "translate-y-3 rotate-45" : ""
            }`}
          />
          <div
            className={`${genericHamburgerLine} ${
              menuOpen === "h-fit" ? "opacity-0" : ""
            }`}
          />
          <div
            className={`${genericHamburgerLine} ${
              menuOpen === "h-fit" ? "-translate-y-3 -rotate-45 " : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`fixed h-[100%] left-0 top-0 -z-10  w-[18vw] bg-white shadow-neutral-300 duration-300 ease-in-out dark:bg-neutral-900 dark:shadow-neutral-700 ${
          showSidebar ? "sidebar-shadow translate-x-0" : "-translate-x-full"
        }`}
      >
        <BreadCrumbs />
        <div
          id="sidebar-content"
          className="mt-10 flex flex-col items-center justify-center"
          style={{
            marginTop: "-65px",
          }}
        >
          <Image
            className="mx-auto"
            src="/assets/flow-chart.png"
            height={124}
            width={124}
            alt="Company Logo"
          />
        </div>
        {/* {router.asPath== "/flowchart/"+projectId &&
        <div className="grid grid-cols-2 gap-2 p-1">
          <button
            type="button"
            className="add-buttons w-25 peer h-8"
            onClick={() => add_folder()}
          >
            <AiFillFolderAdd className="add-buttons-icon" /> Add Folder
          </button>
          <button
            type="button"
            className="add-buttons w-21 peer h-8"
            onClick={() => add_file()}
          >
            <AiFillFileAdd className="add-buttons-icon" /> Add File
          </button>
        </div>
} */}
        
        <div className="h-[58vh]">
        <div className="flex flex-col space-y-2">
        <a className="flex items-center justify-between cursor-pointer font-bold w-[10vw] bg-slate-300 p-1 m-2 rounded shadow-lg hover:bg-slate-400" href={`/projects/`}>
            Home
            <AiTwotoneHome/>
            </a>
          <a className="flex items-center justify-between cursor-pointer font-bold w-[10vw] bg-slate-300 p-1 m-2 rounded shadow-lg hover:bg-slate-400" href={`/projects/${projectId}`}>
            Overview
            <GrOverview/>
            </a>
          <div
            className="flex items-center justify-between cursor-pointer font-bold w-[10vw] bg-slate-300 p-1 m-2 rounded shadow-lg hover:bg-slate-400"
            onClick={() => setInsightsOpen(!insightsOpen)}
          >
            <span>Insights</span>
            <FaChevronDown className={`transition-transform ${insightsOpen ? "transform rotate-180" : ""}`} />
          </div>
          {insightsOpen && (
            <div className="pl-4 mt-2 space-y-2">
              <a
                className="flex items-center font-bold hover:font-black"
                href={`/boards/${projectId}`}
              >
                <FaChalkboard className="mr-2" />
                Boards
              </a>
              <a
                className="flex items-center font-bold hover:font-black"
                href={`/backlogs/${projectId}`}
              >
                <GiChecklist className="mr-2" />
                Backlogs
              </a>
              <a className="flex items-center font-bold hover:font-black"
              href={`/sprints/${projectId}`}>
                <GiSprint className="mr-2" />
                Sprints
              </a>
              <a
                className="flex items-center font-bold hover:font-black"
                href={`/flowchart/${projectId}`}
              >
                <RiFlowChart className="mr-2" />
                Business Plan
              </a>
            </div>
          )}
        </div>
        {router.asPath == "/flowchart/" + projectId && <>
        <div className="grid grid-cols-2 gap-2 p-1">
          <button
            type="button"
            className="add-buttons w-25 peer h-8"
            onClick={() => add_folder()}
          >
            <AiFillFolderAdd className="add-buttons-icon" /> Add Folder
          </button>
          <button
            type="button"
            className="add-buttons w-21 peer h-8"
            onClick={() => add_file()}
          >
            <AiFillFileAdd className="add-buttons-icon" /> Add File
          </button>
        </div>
        <FileTree />
        </>}
      </div>
        <DarkModeToggleButton />
      </div>

      <div
        className={`pl-14 transition-all ${
          showSidebar ? "ml-[14.2vw]" : "ml-0"
        }`}
      ></div>
    </div>


    // <div className={` border h-[100vh] border-black duration-500 ease-in-out focus:outline-none ${showSidebar ? "bg-transparent w-[20%] " : "bg-white dark:bg-neutral-900 w-0"} `} >

    //   <div>
    //     <button
    //       className=" flex  flex-col items-center border p-1"
    //       onClick={toggleMenu}
    //     >
    //       <div
    //         className={`${genericHamburgerLine} ${menuOpen === "h-fit" ? "translate-y-3 rotate-45" : ""
    //           }`}
    //       />
    //       <div
    //         className={`${genericHamburgerLine} ${menuOpen === "h-fit" ? "opacity-0" : ""
    //           }`}
    //       />
    //       <div
    //         className={`${genericHamburgerLine} ${menuOpen === "h-fit" ? "-translate-y-3 -rotate-45 " : ""
    //           }`}
    //       />
    //     </button>
    //   </div>

    //   {/* Image */}

    //   <div className={`border border-black text-center  `} >
    //     <Image
    //       className="mx-auto"
    //       src="/assets/flow-chart.png"
    //       height={124}
    //       width={124}
    //       alt="Company Logo"
    //     />

    //   </div>



    //   {/* <div className="h-[40%]"> <FileTree /> </div> */}
    //   <div className={`${showSidebar ? "translate-x-0 " : '-translate-x-full hidden'} duration-700 ease-in-out `}>Baclogs</div>

    // </div>
  );
};

export default Sidebar;