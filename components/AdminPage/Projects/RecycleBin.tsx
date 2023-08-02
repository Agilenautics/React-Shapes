import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaTrashRestoreAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import { CLEAR_RECYCLE_BIN, DELETE_PROJECT, GET_USER, PARMENANT_DELETE, clearRecycleBin, delete_Project, parmenantDelete, recycleProject } from "./gqlProject";
import { useQuery } from "@apollo/client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../auth";
import LoadingIcon from "../../LoadingIcon";
import { User } from "../Users/Users";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";

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
  const [projectDeletedAt, setProjectDeletedAt] = useState(""); //TODO defined new state ProjectDeletedAt
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNewProjectDisabled, setIsNewProjectDisabled] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");



  const recycleBin = projectStore((state) => state.recycleBin);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject);
  const handleSorting = projectStore((state) => state.handleSorting);
  const sortOrder = projectStore((state) => state.sortOrder);
  const updateSorOrder = projectStore((state) => state.updateSortOrder);
  const clearRecycle_Bin = projectStore((state) => state.clearRecyleBin);
  const removeFromRecycleBin = projectStore((state)=>state.removeFromRecycleBin)

  const userType = userStore((state) => state.userType);
  const updateUserType = userStore((state) => state.updateUserType)









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
      updateUserType(userType)
      //@ts-ignore
      setProjectData(data.users[0].hasProjects);//not required
      //@ts-ignore
      updateRecycleBinProject(data.users[0].hasProjects)
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
    const filteredProjects = projectData.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        project.recycleBin
    );
    // @ts-ignore
    updateRecycleBinProject(filteredProjects)
  }, [searchTerm]);

  useEffect(() => {
    verifyAuthToken();
    setIsButtonDisabled(userType.toLowerCase() === "user");
    setIsNewProjectDisabled(userType.toLowerCase() === "super user");
  }, [data]);

  const handleSortClick = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    updateSorOrder(newSortOrder);
    handleSorting()

  };

  //TODO =============================================
  // Restoration logic
  //TODO =================================================================

  const handleDelete_Project = (projectId: string) => {
    // Display confirmation box
    // setShowConfirmation(true);
    // setProjectId(projectId);
    removeFromRecycleBin(projectId)
    parmenantDelete(projectId, PARMENANT_DELETE, GET_USER)
  };

  // const handleConfirm = useCallback(() => {
  //   // Delete the project if confirmed
  //   setShowConfirmation(false);
  //   if (projectId ) {
  //     delete_Project(projectId, DELETE_PROJECT, GET_USER);
  //     setProjectId(null);
  //   }
  // }, [projectId]);

  // const handleCancel = useCallback(() => {
  //   // Cancel the delete operation
  //   setShowConfirmation(false);
  //   setProjectId(null);
  // }, []);

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
          {recycleBin && recycleBin.length}
        </div>
        <button
          onClick={() => {
            clearRecycleBin(CLEAR_RECYCLE_BIN, GET_USER)
            clearRecycle_Bin()
            
          }}

          className={`text-md ml-auto mr-12 flex items-center rounded-md bg-blue-200 p-2 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
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
            {/* <div className="grid h-full w-12 place-items-center text-gray-600">
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
            </div> */}

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
                    className={`ml-1 text-sm ${sortOrder === "asc" ? "rotate-180 transform" : ""
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
            {recycleBin.map((project: any) => (
              <tr key={project.id} className="border-b bg-white">
                <td className="whitespace-nowrap px-4 py-4 font-medium">
                  {/* //TODO added recycleBin */}
                  <label className="fontWeight-bold">{project.name}</label>
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  {project.deletedAT}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      recycleProject(project.id, DELETE_PROJECT, GET_USER);
                      removeFromRecycleBin(project.id);
                    }}
                    //  TODO onClick restore logic here
                    className={`mr-2 w-3 ${isButtonDisabled ? "opacity-50" : ""
                      }`}
                    disabled={isButtonDisabled}
                  >
                    <FaTrashRestoreAlt />
                  </button>
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
      {/* {showConfirmation && (
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
      )} */}
    </div>
  );
}

export default Projects;
