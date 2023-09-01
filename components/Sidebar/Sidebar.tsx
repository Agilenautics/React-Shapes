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
import { GET_USER, getUserByEmail } from "../AdminPage/Projects/gqlProject";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../auth";

interface SideBar {
  isOpen: Boolean
}

const Sidebar = ({ isOpen }: SideBar) => {
  // const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-700 transition ease transform duration-300 dark:bg-gray-100`;
  const updateInitData = fileStore((state) => state.updateInitData);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [projectsFlag, setProjectsFlag] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [recentPid, setRecentPid] = useState<string | null>('')

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


  // if (allProjects.length===0) {
  //   console.log(allProjects.length===0)
  //   console.log("Hi")
  //   getUserByEmail(userEmail, GET_USER).then((res) => {
  //     console.log(res)
  //   })
  // }


  // const getProjects = (response: any) => {
  //   if (!loading && response && response.users.length) {
  //     const projects = response.users[0].hasProjects;
  //     setProjectData(projects)
  //     const userType = data.users[0].userType;
  //     updateLoginUser(data.users)
  //     updateUserType(userType)
  //     updateProjects(projects, loading);
  //     updateRecycleBinProject(projects);
  //   }
  // }









  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email && allProjects.length === 0) {
        setUserEmail(user.email);
        // getProjects(data)
      }
    })
  }




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



  const handleRecentOpenProject = (id: string | any) => {
    localStorage.setItem("recentPid", id);
    // update_recentProject(id,recentProject_mutation);
  }














  useEffect(() => {
    if (projectId) {
      // @ts-ignore
      getProjectId(projectId);
    }
    fetchRecentProject(allProjects)
    verificationToken()

  }, [projectId, allProjects]);













  return (




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
                <LiaProjectDiagramSolid className="inline" />  Projects
              </span>
              <div>
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
                <div className="h-52 overflow-auto ">
                  <div className="bg-white sticky  p-2 top-0">
                    <div className="flex items-center active:border-blue-500  border p-1 rounded-full justify-around ">
                      <input type="text" name="searchProduct" placeholder="search project" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="outline-none " />
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
    </div>
  );
};

export default Sidebar;