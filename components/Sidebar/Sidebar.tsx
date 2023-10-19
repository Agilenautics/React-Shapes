import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FileTree } from "../TreeView/fileRenderer";
import { AiFillFolderAdd, AiFillFileAdd, AiTwotoneHome, AiOutlineSearch } from "react-icons/ai";
import { CgInsights } from 'react-icons/cg'
import { GiSprint, GiChecklist } from "react-icons/gi"
import { GrOverview } from "react-icons/gr"
import { LiaProjectDiagramSolid } from 'react-icons/lia'
import { FaChalkboard, FaChevronDown } from "react-icons/fa"
import { BsPlus } from 'react-icons/bs'
import { RiFlowChart } from "react-icons/ri"
import fileStore from "../TreeView/fileStore";
import { useRouter } from "next/router";
import { createFileInFolder, createFileInMain, createFolderInMain, createUidMethode, createUidMutation, getMainByUser, getTreeNodeByUser, getUidMethode, getUidQuery, newFileInFolder, newFileInMain, newFolderInMain, updateUidMethode, updateUidMutation } from "../TreeView/gqlFiles";
import Link from "next/link";
import projectStore, { Project } from "../AdminPage/Projects/projectStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../auth";
import AddProjectPopup from "../AdminPage/Projects/ProjectOverlay";
import { ToastContainer, toast } from "react-toastify";

interface SideBar {
  isOpen: Boolean
}

const Sidebar = ({ isOpen }: SideBar) => {
  // const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-700 transition ease transform duration-300 dark:bg-gray-100`;
  const updateInitData = fileStore((state) => state.updateInitData);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [projectsFlag, setProjectsFlag] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const [addProjectPopUp, setAddProjectPopUp] = useState<Boolean | null>(false)


  // search project
  const [searchQuery, setSearchQuery] = useState('')
  //projects stores
  const allProjects = projectStore((state) => state.projects);
  const loading = projectStore((state) => state.loading);
  const [projectData, setProjectData] = useState<Project[]>([]);


  const notify = () => toast.success("Project Created...");







  const add_file = fileStore((state) => state.add_file);
  const add_folder = fileStore((state) => state.add_folder);
  const setLoading = fileStore((state) => state.setLoading);
  const updateUids = fileStore((state) => state.updateUid);
  const uid = fileStore((state) => state.uid);
  const idOfUid = fileStore((state) => state.idofUid);
  const selectedFolderId = fileStore((state) => state.Id)




  const router = useRouter();
  const projectId = router.query.projectId as string || "";

  const getProjectId = async (id: string) => {
    const initData = await getTreeNodeByUser(getMainByUser, id, setLoading);
    const data = initData[0];
    //@ts-ignore
    updateInitData(data);
    return initData;
  };

  const getuniqId = async () => {
    const uniqId = await getUidMethode(getUidQuery);
    updateUids(uniqId.data.uids)
    if (uniqId.data.uids.length === 0) {
      await createUidMethode(createUidMutation);
    }
  }





  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        setUserEmail(user.email);
      }
    })
  }


  useEffect(() => {
    getuniqId()
  }, []);





  useEffect(() => {
    const filteredProject = allProjects.filter((projects) => {
      return projects.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
    setProjectData(filteredProject)
  }, [searchQuery]);







  // fetch recent project

  const fetchRecentProject = (project: any) => {
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      const recentPid = localStorage.getItem('recentPid');
      // setRecentPid(recentPid)
      const to_be_removed = project.filter((values: Project) => values.id !== recentPid);
      const to_be_update = project.filter((value: Project) => value.id === recentPid);
      const updated_values = [...to_be_update, ...to_be_removed];
      setProjectData(updated_values)
    }

  }

  const onCloseAddProjectPopUp = () => {
    setAddProjectPopUp(false)
  }



  const handleRecentOpenProject = (id: string | any) => {
    localStorage.setItem("recentPid", id);
    // update_recentProject(id,recentProject_mutation);
  }














  useEffect(() => {
    if (projectId && router.asPath !== "/projects/06c94e7b-2a73-41b1-9683-61662706823a/sprints") {
      // @ts-ignore
      getProjectId(projectId);
    }
    fetchRecentProject(allProjects)
    verificationToken()
  }, [projectId, allProjects]);

  const handleUidUpdates = async () => {
    const uidResponse = await updateUidMethode(idOfUid, updateUidMutation) as any
    updateUids(uidResponse.data.updateUids.uids)
  }




  const handleAddFolder = async () => {
    const newFolder = {
      name: "New Folder",
      uid,
      isOpen: false
    }
    const updatedFolderResponse = await createFolderInMain(newFolderInMain, projectId, newFolder);
    add_folder(updatedFolderResponse)
    handleUidUpdates()
  }



  const handleAddFile = async () => {
    try {
      if (selectedFolderId) {
        const data = {
          name: "New File",
          description: "Custome description",
          status: "To-Do",
          uid
        }
        const fileInFolderResponse = await createFileInFolder(newFileInFolder, selectedFolderId, data);
        console.log(fileInFolderResponse)
        add_file(fileInFolderResponse)
        handleUidUpdates()

      } else {
        const newFile = {
          name: "FileInMain",
          status: "To-Do",
          description: "Custome description",
          uid
        }
        const fileInMainResponse = await createFileInMain(newFileInMain, projectId, newFile)
        add_file(fileInMainResponse)
        handleUidUpdates()
      }
    } catch (error) {
      console.log(error, "while creating file in main in bussiness plan")
    }
  }










  return (




    <div className={` duration-700 dark:bg-bgdarkcolor dark:text-white  top-0 z-20 left-0 shadow ease-in-out text-slate-600 font-sans h-full  ${isOpen ? "w-60" : "w-0"}`}>
      {
        isOpen && (
          <nav>
            {/* top bar image section */}
            <div className="p-4 flex justify-center">
              <Image
                className="mx-auto"
                src="/assets/flow-chart.png"
                height={124}
                width={124}
                alt="Company Logo"
                priority={false}
              />
            </div>
                        {/* projects  */}
            <div>
              <div
                className="p-1 px-3 flex items-center justify-between "
              >
                <span onClick={() => setProjectsFlag(!projectsFlag)} className="cursor-pointer" >
                  <LiaProjectDiagramSolid className="inline" />  Projects
                </span>
                {/* absolute whitespace-nowrap text-sm */}
                <div
                  ref={container}
                  onClick={() => setAddProjectPopUp(!addProjectPopUp)}
                  onMouseEnter={({ clientX }) => {
                    if (!tooltipRef.current || !container.current) return;
                    const { left } = container.current.getBoundingClientRect();
                    tooltipRef.current.style.left = clientX - left + 'px'
                  }}
                  className="cursor-pointer group relative">
                  <BsPlus className="text-[1.3rem]  bg-slate-100 duration-300 hover:scale-125 rounded dark:bg-475569 dark:text-slate-900" />
                  <span ref={tooltipRef} className="invisible z-20 group-hover:visible opacity-0 group-hover:opacity-100 transition bg-black p-1 text-white rounded absolute top-full mt-2 whitespace-nowrap text-[0.8rem]">ADD PROJECT</span>
                </div>
                <div onClick={() => setProjectsFlag(!projectsFlag)} className="cursor-pointer">
                  <FaChevronDown
                    className={`transition-transform inline ${projectsFlag ? 'transform rotate-180' : ''
                      }`}
                  />
                </div>
              </div>
              <div
                className={`max-h-0  overflow-hidden transition-all duration-300 ${projectsFlag ? 'max-h-screen' : ''
                  }`}
              >
                {!loading && (
                  <div className="h-full overflow-auto ">
                    <div className="#ffffff p-2 top-0">
                      <div className="flex items-center active:border-blue-500  border p-1 rounded-full justify-around  ">
                        <input type="text" name="searchProduct" placeholder="search project" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="outline-none dark:bg-bgdarkcolor" />
                        <AiOutlineSearch className="text-2xl " />
                      </div>
                    </div>
                    {projectData.map((project, index) => (
                      <div key={index} className={`p-1  px-3 ${project.id === projectId ? "bg-sky-500 text-white" : "hover:bg-sky-500"} hover:text-white`}>
                        <Link href={`/projects/${project.id}`}>
                          <a className="w-[90%]  flex items-center ml-7 select-none" onClick={() => handleRecentOpenProject(project.id)}>{project.name}</a>
                        </Link>
                      </div>
                    ))}
                    {/* <div className="bg-white sticky bottom-0 right-0">
                    <div className=" mx-2  flex items-center justify-center  border rounded-lg  left-0">
                      <button className="p-1 "> Add Project </button>
                    </div>
                  </div> */}
                  </div>
                )}
              </div>
            </div>

            <div className=" p-1 px-3 duration-100">
              <Link href="/projects" >
                <a className="flex items-center gap-2 w-full">
                  <AiTwotoneHome />
                  <span> Home </span>
                </a>
              </Link>
            </div>
            <div className="p-1 px-3 duration-100">
              <Link href={`/projects/${projectId}`} >
                <a className="flex items-center gap-2 w-full">
                  <GrOverview className="text-slate-600  dark:bg-slate-200 "/>
                  <span>Overview</span>
                </a>
              </Link>
            </div>

            <div onClick={() => setInsightsOpen(!insightsOpen)} className="duration-100 select-none p-1 px-3 flex items-center justify-between cursor-pointer">
              <span><CgInsights className="inline" /> Insights</span>
              <FaChevronDown className={`transition-transform ${insightsOpen ? "transform rotate-180" : ""}`} />
            </div>

            {/* insights */}

            <div className={`max-h-0 overflow-hidden transition-all duration-300 ${insightsOpen ? 'max-h-screen' : ''
              }`}>
              {
                insightsOpen && (
                  <>
                    <div className="p-1 duration-100 ">
                    <Link href={`/projects/${projectId}/boards`}>
                        <a
                          className="flex items-center gap-2 w-full ml-7 select-none"
                        >
                          <FaChalkboard />
                          <span> Boards</span>
                        </a>
                      </Link>
                    </div>
                    <div className="p-1 duration-100">
                      <Link href={`/projects/${projectId}/backlogs`}>
                        <a
                          className="flex items-center gap-2 w-full ml-7 select-none"
                        >
                          <GiChecklist className="dark:text-white font-weight: 900" size={18} />
                          <span> Backlogs</span>
                        </a>
                      </Link>
                    </div>
                    <div className=" p-1 duration-100 ">
                      <Link href={`/projects/${projectId}/sprints`}>
                        <a className="flex items-center gap-2 w-full ml-7 select-none"
                        >
                          <GiSprint />
                          <span> Sprints</span>
                        </a>
                      </Link>
                    </div>
                    <div className="p-1 duration-100">
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
                          <div className=" grid grid-cols-2 gap-2 p-1 sticky top-0  text-white  bg-white  ">
                            <button
                              type="button"
                              className=" rounded flex items-center gap-1 bg-sky-500 hover:bg-sky-600 duration-300 p-1 justify-center"
                              onClick={handleAddFolder}
                            >
                              <AiFillFolderAdd className="text-xl" /> <span>Add Folder</span>
                            </button>
                            <button
                              type="button"
                              className=" flex items-center rounded gap-1 p-1 bg-sky-500 justify-center hover:bg-sky-600 duration-300"
                              onClick={handleAddFile}
                            >
                              <AiFillFileAdd className="text-xl" /> <span>Add File</span>
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
      {
        // @ts-ignore
        addProjectPopUp && <AddProjectPopup onClose={onCloseAddProjectPopUp} notify={notify} userEmail={userEmail} projectData={projectData} />
      }
      {/* <AddProjectPopup /> */}
      <ToastContainer autoClose={2500} />
    </div>
  );
};

export default Sidebar;