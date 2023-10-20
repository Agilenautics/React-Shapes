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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNewProjectDisabled, setIsNewProjectDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const { data, error, loading: userLoading } = useQuery(GET_USER, {
    variables: {
      where: {
        emailId: "irfan123@gmail.com"
      }
    }
  });





  const recycleBin = projectStore((state) => state.recycleBin);
  const [projectData, setProjectData] = useState(recycleBin)
  const loading = projectStore((state) => state.loading)
  const handleSorting = projectStore((state) => state.handleSorting);
  const sortOrder = projectStore((state) => state.sortOrder);
  const updateSorOrder = projectStore((state) => state.updateSortOrder);
  const clearRecycle_Bin = projectStore((state) => state.clearRecyleBin);
  const removeFromRecycleBin = projectStore((state) => state.removeFromRecycleBin);
  const { updateSearchItem, search, updateRecycleBinProject } = projectStore()

  const userType = userStore((state) => state.userType);



  useEffect(() => {
    const filteredData = recycleBin.filter(
      (element: any) =>
        (element.name && element.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setProjectData(filteredData)

  }, [searchTerm])

  useEffect(() => {
    setIsButtonDisabled(userType.toLowerCase() === "user");
    setIsNewProjectDisabled(userType.toLowerCase() === "super user");
  }, [recycleBin]);

  const handleSortClick = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    updateSorOrder(newSortOrder);
    handleSorting()
  };



  const handleDelete_Project = async (projectId: string) => {
    await parmenantDelete(projectId, PARMENANT_DELETE, GET_USER);
    removeFromRecycleBin(projectId)
  };

  console.log(data,"hello")

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
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
            {projectData.map((project: any) => (
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
    </div>
  );
}

export default Projects;
