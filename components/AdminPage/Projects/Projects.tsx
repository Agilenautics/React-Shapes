import React, { useState, useEffect, useCallback } from "react";
import { AiFillDelete } from "react-icons/ai";
import ProjectOverlay from "./ProjectOverlay";
import { auth } from '../../../auth'
import {
  DELETE_PROJECT,
  GET_USER,
  EDIT_PROJECT,
  edit_Project,
  delete_Project,
  update_recentProject,
  recentProject_mutation,
  GET_PROJECTS,
  GET_PROJECTS_BY_ID,
} from "./gqlProject";
import Link from "next/link";
import LoadingIcon from "../../LoadingIcon";
import { User, getInitials } from "../Users/Users";
import projectStore, { Project } from "./projectStore";
import userStore from "../Users/userStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiDotsVerticalRounded, } from 'react-icons/bi'
import { HiArrowsUpDown, HiXMark } from 'react-icons/hi2'
import { MdKeyboardArrowRight } from 'react-icons/md'

import { getNameFromEmail } from "../Users/Users";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { onAuthStateChanged } from "firebase/auth";

function Projects() {
  // Access Level controlled by the server-side or additional validation
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNewProjectDisabled, setIsNewProjectDisabled] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [recentProjectId, setRecentProjectId] = useState<string | null>(null);


  const [projectTrackChanges, setProjectTrackChanges] = useState(false);

  const allProjects = projectStore((state) => state.projects);
  const handleSorting = projectStore((state) => state.handleSorting);
  const sortValue = projectStore((state) => state.sortOrder);
  const updateSortOrder = projectStore((state) => state.updateSortOrder);
  const deleteProject = projectStore((state) => state.deleteProject);
  const updateProject = projectStore((state) => state.updateProject);
  // const loading = projectStore((state) => state.loading);
  const recycleBinProject = projectStore((state) => state.recycleBin)
  // user store
  const userType = userStore((state) => state.userType);
  const loginUser = userStore((state) => state.user);
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject);


  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser)


  const router = useRouter();
  const notify = () => toast.success("Project Created...");
  const deleteNotify = () => toast.error("Project Got Deleted...");




  const { data, error, loading } = useQuery(GET_USER, {
    variables: {
      where: {
        emailId: userEmail,
      },
    },
    
  });

  const getProjects = (response: any) => {
    if (!loading && response && response.users.length) {
      const projects = response.users[0].hasProjects;
      const userType = data.users[0].userType;
      updateProjects(projects, loading);
      updateLoginUser(data.users);
      updateUserType(userType)
      setProjectData(response.users[0].hasProjects);
      updateRecycleBinProject(projects);
    }
    
    
  }

  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        console.log(user.uid,"userId")
        setUserEmail(user.email);
        getProjects(data)
      }
    })
  }


  useEffect(() => {
    const filteredProjects = projectData.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    updateProjects(filteredProjects, false)
  }, [searchTerm]);

  useEffect(() => {
    setIsButtonDisabled(userType.toLowerCase() === "user");
    setIsNewProjectDisabled(userType.toLowerCase() === "super user");
    verificationToken()
    if (loginUser && loginUser.length) {
      setUserEmail(loginUser[0].emailId)
    }
  }, [data]);

  const handleSortClick = () => {
    const newSortOrder = sortValue === "asc" ? "desc" : "asc";
    updateSortOrder(newSortOrder);
    handleSorting();
  };

  const handleEditButtonClick = (
    projectId: string,
    projectName: string,
    projectDesc: string
  ) => {
    setProjectId(projectId);
    setProjectName(projectName);
    setProjectDesc(projectDesc);
  };

  const handleSaveButtonClick = (projectId: string) => {
    const result = { projectName, projectDesc };
    edit_Project(projectId, projectName, projectDesc, EDIT_PROJECT, GET_USER);
    updateProject(projectId, result);
    setProjectId(null);
    setProjectName("");
  };

  const handleDelete_Project = (id: string) => {
    // Display confirmation box
    // setShowConfirmation(true);
    delete_Project(id, DELETE_PROJECT, GET_USER).then((response)=>{
      setProjectTrackChanges(!projectTrackChanges);
      deleteNotify()
    })
    // setProjectId(projectId);
  };

  const handleConfirm = useCallback(() => {
    // Delete the project if confirmed
    setShowConfirmation(false);
    if (projectId) {
      delete_Project(projectId, DELETE_PROJECT, GET_PROJECTS);
      deleteProject(projectId);
      setProjectId(null);
    }
  }, [projectId]);

  const handleCancel = useCallback(() => {
    // Cancel the delete operation
    setShowConfirmation(false);
    setProjectId(null);
  }, []);

  const handleAddProjectClick = () => {
    setShowForm(true);
  };

  const handleAddProject = (name: string, desc: string) => {
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleMessage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  // to navigate recycle bin
  const toRecycleBin = () => {
    router.push("/recycleBin");
  };

  const handleDotClick = (id: string | any) => {
    setProjectTrackChanges(!projectTrackChanges);
    setProjectId(id);
  };

  const handleRecentOpenProject = (id: string | any) => {
    localStorage.setItem("recentPid", id);
    // update_recentProject(id,recentProject_mutation);
  }

  if (error) {
    return <div className="text-center text-danger">{error && error.message}</div>
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }



  return (
   

    // container
    <div className="p-7">
      {/* Greeting to a user  */}
      <div className="item-center mb-4 grid grid-cols-2 justify-center gap-6 rounded bg-white shadow-md dark:bg-slate-600">
        <div className=" item-center flex justify-center">
          <img
            src="/assets/grretingImage.png"
            height="50%"
            width="50%"
            alt=""
          />
        </div>

        <div className="flex flex-col justify-around">
          <div>
            <h2 className="text-4xl">
              Welcome! {getNameFromEmail(userEmail)}
            </h2>
            <p className="m-2 text-xl">
              Quality is never an accident; it is always the result of high
              intention, sincere effort, intelligent direction, and skillful
              execution
            </p>
          </div>
          <a
            href="#activities"
            className="m-2 cursor-pointer text-sky-500 underline duration-300 hover:text-sky-700"
          >
            see the daily activities
          </a>
        </div>
      </div>

      {/* Project  heading*/}
      <h2 className="mb-6 text-2xl font-semibold">Projects</h2>

      {/* project heading bar (functionality) */}
      <div
        id="activities"
        className="mb-6 grid h-fit grid-cols-4 items-center gap-6 bg-white p-4 text-center shadow dark:bg-slate-600"
      >
        <div className="rounded border border-slate-400 p-1">
          <input
            className=" bg-white-200 bg:text-slate-100 h-full w-full outline-none dark:bg-transparent"
            type="text"
            id="search"
            placeholder="Search"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className=" col-span-2">
          <span className="ml-5">Total : {allProjects.length}</span>
          <button
            onClick={handleSortClick}
            className="ml-5 rounded-lg p-2 duration-300 hover:bg-slate-100 hover:text-slate-500"
          >
            sorting:
            <HiArrowsUpDown
              className={`inline ${sortValue === "asc" ? "" : "rotate-180"}`}
            />{" "}
          </button>
          <button
            onClick={toRecycleBin}
            className="relative ml-5 rounded-lg  rounded-lg p-2 duration-300 hover:bg-slate-100 hover:text-slate-500"
          >
            RecycleBin: <AiFillDelete className="inline text-xl" />
            <span className="absolute right-[1px] top-1 h-[20px] w-4 rounded-full bg-sky-500 text-sm text-white">
              {recycleBinProject.length}
            </span>
          </button>
        </div>

        <div className="text-end">
          <button
            onClick={handleAddProjectClick}
            className="rounded border border-sky-500/75 bg-sky-500/75 p-2 text-white duration-300 hover:border hover:border-sky-500/75 hover:bg-transparent hover:text-sky-500"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* add project form container */}

      {showForm && (
        <ProjectOverlay
          notify={notify}
          onAddProject={handleAddProject}
          onClose={handleCloseForm}
          // @ts-ignore
          projectData={allProjects}
          userEmail={userEmail}
          handleMessage={handleMessage}
        />
      )}

      {/* project card */}
      <div className=" grid grid-cols-3   gap-6 ">
        {allProjects.map((projects, index) => {
          const { name, id, description, userHas, recentProject } = projects;
          return (
            <div
              key={index}
              className="san-sarif  relative flex flex-col justify-between rounded  bg-white  p-4 shadow-md duration-200 hover:shadow-xl dark:bg-slate-600"
            >
              <div>
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold"> {name} </h3>
                  <button
                    onClick={() => handleDotClick(id)}
                    className="text-xl"
                  >
                    {projectId === id && projectTrackChanges ? (
                      <HiXMark />
                    ) : (
                      <BiDotsVerticalRounded />
                    )}
                  </button>
                </div>
                <p className="mb-3 mt-2"> {description} </p>
              </div>
              <div>
                <div className="text-sky-500 ">
                  <Link href={`/projects/` + id}>
                    <a className="hover:underline duration-300" onClick={() => handleRecentOpenProject(id)}>see more  <MdKeyboardArrowRight className="inline" /></a>
                  </Link>
                </div>
                <div className="flex justify-end -space-x-[2%]"> {userHas && userHas.length && projectAssignedUser(userHas)} </div>
              </div>

              {projectId === id && projectTrackChanges ? (
                <div className="absolute -right-[20px] top-10 flex flex-col bg-white shadow">
                  <button className="border-b-2 bg-yellow-500 p-1 text-xs text-white">
                    Edit
                  </button>
                  <button
                    className="bg-red-500 p-1 text-xs text-white"
                    onClick={() => handleDelete_Project(id)}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {/* toastify to show popup after creating project */}
      <ToastContainer autoClose={2500} />
    </div>
  );
}

export default Projects;

// userList

export const projectAssignedUser = (userHas: any) => {
  const user = userHas.map((value: User, index: string) => {
    const { emailId } = value
    return (
      <div
        style={{ backgroundColor: getRandomColor() }}
        key={index}
        className=" group flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white"
      >
        <span className="">{getInitials(emailId)}</span>
      </div>
    );
  });
  return user;
};

export function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
