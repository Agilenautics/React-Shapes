import { useEffect, useState } from "react";
import Image from "next/image";
import { FileTree } from "../TreeView/fileRenderer";
import { AiFillFolderAdd, AiFillFileAdd } from "react-icons/ai";
import DarkModeToggleButton from "./DarkModeToggleButton";
import fileStore from "../TreeView/fileStore";
import BreadCrumbs from "./BreadCrumbs";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { getMainByUser, getTreeNodeByUser } from "../TreeView/gqlFiles";
import TopBar from "../AdminPage/TopBar";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-700 transition ease transform duration-300 dark:bg-gray-100`;
  const [menuOpen, setMenuOpen] = useState("h-0 overflow-hidden");
  const updateInitData = fileStore((state) => state.updateInitData);

  const add_folder = fileStore((state) => state.add_folder);
  const add_file = fileStore((state) => state.add_file);

  function toggleMenu() {
    setMenuOpen(menuOpen === "h-fit" ? "h-0 overflow-hidden" : "h-fit");
    setShowSidebar(!showSidebar);
  }

  const router = useRouter();
  const projectId = router.query.projectId || "";

  const getProjectId = async (id: string) => {
    const initData = await getTreeNodeByUser(getMainByUser, id);
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
        className={`absolute left-8 top-8 z-50 rounded px-1 duration-700 ease-in-out focus:outline-none ${
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
        className={`fixed left-0 top-0 -z-10 h-full w-[20vw] bg-white shadow-neutral-300 duration-300 ease-in-out dark:bg-neutral-900 dark:shadow-neutral-700 ${
          showSidebar ? "sidebar-shadow translate-x-0" : "-translate-x-full"
        }`}
      >
        <BreadCrumbs />
        <div
          id="sidebar-content"
          className="mt-10 flex flex-col items-center justify-center"
          style={{
            marginTop: "-75px",
          }}
        >
          <Image
            className="mx-auto"
            src="/assets/flow-chart.png"
            height={144}
            width={144}
            alt="Company Logo"
          />
          <h1 className="mt-2 font-['Cormorant_Garamond'] text-4xl tracking-wide dark:text-white">
            Flowchart
          </h1>
        </div>
        <h3 className="projects dark:text-white">Projects</h3>
        <div className="mx-4 my-2 flex">
          <button
            type="button"
            className="add-buttons peer"
            onClick={() => add_folder()}
          >
            <AiFillFolderAdd className="add-buttons-icon" />
          </button>
          <div className="add-buttons-tooltip">Add Folder</div>

          <div className="group">
            <button
              type="button"
              className="add-buttons peer"
              onClick={() => add_file()}
            >
              <AiFillFileAdd className="add-buttons-icon" />
            </button>
            <div className="add-buttons-tooltip">Add File</div>
          </div>
        </div>
        <div className="h-[50vh]">
          <FileTree />
        </div>
        <DarkModeToggleButton />
      </div>

      <div
        className={`pl-14 transition-all ${showSidebar ? "ml-[20vw]" : "ml-0"}`}
      >
        <TopBar />
      </div>
    </div>
  );
};

export default Sidebar;
