import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { BiRename } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import ProjectOverlay from "./ProjectOverlay";
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
interface Project {
  id: string;
  name: string;
  desc: string;
  description: string;
}

function Projects() {
  // Access Level controlled by the server-side or additional validation
  //const accessLevel: string = "suser";

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [userData, setUserData] = useState([]);
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [projectData, setProjectData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNewProjectDisabled, setIsNewProjectDisabled] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(userEmail);

  const { data, error, loading } = useQuery(GET_USER, {
    variables: {
      where: {
        emailId: userEmail,
      },
    },
  });

  const getProject = async (data: Array<Project>) => {
    // get_user_method(userEmail, GET_USER).then((res) => {
    //   if (loading) {
    //     return ""
    //   }
    //   // @ts-ignore
    //   const userType = res[0].userType === undefined ? "" : res[0].userType;
    //   setAccessLevel(userType);
    //   // @ts-ignore
    //   setProjectData(res[0].hasProjects);
    // });




    // @ts-ignore
    if (data && data.users.length) {
      // @ts-ignore
      const userType = data.users[0].userType
      setAccessLevel(userType)
      // @ts-ignore
      setProjectData(data.users[0].hasProjects)

    }

  }



  //verifying token
  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        if (loading) return "";
        getProject(data);
      }
    });
  };

  useEffect(() => {
    verfiyAuthToken();
    setIsButtonDisabled(accessLevel.toLowerCase() == "user");
    setIsNewProjectDisabled(accessLevel.toLowerCase() === "super user");
  }, [userEmail, getProject]);

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
    edit_Project(projectId, projectName, projectDesc, EDIT_PROJECT, GET_USER);
    // // const updatedProjectsList: Project[] = updateProjectName(
    // //   projectId,
    // //   projectName,
    // //   projects
    // );
    // edit_Project(projectId, projectName, projectDesc, EDIT_PROJECT);
    //console.log(result,"res");
    //setProjects(updatedProjectsList);
    setProjectId(null);
    setProjectName("");
  };

  const handleDelete_Project = (projectId: string) => {
    getProject(data);
    delete_Project(projectId, DELETE_PROJECT, GET_USER);
    setSuccessMessage("Project successfully deleted.");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleAddProjectClick = () => {
    setShowForm(true);
  };

  const handleAddProject = (name: string, desc: string) => {
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleMessage = (message: any) => {
    setMessage(message);
    setIsLoading(true);
    setTimeout(() => {
      setMessage("");
      setIsLoading(false);
    }, 5000);
  };
  if (loading || isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <LoadingIcon />
    </div>
  );

  if (error) {
    console.log(error.message);
  }

  return (
    <div>
      <div className="flex justify-center mt-4">
        {successMessage && (
          <div className="bg-green-200 text-green-800 py-2 px-4 rounded-md">
            {successMessage}
          </div>
        )}
      </div>
      <div className="ml-6 flex items-center">
        <button className="text-md ml-4 mt-4 h-10 rounded-lg bg-blue-200 px-5 font-semibold">
          Team Agile
        </button>
      </div>
      <div className="ml-10 mt-4 flex items-center">
        <h2 className="inline-block text-xl font-semibold">Projects</h2>
        <p className="ml-8 inline-block">Total</p>
        <div className="ml-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
          {projectData && projectData.length}
        </div>
        <button
          className={`text-md ml-auto mr-12 flex items-center rounded-md bg-blue-200 p-2 ${
            isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }${isNewProjectDisabled ? "opacity-50" : ""}`}
          disabled={isButtonDisabled || isNewProjectDisabled}
          onClick={handleAddProjectClick}
        >
          <GrAdd />
          <div className="mx-1 my-1">New Project</div>
        </button>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="ml-8 mt-4 w-11/12 rounded-lg text-left text-sm">
          <thead className="bg-gray-200 text-xs">
            <tr>
              <th scope="col" className="w-40 px-4 py-3 md:w-60">
                <div
                  className="flex cursor-pointer items-center"
                  //onClick={handleSortClick}
                >
                  Project name
                  <AiOutlineArrowDown
                    className={`ml-1 text-sm ${
                      sortOrder === "asc" ? "rotate-180 transform" : ""
                    }`}
                  />
                </div>
              </th>
              <th scope="col" className="hidden px-6 py-3 md:table-cell">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projectData.map((project: Project) => (
              <tr key={project.id} className="border-b bg-white">
                <td className="whitespace-nowrap px-4 py-4 font-medium">
                  {projectId === project.id ? (
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="border-b focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <Link href={"/flowchart/" + project.id}>
                      {project.name}
                    </Link>
                  )}
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  {projectId === project.id ? (
                    <input
                      type="text"
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      className="border-b focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    project.description
                  )}
                </td>
                <td className="px-6 py-4">
                  {projectId === project.id ? (
                    <button
                      onClick={() => handleSaveButtonClick(project.id)}
                      className={`mr-2 ${isButtonDisabled ? "opacity-50" : ""}`}
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
                          // @ts-ignore
                          project.description
                        )
                      }
                      className={`mr-2 ${isButtonDisabled ? "opacity-50" : ""}`}
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
      {showForm && (
        <ProjectOverlay
          onAddProject={handleAddProject}
          onClose={handleCloseForm}
          projectData={data}
          userEmail={userEmail}
          handleMessage={handleMessage}
        />
      )}
    </div>
  );
}

export default Projects;
