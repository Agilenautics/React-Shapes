import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaTrashRestoreAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import {
  CLEAR_ALL_PROJECT,
  DELETE_PROJECT,
  GET_PROJECTS,
  PARMANENT_DELETE,
  clearRecycleBin,
  delete_Project,
  getUserByEmail,
  parmenantDelete,
  restoreFromRecycleBin,
} from "../../../gql";
import { ApolloQueryResult } from "@apollo/client";
import LoadingIcon from "../../LoadingIcon";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import { Project } from "../../../lib/appInterfaces";

function Projects() {
  // Access Level controlled by the server-side or additional validation
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNewProjectDisabled, setIsNewProjectDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectData, setProjectData] = useState<Project[]>([]);

  const {
    error,
    removeFromRecycleBin,
    clearRecyleBin: clearRecycle_Bin,
    updateSortOrder,
    sortOrder,
    handleSorting,
    recycleBin,
    loading,
    updateRecycleBinProject,
    updateProjectData: updateProjects,
  } = projectStore();
  const { userType, userEmail, updateLoginUser, updateUserType } = userStore();
  const getProjects = async (email: string) => {
    try {
      const response: ApolloQueryResult<any> | undefined = await getUserByEmail(
        email,
        GET_PROJECTS
      );
      const { hasProjects, ...userData } = response?.data.users[0];
      updateProjects(hasProjects, response?.loading, response?.error);
      updateRecycleBinProject(hasProjects);
      setProjectData(hasProjects);
      updateLoginUser(userData);
      updateUserType(userData.userType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userEmail) {
      getProjects(userEmail);
    }
  }, [userEmail]);
  useEffect(() => {
    const filteredData = projectData.filter(
      (element: any) =>
        element.name &&
        element.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    updateRecycleBinProject(filteredData);
  }, [searchTerm]);

  useEffect(() => {
    setIsButtonDisabled(userType.toLowerCase() === "user");
    setIsNewProjectDisabled(userType.toLowerCase() === "super user");
  }, [recycleBin]);

  const handleSortClick = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    updateSortOrder(newSortOrder);
    handleSorting();
  };

  const handleParmenantDelete = async (projectId: string) => {
    try {
      await parmenantDelete(
        projectId,
        PARMANENT_DELETE,
        GET_PROJECTS,
        userEmail
      );
      removeFromRecycleBin(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestoreFromRecycleBin = async (id: string) => {
    try {
      await restoreFromRecycleBin(id, DELETE_PROJECT, GET_PROJECTS, userEmail);
      removeFromRecycleBin(id);
    } catch (error) {
      console.log("Error in restoring from recycle bin", error);
    }
  };

  const handleClearRecycleBin = async () => {
    try {
      await clearRecycleBin(CLEAR_ALL_PROJECT, GET_PROJECTS, userEmail);
      clearRecycle_Bin();
    } catch (error) {
      console.log("Error in clearing the recycle bin", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger text-center">{error && error.message}</div>
    );
  }

  return (
    <div className="bg grey">
      <div className="ml-6 flex items-center">
        <button className="text-md ml-4 mt-4 h-10 rounded-lg bg-blue-200 px-5 font-semibold">
          Recycle Bin
        </button>
      </div>
      <div className="ml-10 mt-4 flex items-center">
        <h2 className="inline-block text-xl font-semibold">Projects</h2>
        <p className="ml-8 inline-block">Total</p>
        <div className="ml-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
          {recycleBin && recycleBin.length}
        </div>
        <button
          onClick={handleClearRecycleBin}
          className={`text-md ml-auto mr-12 flex items-center rounded-md bg-blue-200 p-2 ${
            isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }${isNewProjectDisabled ? "opacity-50" : ""}`}
          disabled={isButtonDisabled || isNewProjectDisabled}
          // TODO onClick logic for empty bin
        >
          <AiOutlineDelete />
          <div className="mx-1 my-1">Empty Recycle Bin</div>
        </button>
      </div>
      <div className="ml-10 mt-2">
        <div className="max-w-2xl">
          <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg bg-gray-200 focus-within:shadow-lg">
            <input
              className="peer h-full w-full bg-gray-200 p-4 text-base text-black outline-none"
              type="text"
              id="search"
              placeholder="Search..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="mb-4 ml-8 mt-4 w-11/12 rounded-lg text-left text-sm">
          <thead className="bg-gray-200 text-xs">
            <tr>
              <th
                scope="col"
                className="w-40 px-4 py-3"
                onClick={handleSortClick}
              >
                <div className="flex cursor-pointer items-center">
                  Project name
                  <AiOutlineArrowDown
                    className={`ml-1 text-sm ${
                      sortOrder === "asc" ? "rotate-180 transform" : ""
                    }`}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Deleted at
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recycleBin.map((project: Project) => (
              <tr key={project.id} className="border-b bg-white">
                <td className="whitespace-nowrap px-4 py-4 font-medium">
                  <label className="fontWeight-bold">{project.name}</label>
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  {project.deletedAT}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      handleRestoreFromRecycleBin(project.id);
                    }}
                    //  TODO onClick restore logic here
                    className={`mr-2 w-3 ${
                      isButtonDisabled ? "opacity-50" : ""
                    }`}
                    disabled={isButtonDisabled}
                  >
                    <FaTrashRestoreAlt />
                  </button>
                  <button
                    onClick={() => handleParmenantDelete(project.id)}
                    className={`ml-2 ${isButtonDisabled ? "opacity-50" : ""}`}
                    disabled={isButtonDisabled}
                  >
                    <MdDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Projects;
