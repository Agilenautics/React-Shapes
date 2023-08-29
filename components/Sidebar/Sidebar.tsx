import { useEffect, useState } from "react";
import Image from "next/image";
import { FileTree } from "../TreeView/fileRenderer";
import { AiFillFolderAdd, AiFillFileAdd, AiTwotoneHome, AiOutlineSearch } from "react-icons/ai";
import { CgInsights } from 'react-icons/cg'
import { GiSprint, GiChecklist } from "react-icons/gi"
import { GrOverview } from "react-icons/gr"
import { LiaProjectDiagramSolid } from 'react-icons/lia'
import { FaChalkboard, FaChevronDown } from "react-icons/fa"
import { RiFlowChart } from "react-icons/ri"
import fileStore from "../TreeView/fileStore";
import { useRouter } from "next/router";
import { getMainByUser, getTreeNodeByUser } from "../TreeView/gqlFiles";
import Link from "next/link";
import projectStore, { Project } from "../AdminPage/Projects/projectStore";

interface SideBar {
  isOpen: Boolean
}

const Sidebar = ({ isOpen }: SideBar) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-700 transition ease transform duration-300 dark:bg-gray-100`;
  const [menuOpen, setMenuOpen] = useState("h-0 overflow-hidden");
  const updateInitData = fileStore((state) => state.updateInitData);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [projectsFlag, setProjectsFlag] = useState(false)

  // search project
  const [searchQuery, setSearchQuery] = useState('')
  //projects stores
  const allProjects = projectStore((state) => state.projects);
  const loading = projectStore((state) => state.loading);
  const [projectData, setProjectData] = useState<Project[]>([])






  const add_folder = fileStore((state) => state.add_folder);
  const add_file = fileStore((state) => state.add_file);
  const setLoading = fileStore((state) => state.setLoading);

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
    const filteredProject = allProjects.filter((projects) => {
      return projects.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
    setProjectData(filteredProject)
  }, [searchQuery])












  useEffect(() => {
    if (projectId) {
      // @ts-ignore
      getProjectId(projectId);
    }
    setProjectData(allProjects)
  }, [projectId, allProjects]);



  // console.log(router.asPath)









  return (


    // <div>
    //   <div
    //     className={` z-50 rounded p-1 duration-700 ease-in-out focus:outline-none ${showSidebar ? "bg-transparent" : "bg-white dark:bg-neutral-900"
    //       }`}
    //   >
    //     <button
    //       className="group flex h-10 w-10 flex-col items-center rounded"
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

    //   <div
    //     className={`fixed h-[100%] left-0 top-0 -z-10  w-[18vw] bg-white shadow-neutral-300 duration-300 ease-in-out dark:bg-neutral-900 dark:shadow-neutral-700 ${showSidebar ? "sidebar-shadow translate-x-0" : "-translate-x-full"
    //       }`}
    //   >
    //     <BreadCrumbs />
    //     <div
    //       id="sidebar-content"
    //       className="mt-10 flex flex-col items-center justify-center"
    //       style={{
    //         marginTop: "-65px",
    //       }}
    //     >
    //       <Image
    //         className="mx-auto"
    //         src="/assets/flow-chart.png"
    //         height={124}
    //         width={124}
    //         alt="Company Logo"
    //       />
    //     </div>


    //     <div className="h-[58vh]">
    //       <div className="flex flex-col space-y-2">
    //         <a className="flex items-center justify-between cursor-pointer font-bold w-[10vw] bg-slate-300 p-1 m-2 rounded shadow-lg hover:bg-slate-400" href={`/projects/`}>
    //           Home
    //           <AiTwotoneHome />
    //         </a>
    //         <a className="flex items-center justify-between cursor-pointer font-bold w-[10vw] bg-slate-300 p-1 m-2 rounded shadow-lg hover:bg-slate-400" href={`/projects/${projectId}`}>
    //           Overview
    //           <GrOverview />
    //         </a>
    //         <div
    //           className="flex items-center justify-between cursor-pointer font-bold w-[10vw] bg-slate-300 p-1 m-2 rounded shadow-lg hover:bg-slate-400"
    //           onClick={() => setInsightsOpen(!insightsOpen)}
    //         >
    //           <span>Insights</span>
    //           <FaChevronDown className={`transition-transform ${insightsOpen ? "transform rotate-180" : ""}`} />
    //         </div>
    //         {insightsOpen && (
    //           <div className="pl-4 mt-2 space-y-2">
    //             <a
    //               className="flex items-center font-bold hover:font-black"
    //               href={`/boards/${projectId}`}
    //             >
    //               <FaChalkboard className="mr-2" />
    //               Boards
    //             </a>
    //             <a
    //               className="flex items-center font-bold hover:font-black"
    //               href={`/backlogs/${projectId}`}
    //             >
    //               <GiChecklist className="mr-2" />
    //               Backlogs
    //             </a>
    //             <a className="flex items-center font-bold hover:font-black"
    //               href={`/sprints/${projectId}`}>
    //               <GiSprint className="mr-2" />
    //               Sprints
    //             </a>
    //             <a
    //               className="flex items-center font-bold hover:font-black"
    //               href={`/flowchart/${projectId}`}
    //             >
    //               <RiFlowChart className="mr-2" />
    //               Business Plan
    //             </a>
    //           </div>
    //         )}
    //       </div>
    //       {router.asPath == "/flowchart/" + projectId && <>
    //         <div className="grid grid-cols-2 gap-2 p-1">
    //           <button
    //             type="button"
    //             className="add-buttons w-25 peer h-8"
    //             onClick={() => add_folder()}
    //           >
    //             <AiFillFolderAdd className="add-buttons-icon" /> Add Folder
    //           </button>
    //           <button
    //             type="button"
    //             className="add-buttons w-21 peer h-8"
    //             onClick={() => add_file()}
    //           >
    //             <AiFillFileAdd className="add-buttons-icon" /> Add File
    //           </button>
    //         </div>
    //         <FileTree />
    //       </>}
    //     </div>
    //     <DarkModeToggleButton />
    //   </div>

    //   <div
    //     className={`pl-14 transition-all ${showSidebar ? "ml-[14.2vw]" : "ml-0"
    //       }`}
    //   ></div>
    // </div>

    <div className={`duration-700  sticky top-0  left-0 shadow ease-in-out text-slate-600 font-sans h-screen ${isOpen ? "w-60" : "w-0"}`}>
      {
        isOpen && (
          <nav>
            <div className="p-4 flex justify-center">
              <Image
                className="mx-auto"
                src="/assets/flow-chart.png"
                height={124}
                width={124}
                alt="Company Logo"
              />
            </div>
            {/* projects  */}
            <div
              onClick={() => setProjectsFlag(!projectsFlag)}
              className="hover:bg-sky-500 hover:text-white p-1 px-3 flex items-center justify-between cursor-pointer"
            >
              <span>
                <LiaProjectDiagramSolid className="inline" />Projects
              </span>
              <FaChevronDown
                className={`transition-transform ${projectsFlag ? 'transform rotate-180' : ''
                  }`}
              />
            </div>
            <div
              className={`max-h-0  overflow-hidden transition-all duration-300 ${projectsFlag ? 'max-h-screen' : ''
                }`}
            >
              {!loading && (
                <div className="h-52 overflow-auto ">
                  <div className="bg-white sticky  px-2 top-0">
                    <div className="flex items-center active:border-blue-500  border p-1 rounded-full justify-around ">
                      <input type="text" name="searchProduct" placeholder="search project" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="outline-none " />
                      <AiOutlineSearch className="text-2xl " />
                    </div>
                  </div>
                  {projectData.map((project, index) => (
                    <div key={index} className="p-1  px-3 hover:bg-sky-500 hover:text-white">
                      <Link href={`/projects/${project.id}`}>
                        <a className="w-[90%]  flex items-center ml-7 select-none">{project.name}</a>
                      </Link>
                    </div>
                  ))}
                  <div className="bg-white sticky bottom-0 right-0">
                    <div className=" mx-2  flex items-center justify-center  border rounded-lg  left-0">
                      <button className="p-1 "> Add Project </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className=" p-1 px-3 duration-100 hover:bg-sky-500 hover:text-white">
              <Link href="/projects" >
                <a className="flex items-center gap-2 w-full">
                  <AiTwotoneHome />
                  <span> Home </span>
                </a>
              </Link>
            </div>
            <div className="p-1 px-3 duration-100 hover:bg-sky-500 hover:text-white">
              <Link href={`/projects/${projectId}`} >
                <a className="flex items-center gap-2 w-full">
                  <GrOverview className="text-slate-600" />
                  <span>Overview</span>
                </a>
              </Link>
            </div>

            <div onClick={() => setInsightsOpen(!insightsOpen)} className="duration-100 select-none hover:bg-sky-500 hover:text-white p-1 px-3 flex items-center justify-between cursor-pointer">
              <span><CgInsights className="inline" /> Insights</span>
              <FaChevronDown className={`transition-transform ${insightsOpen ? "transform rotate-180" : ""}`} />
            </div>

            {/* insights */}

            <div className={`max-h-0 overflow-hidden transition-all duration-300 ${insightsOpen ? 'max-h-screen' : ''
              }`}>
              {
                insightsOpen && (
                  <>
                    <div className="p-1 duration-100 hover:bg-sky-500 hover:text-white ">
                      <Link href={`/projects/${projectId}/boards`}>
                        <a
                          className="flex items-center gap-2 w-full ml-7 select-none"
                        >
                          <FaChalkboard />
                          <span> Boards</span>
                        </a>
                      </Link>
                    </div>
                    <div className="p-1 duration-100 hover:bg-sky-500 hover:text-white">
                      <Link href={`/projects/${projectId}/backlogs`}>
                        <a
                          className="flex items-center gap-2 w-full ml-7 select-none"
                        >
                          <GiChecklist />
                          <span> Backlogs</span>
                        </a>
                      </Link>
                    </div>
                    <div className=" p-1 duration-100 hover:bg-sky-500 hover:text-white">
                      <Link href={`/projects/${projectId}/sprints`}>
                        <a className="flex items-center gap-2 w-full ml-7 select-none"
                        >
                          <GiSprint />
                          <span> Sprints</span>
                        </a>
                      </Link>
                    </div>
                    <div className="p-1 duration-100 hover:bg-sky-500 hover:text-white">
                      <Link href={`/projects/${projectId}/business-plan`}>
                        <a
                          className="flex items-center gap-2 w-full ml-7 select-none"
                        >
                          <RiFlowChart />
                          <span> Business Plan</span>
                        </a>
                      </Link>
                    </div>

                    {router.asPath == "/projects/" + projectId + "/business-plan" &&
                      (
                        <div className="h-[23vh] overflow-auto overflow-x-hidden ">
                          <div className=" grid grid-cols-2 gap-2 p-1 sticky top-0  text-white  bg-white z-10  ">
                            <button
                              type="button"
                              className=" rounded flex items-center gap-1 bg-sky-500 hover:bg-sky-600 duration-300 p-1 justify-center"
                              onClick={() => add_folder()}
                            >
                              <AiFillFolderAdd className="text-xl" /> <span>Add Folder</span>
                            </button>
                            <button
                              type="button"
                              className=" flex items-center rounded gap-1 p-1 bg-sky-500 justify-center hover:bg-sky-600 duration-300"
                              onClick={() => add_file()}
                            >
                              <AiFillFileAdd className="text-xl"/> <span>Add File</span>
                            </button>
                          </div>
                          <FileTree />
                        </div>
                      )
                    }
                  </>
                )
              }
            </div>
          </nav>
        )
      }
    </div>
  );
};

export default Sidebar;