import React, { useState, useEffect, useCallback } from "react";
import { AiFillDelete } from "react-icons/ai";
import ProjectOverlay from "./ProjectOverlay";
import {
  GET_PROJECTS,
  DELETE_PROJECT,
  delete_Project,
  getUserByEmail,
} from "../../../gql";
import Link from "next/link";
import LoadingIcon from "../../LoadingIcon";
import { getInitials } from "../Users/Users";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { HiArrowsUpDown, HiXMark } from "react-icons/hi2";
import { MdKeyboardArrowRight } from "react-icons/md";

import { getNameFromEmail } from "../Users/Users";
import { useRouter } from "next/router";
import { ApolloQueryResult } from "@apollo/client";
import { Project, User } from "../../../lib/appInterfaces";
import { useTranslation } from "react-i18next";
import { loader } from 'graphql.macro';

function Projects() {
  const { t } = useTranslation(); // useTranslation hook



  // Access Level controlled by the server-side or additional validation
  const [projectId, setProjectId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectTrackChanges, setProjectTrackChanges] = useState(false);

  // project store
  const {
    projects: allProjects,
    MovetoRecycleBin,
    error,
    updateProject,
    recycleBin: recycleBinProject,
    handleSorting,
    sortOrder: sortValue,
    updateSortOrder,
    updateProjectData: updateProjects,
    loading,
    updateRecycleBinProject,
  } = projectStore();

  // user store
  const {
    userType,
    user: loginUser,
    updateUserType,
    userEmail,
    updateLoginUser,
  } = userStore();
  const router = useRouter();
  // from the toestify library
  const notify = () => toast.success("Project Created...");
  const deleteNotify = () => toast.error("Project Got Deleted...");

  const getProjects = async (email: string) => {
    try {
      const response: ApolloQueryResult<any> | undefined = await getUserByEmail(
        email,
        GET_PROJECTS
      );
      if (response?.data && response.data.users.length) {
        const { hasProjects, ...userData } = response?.data.users[0];
        updateProjects(hasProjects, response?.loading, response?.error);
        setProjectData(hasProjects);
        updateRecycleBinProject(hasProjects);
        updateLoginUser(userData);
        updateUserType(userData.userType);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userEmail) {
      getProjects(userEmail);
    }
    // setIsButtonDisabled(userType.toLowerCase() === "user");
    // setIsNewProjectDisabled(userType.toLowerCase() === "super user");
  }, [userEmail]);

  useEffect(() => {
    if (projectData && projectData.length) {
      const filteredProjects = projectData.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      updateProjects(filteredProjects, false, null);
    }
  }, [searchTerm]);

  const handleSortClick = () => {
    const newSortOrder = sortValue === "asc" ? "desc" : "asc";
    updateSortOrder(newSortOrder);
    handleSorting();
  };

  const handleDelete_Project = async (id: string) => {
    await delete_Project(id, DELETE_PROJECT, GET_PROJECTS, userEmail);
    // adding a project to recycle bin
    MovetoRecycleBin(id);
    setProjectTrackChanges(!projectTrackChanges);
    deleteNotify();
    // setProjectId(projectId);
  };

  // const handleConfirm = useCallback(() => {
  //   // Delete the project if confirmed
  //   setShowConfirmation(false);
  //   if (projectId) {
  //     // delete_Project(projectId, DELETE_PROJECT, GET_USER);
  //     deleteProject(projectId);
  //     setProjectId(null);
  //   }
  // }, [projectId]);

  // const handleCancel = useCallback(() => {
  //   // Cancel the delete operation
  //   setShowConfirmation(false);
  //   setProjectId(null);
  // }, []);

  const handleAddProjectClick = () => {
    setShowForm(true);
  };

  const handleAddProject = (name: string, desc: string) => {
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
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
  };

  if (error) {
    return (
      <div className="text-danger text-center">{error && error.message}</div>
    );
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
      <div className="item-center mb-4 grid grid-cols-2 justify-center gap-6 rounded bg-white shadow-md dark:bg-bgdarkcolor">
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
              {t("welcome")} {getNameFromEmail(userEmail)}
            </h2>
            <p className="m-2 text-xl">{t("headtitle")}</p>
          </div>
          <a
            href="#activities"
            className="m-2 cursor-pointer text-sky-500 underline duration-300 hover:text-sky-700"
          >
            {t("activities")}
          </a>
        </div>
      </div>

      {/* Project  heading*/}
      <h2 className="mb-6 text-2xl font-semibold"> {t("projects")}</h2>

      {/* project heading bar (functionality) */}
      <div
        id="activities"
        className="mb-6 grid h-fit grid-cols-4 items-center gap-6 bg-white p-4 text-center shadow dark:bg-bgdarkcolor"
      >
        <div className="rounded border border-slate-400 p-1">
          <input
            className=" bg-white-200 bg:text-slate-100 h-full w-full outline-none dark:bg-transparent"
            type="text"
            id="search"
            placeholder={t("search")}
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className=" col-span-2">
          <span className="ml-5">
            {t("total")} : {allProjects.length}
          </span>
          <button
            onClick={handleSortClick}
            className="ml-5 rounded-lg p-2 duration-300 hover:bg-slate-100 hover:text-slate-500"
          >
            {t("sorting")}:
            <HiArrowsUpDown
              className={`inline ${sortValue === "asc" ? "" : "rotate-180"}`}
            />{" "}
          </button>
          <button
            onClick={toRecycleBin}
            className="relative ml-5 rounded-lg  rounded-lg p-2 duration-300 hover:bg-slate-100 hover:text-slate-500"
          >
            {t("recyclebin")}: <AiFillDelete className="inline text-xl" />
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
            {t("add_project")}
          </button>
        </div>
      </div>

      {/* add project form container */}

      {showForm && (
        <ProjectOverlay
          notify={notify}
          //@ts-ignore
          onAddProject={handleAddProject}
          onClose={handleCloseForm}
          projectData={allProjects}
          userEmail={userEmail}
        />
      )}

      {/* project card */}
      <div className=" grid grid-cols-3   gap-6 ">
        {allProjects.map((projects, index) => {
          const { name, id, description, usersInProjects, recentProject } = projects;
          return (
            <div
              key={index}
              className="san-sarif  relative flex flex-col justify-between rounded  bg-white  p-4 shadow-md duration-200 hover:shadow-xl dark:bg-bgdarkcolor"
            >
              <div>
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold "> {name} </h3>
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
                    <a
                      className="duration-300 hover:underline"
                      onClick={() => handleRecentOpenProject(id)}
                    >
                      {t("see_more")}{" "}
                      <MdKeyboardArrowRight className="inline" />
                    </a>
                  </Link>
                </div>
                <div className="flex justify-end -space-x-[2%]">
                  {" "}
                  {usersInProjects &&
                    usersInProjects.length &&
                    projectAssignedUser(usersInProjects)}{" "}
                </div>
              </div>

              {projectId === id && projectTrackChanges ? (
                <div className="absolute -right-[20px] top-10 flex flex-col bg-white shadow">
                  <button className="border-b-2 bg-yellow-500 p-1 text-xs text-white">
                    {t("edit")}
                  </button>
                  <button
                    className="bg-red-500 p-1 text-xs text-white"
                    onClick={() => handleDelete_Project(id)}
                  >
                    {t("delete")}
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

export const projectAssignedUser = (usersInProjects: any) => {
  const user = usersInProjects.map((value: User, index: string) => {
    const { emailId } = value;
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
