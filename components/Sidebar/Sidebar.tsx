import { useEffect, useState } from "react";
import Image from "next/image";
import { BacklogsTree, FileTree } from "../TreeView/fileRenderer";
import { AiFillFolderAdd, AiFillFileAdd } from "react-icons/ai";
import DarkModeToggleButton from "./DarkModeToggleButton";
import fileStore from "../TreeView/fileStore";
import BreadCrumbs from "./BreadCrumbs";
import { useRouter } from "next/router";
import { getMainByUser, getTreeNodeByUser } from "../TreeView/gqlFiles";
import Link from "next/link";


const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-700 transition ease transform duration-300 dark:bg-gray-100`;
  const [menuOpen, setMenuOpen] = useState("h-0 overflow-hidden");
  const updateInitData = fileStore((state) => state.updateInitData);




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
        <div className="grid grid-cols-2 gap-2 p-1">
          <button
            type="button"
            className="add-buttons peer w-25 h-8"
            onClick={() => add_folder()}
          >
            <AiFillFolderAdd className="add-buttons-icon" /> Add Folder
          </button>
          <button
              type="button"
              className="add-buttons peer w-21 h-8"
              onClick={() => add_file()}
            >
            <AiFillFileAdd className="add-buttons-icon" />  Add File 
            </button>
        </div>
        <div className="h-[5vh]">
          <FileTree />
          {/* <BacklogsTree /> */}

        </div>
        <div className="text-center  m-3 rounded-lg mb-6 dark:text-white"><Link href={'/backlogs/'+projectId} > Backlogs </Link></div>
        {/* <Link href="/backlogs">Backlogs</Link> */}

        <div>
          <DarkModeToggleButton />
        </div>
      </div>

      <div
        className={`pl-14 transition-all ${showSidebar ? "ml-[14.2vw]" : "ml-0"}`}
      >
      </div>
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
