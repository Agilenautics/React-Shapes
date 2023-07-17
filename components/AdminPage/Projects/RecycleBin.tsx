import React, { useState, useEffect, useCallback } from "react";
import { GrAdd } from "react-icons/gr";
import { BiRename } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import {
  DELETE_PROJECT,
  GET_PROJECTS,
  GET_USER,
  EDIT_PROJECT,
  edit_Project,
  delete_Project,
  get_user_method,
} from "./gqlProject";
import { useQuery } from "@apollo/client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../auth";
import Link from "next/link";
import LoadingIcon from "../../LoadingIcon";
import { User } from "../Users/Users";

interface Project {
  id: string;
  name: string;
  desc: string;
  deletedAt: string; //TODO removed descirption and added timestamps
  users: User[];
  recycleBin: boolean;
}

function Projects() {
  // Access Level controlled by the server-side or additional validation
  const [projectId, setProjectId] = useState<string | null>(null);
  const [recycleBin, setRecycleBin] = useState<boolean | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDeletedAt, setProjectDeletedAt] = useState(""); //TODO defined new state ProjectDeletedAt
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNewProjectDisabled, setIsNewProjectDisabled] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedProjects, setSortedProjects] = useState<Project[]>([]);

  const { data, error, loading } = useQuery(GET_USER, {
    variables: {
      where: {
        emailId: userEmail,
      },
    },
  });


  const getProject = async (data: Array<Project>) => {
    // @ts-ignore
    if (data && data.users.length) {
      //@ts-ignore
      const userType = data.users[0].userType;
      setAccessLevel(userType);
      //@ts-ignore
      setProjectData(data.users[0].hasProjects);
    }
  };

  //verifying token
  const verifyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        if (loading) return "";
        getProject(data);
      }
    });
  };
  useEffect(() => {
    const filteredProjects = projectData.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) && project.recycleBin
    );
    setSortedProjects(filteredProjects);
  }, [projectData, searchTerm]);

  useEffect(() => {
    verifyAuthToken();
    setIsButtonDisabled(accessLevel.toLowerCase() === "user");
    setIsNewProjectDisabled(accessLevel.toLowerCase() === "super user");
  }, [userEmail, getProject]);

  const handleSortClick = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedProjectsCopy = [...sortedProjects];
    sortedProjectsCopy.sort((a, b) => {
      if (newSortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setSortedProjects(sortedProjectsCopy);
  };

  //TODO ============================================= 
  const handleEditButtonClick = ( // restore button
    projectId: string,
    projectName: string,
    projectDeletedAt: string,
    recycleBin: boolean,
  ) => {
    setProjectId(projectId);
    setProjectName(projectName);
    setProjectDeletedAt(projectDeletedAt);
    setRecycleBin(recycleBin);
  };

  const handleSaveButtonClick = (projectId: string) => { //restore DB
    edit_Project(projectId, projectName, projectDeletedAt, EDIT_PROJECT, GET_USER);
    setProjectId(null);
    setProjectName("");
  };
  //TODO =================================================================

  const handleDelete_Project = (projectId: string) => {
    // Display confirmation box
    setShowConfirmation(true);
    setProjectId(projectId);
  };

  const handleConfirm = useCallback(() => {
    // Delete the project if confirmed
    setShowConfirmation(false);
    if (projectId && recycleBin) {
      delete_Project(projectId, DELETE_PROJECT, GET_USER);
      setProjectId(null);
    }
  }, [projectId]);

  const handleCancel = useCallback(() => {
    // Cancel the delete operation
    setShowConfirmation(false);
    setProjectId(null);
  }, []);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    console.log(error.message);
  }
  

  return (
    <div className="bg grey">
      <div className="mt-4 flex justify-center">
        {successMessage && (
          <div className="rounded-md bg-green-200 px-4 py-2 text-green-800">
            {successMessage}
          </div>
        )}
      </div>
      <div className="ml-6 flex items-center">
        <button className="text-md ml-4 mt-4 h-10 rounded-lg bg-blue-200 px-5 font-semibold">
          Recycle Bin
        </button>
      </div>
      <div className="ml-10 mt-4 flex items-center">
        <h2 className="inline-block text-xl font-semibold">Projects</h2>
        <p className="ml-8 inline-block">Total</p>
        <div className="ml-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
          {sortedProjects && sortedProjects.length}
        </div>
      </div>
      <div className="ml-10 mt-2">
        <div className="max-w-2xl">
          <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg bg-gray-200 focus-within:shadow-lg">
            <div className="grid h-full w-12 place-items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              className="peer h-full w-full bg-gray-200 pr-2 text-base text-black outline-none"
              type="text"
              id="search"
              placeholder="Search"
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
            {sortedProjects
              .map((project: Project) => (
                <tr key={project.id} className="border-b bg-white">
                  <td className="whitespace-nowrap px-4 py-4 font-medium">
                    {projectId === project.id && recycleBin ? ( //TODO checking recyclebin flag
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="border-b focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <Link
                        href={{
                          pathname: "/projects/" + project.id,
                        }}
                      >
                        {project.name}
                      </Link>
                    )}
                  </td>
                  <td className="hidden px-6 py-4 md:table-cell">
                    {projectId === project.id && recycleBin ? (
                      <input
                        type="text"
                        value={projectDeletedAt}
                        onChange={(e) => setProjectDeletedAt (e.target.value)}
                        className="w-full border-b focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      project.deletedAt
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {projectId === project.id && recycleBin ? (
                      <button
                        onClick={() => handleSaveButtonClick(project.id)}
                        className={`mr-2 ${
                          isButtonDisabled ? "opacity-50" : ""
                        }`}
                        disabled={isButtonDisabled}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleEditButtonClick(
                            project.id,
                            project.name,
                            project.deletedAt,
                            project.recycleBin
                          )
                        }
                        className={`mr-2 w-3 ${
                          isButtonDisabled ? "opacity-50" : ""
                        }`}
                        disabled={isButtonDisabled}
                      >
                        <BiRename />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete_Project(project.id)}
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
      {showConfirmation && (
        <div className="popup-container">
          <div className="popup-window">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the project?</p>
            <div>
              <button className="popup-button" onClick={handleConfirm}>
                Yes
              </button>
              <button className="popup-button" onClick={handleCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
