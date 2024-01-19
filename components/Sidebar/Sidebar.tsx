import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import FileTree from "../TreeView/fileRenderer";
import {
  AiFillFolderAdd,
  AiFillFileAdd,
  AiOutlineSearch,
} from "react-icons/ai";
import { CgInsights } from "react-icons/cg";
import { GiSprint, GiChecklist } from "react-icons/gi";
import { GrOverview } from "react-icons/gr";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { FaChalkboard, FaChevronDown } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { RiFlowChart } from "react-icons/ri";
import fileStore from "../TreeView/fileStore";
import { useRouter } from "next/router";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import "react-tooltip/dist/react-tooltip.css";
import {
  createFile,
  ADD_FILE,
  createUidMethode,
  GET_FILES_FOLDERS_BY_PROJECT_ID,
  getUidMethode,
  GET_UID,
  updateUidMethode,
  UPDATED_UID,
  ADD_FOLDER,
} from "../../gql";
import Link from "next/link";
import projectStore from "../AdminPage/Projects/projectStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../auth";
import AddProjectPopup from "../AdminPage/Projects/ProjectOverlay";
import { ToastContainer, toast } from "react-toastify";
import { Project } from "../../lib/appInterfaces";
import { FetchResult } from "@apollo/client";
import { Tooltip } from "react-tooltip";
import { findById } from "../TreeView/backend";
import TreeModel from "tree-model-improved";
import { useTranslation } from "react-i18next";
import { createFolderInMain } from "../../gql/folders";

interface SideBar {
  isOpen: Boolean;
  toggleSideBar: any;
}

const Sidebar = ({ isOpen, toggleSideBar }: SideBar) => {
  const { t } = useTranslation(); // useTranslation hook
  // const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-700 transition ease transform duration-300 dark:bg-gray-100`;
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [projectsFlag, setProjectsFlag] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [addProjectPopUp, setAddProjectPopUp] = useState<Boolean | null>(false);
  // search project
  const [searchQuery, setSearchQuery] = useState("");
  //projects stores
  const { projects: allProjects, loading } = projectStore();
  const [projectData, setProjectData] = useState<Project[]>([]);

  const notify = () => toast.success("Project Created...");

  const {
    updateInitData,
    add_file,
    add_folder,
    setLoading,
    updateUid,
    uid,
    idofUid,
    Id: selectedFolderId,
    data: initData,
  } = fileStore();

  const router = useRouter();
  const projectId = (router.query.projectId as string) || "";

  const getuniqId = async () => {
    const uniqId = await getUidMethode(GET_UID);
    if (uniqId && uniqId.data.uids.length) {
      updateUid(uniqId.data.uids);
    } else {
      // await createUidMethode(createUidMutation);
    }
  };

  const verificationToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
      }
    });
  };
  useEffect(() => {
    getuniqId();
  }, []);

  useEffect(() => {
    const filteredProject = allProjects.filter((projects) => {
      return projects.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setProjectData(filteredProject);
  }, [searchQuery]);

  useEffect(() => {
    if (projectId) {
      setInsightsOpen(true);
    } else {
      setInsightsOpen(false);
    }
  }, [projectId]);

  // fetch recent project
  const fetchRecentProject = (project: any) => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
      const recentPid = localStorage.getItem("recentPid");
      // setRecentPid(recentPid)
      const to_be_removed = project.filter(
        (values: Project) => values.id !== recentPid
      );
      const to_be_update = project.filter(
        (value: Project) => value.id === recentPid
      );
      const updated_values = [...to_be_update, ...to_be_removed];
      setProjectData(updated_values);
    }
  };

  const onCloseAddProjectPopUp = () => {
    setAddProjectPopUp(false);
  };

  const handleRecentOpenProject = (id: string | any) => {
    localStorage.setItem("recentPid", id);
    // update_recentProject(id,recentProject_mutation);
  };

  useEffect(() => {
    fetchRecentProject(allProjects);
    verificationToken();
  }, [allProjects]);

  const handleUidUpdates = async () => {
    const uidResponse = (await updateUidMethode(idofUid, UPDATED_UID)) as any;
    updateUid(uidResponse.data.updateUids.uids);
  };

  const handleAddFolder = async () => {
    const newFolder = {
      name: "New Folder",
      uid,
      isOpen: false,
      sprintId: "",
    };
    const addFolderResponse: FetchResult<any> | undefined =
      await createFolderInMain(
        ADD_FOLDER,
        projectId,
        userEmail,
        newFolder,
        GET_FILES_FOLDERS_BY_PROJECT_ID
      );
    add_folder(addFolderResponse?.data.createFolders.folders[0]);
    handleUidUpdates();
  };

  const handleAddFile = async () => {
    let data = {
      name: "New File",
      description: "Custome description",
      status: "To-Do",
      uid,
      projectId,
    };
    try {
      const root = new TreeModel().parse(initData);
      const getData = findById(root, selectedFolderId);
      const type = getData?.model.type || "";
      switch (type) {
        case "file":
          const getParent = getData?.parent.model;
          if (getParent.type === "folder") {
            //adding file or story inside folder or epic
            const fileInFolderResponse: FetchResult<any> | undefined =
              await createFile(
                "",
                getParent.id,
                userEmail,
                ADD_FILE,
                data,
                GET_FILES_FOLDERS_BY_PROJECT_ID
              );
            add_file(fileInFolderResponse?.data.createFiles.files[0]);
            handleUidUpdates();
          } else {
            //  adding file or story inside project
            data.name = "FileInMain";
            const fileInMainResponse: FetchResult<any> | undefined =
              await createFile(
                getParent.id,
                "",
                userEmail,
                ADD_FILE,
                data,
                GET_FILES_FOLDERS_BY_PROJECT_ID
              );
            add_file(fileInMainResponse?.data.createFiles.files[0]);
            handleUidUpdates();
          }
          break;
        case "folder":
          // adding file inside the folder
          let { id } = getData?.model;
          const fileInFolderResponse: FetchResult<any> | undefined =
            await createFile(
              "", //passing empty string (no project id)
              id, //id of the folder
              userEmail,
              ADD_FILE,
              data,
              GET_FILES_FOLDERS_BY_PROJECT_ID
            );
          add_file(fileInFolderResponse?.data.createFiles.files[0]);
          handleUidUpdates();
          break;
        default:
          // if u select main or project then file it will add inside the project
          // adding file or story inside project
          data.name = "FileInMain";
          const fileInMainResponse: FetchResult<any> | undefined =
            await createFile(
              projectId,
              "",
              userEmail,
              ADD_FILE,
              data,
              GET_FILES_FOLDERS_BY_PROJECT_ID
            );
          add_file(fileInMainResponse?.data.createFiles.files[0]);
          handleUidUpdates();
      }
    } catch (error) {
      console.log(error, "while creating file in main in bussiness plan");
    }
  };

  return (
    <div
      className={`  z-20  h-full font-sans text-slate-600 shadow duration-700 ease-in-out dark:bg-bgdarkcolor dark:text-white  ${
        isOpen ? "w-[18rem]" : "w-0"
      }`}
    >
      {isOpen && (
        <nav>
          {/* top bar image section */}
          <div className="flex py-4">
            <div className=" flex w-[90%] justify-center">
              <Image
                className="mx-auto"
                src="/assets/flow-chart.png"
                height={100}
                width={124}
                alt="Company Logo"
                priority={false}
              />
            </div>
            <button onClick={toggleSideBar} className="duration-200">
              {" "}
              <IoIosArrowDropleftCircle className="relative -right-3 top-6 text-2xl text-slate-600 dark:text-blue-600 " />{" "}
            </button>
          </div>
          {/* projects  */}
          <div>
            <div className="flex items-center justify-between p-1 px-3 ">
              <span
                onClick={() => setProjectsFlag(!projectsFlag)}
                className="cursor-pointer"
              >
                <LiaProjectDiagramSolid className="inline" /> {t("project")}
              </span>
              {/* absolute whitespace-nowrap text-sm */}
              <div
                ref={container}
                onClick={() => setAddProjectPopUp(!addProjectPopUp)}
                onMouseEnter={({ clientX }) => {
                  if (!tooltipRef.current || !container.current) return;
                  const { left } = container.current.getBoundingClientRect();
                  tooltipRef.current.style.left = clientX - left + "px";
                }}
                className="group relative cursor-pointer"
              >
                <BsPlus className="dark:bg-475569  rounded bg-slate-100 text-[1.3rem] duration-300 hover:scale-125 dark:text-slate-900" />
                <span
                  ref={tooltipRef}
                  className="invisible absolute top-full z-20 mt-2 whitespace-nowrap rounded bg-black p-1 text-[0.8rem] text-white opacity-0 transition group-hover:visible group-hover:opacity-100"
                ></span>
              </div>
              <div
                onClick={() => setProjectsFlag(!projectsFlag)}
                className="cursor-pointer"
              >
                <FaChevronDown
                  className={`inline transition-transform ${
                    projectsFlag ? "rotate-180 transform" : ""
                  }`}
                />
              </div>
            </div>
            <div
              className={`max-h-0  overflow-hidden transition-all duration-300 ${
                projectsFlag ? "max-h-screen" : ""
              }`}
            >
              {!loading && (
                <div className="h-full overflow-auto ">
                  <div className="#ffffff top-0 p-2">
                    <div className="flex items-center justify-around  rounded-full border p-1 active:border-blue-500  ">
                      <input
                        type="text"
                        name="searchProduct"
                        placeholder="search project"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="outline-none dark:bg-bgdarkcolor"
                      />
                      <AiOutlineSearch className="text-2xl " />
                    </div>
                  </div>
                  {projectData.map((project, index) => (
                    <div
                      key={index}
                      className={`p-1  px-3 ${
                        project.id === projectId
                          ? "bg-sky-500 text-white"
                          : "hover:bg-sky-500"
                      } hover:text-white`}
                    >
                      <Link href={`/projects/${project.id}`}>
                        <a
                          className="ml-7  flex w-[90%] select-none items-center"
                          onClick={() => handleRecentOpenProject(project.id)}
                        >
                          {project.name}
                        </a>
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
          <div
            onClick={() => (projectId ? setInsightsOpen(!insightsOpen) : null)}
            className="flex cursor-pointer select-none items-center justify-between p-1 px-3 duration-100"
          >
            <span>
              <CgInsights className="inline" /> {t("insights")}
            </span>
            <FaChevronDown
              className={`transition-transform ${
                insightsOpen ? "rotate-180 transform" : ""
              }`}
              id="clickable"
            />
            {!insightsOpen && projectId.length <= 0 && (
              <Tooltip anchorSelect="#clickable">
                <button>{t("please_select_project")}</button>
              </Tooltip>
            )}
          </div>

          {/* insights */}

          <div
            className={`max-h-0 overflow-hidden transition-all duration-300 ${
              insightsOpen ? "max-h-screen" : ""
            }`}
          >
            {insightsOpen && (
              <>
                <div className="p-1  duration-100">
                  <Link href={`/projects/${projectId}`}>
                    <a className="ml-7 flex w-full items-center gap-2">
                      <GrOverview className="text-slate-600  dark:bg-slate-200 " />
                      <span>Overview</span>
                    </a>
                  </Link>
                </div>
                <div className="p-1 duration-100">
                  <Link href={`/projects/${projectId}/business-process`}>
                    <a className="ml-7 flex w-full select-none items-center gap-2">
                      <RiFlowChart />
                      <span>{t("business_process")}</span>
                    </a>
                  </Link>
                </div>
                {/* {router.asPath===`/projects/${projectId}/business-process/edit?id=${router.query.id}` && <Edit />} */}
                {/* {router.pathname === "/parent/child2" && <Child2 />} */}

                {router.asPath ==
                  "/projects/" + projectId + "/business-process" && (
                  <div>
                    <div className=" sticky top-0 grid grid-cols-2 gap-2 bg-white  p-1  text-white  ">
                      <button
                        type="button"
                        className=" flex items-center justify-center gap-1 rounded bg-sky-500 p-1 duration-300 hover:bg-sky-600"
                        onClick={handleAddFolder}
                      >
                        <AiFillFolderAdd className="text-xl" />
                        <span>{t("add_folder")}</span>
                      </button>
                      <button
                        type="button"
                        className=" flex items-center justify-center gap-1 rounded bg-sky-500 p-1 duration-300 hover:bg-sky-600"
                        onClick={handleAddFile}
                      >
                        <AiFillFileAdd className="text-xl" />
                        <span>{t("add_file")}</span>
                      </button>
                    </div>
                    <div className="h-36 overflow-auto overflow-x-hidden ">
                      <FileTree />
                    </div>
                  </div>
                )}
                <div className="p-1 duration-100 ">
                  <Link href={`/projects/${projectId}/boards`}>
                    <a className="ml-7 flex w-full select-none items-center gap-2">
                      <FaChalkboard />
                      <span>{t("boards")}</span>
                    </a>
                  </Link>
                </div>
                <div className="p-1 duration-100">
                  <Link href={`/projects/${projectId}/backlogs`}>
                    <a className="ml-7 flex w-full select-none items-center gap-2">
                      <GiChecklist
                        className="font-weight: 900 dark:text-white"
                        size={18}
                      />
                      <span>{t("backlogs")}</span>
                    </a>
                  </Link>
                </div>
                <div className=" p-1 duration-100 ">
                  <Link href={`/projects/${projectId}/sprints`}>
                    <a className="ml-7 flex w-full select-none items-center gap-2">
                      <GiSprint />
                      <span>{t("sprints")} </span>
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      )}
      {addProjectPopUp && (
        <AddProjectPopup
          onClose={onCloseAddProjectPopUp}
          notify={notify}
          userEmail={userEmail}
          projectData={projectData}
        />
      )}
      <ToastContainer autoClose={2500} />
    </div>
  );
};

export default Sidebar;
