import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { BiRename } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import { updateProjectName, deleteProject } from "./ProjectUtils";
import ProjectOverlay from "./ProjectOverlay";
import { ProjectsList } from "./ProjectsList";
import {
  DELETE_PROJECT,
  GET_PROJECTS,
  GET_USER,
  delete_Project,
  get_user_method,
} from "./gqlProject";
import { useQuery } from "@apollo/client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../auth";
interface Project {
  id: string;
  name: string;
  desc: string;
}

function Projects() {
  // Access Level controlled by the server-side or additional validation
  //const accessLevel: string = "suser";

  const { data, error, loading } = useQuery(GET_PROJECTS);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>(ProjectsList);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  //verifying token
  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // @ts-ignore
        get_user_method(user.email, GET_USER).then((res) => {
          // @ts-ignore
          setUserData(res);
          // @ts-ignore
          setProjectData(res[0].hasProjects);
        });
      }
    });
  };

  useEffect(() => {
    verfiyAuthToken();
  }, []);

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
    const updatedProjectsList: Project[] = updateProjectName(
      projectId,
      projectName,
      projects
    );

    setProjects(updatedProjectsList);
    setProjectId(null);
    setProjectName("");
  };

  const handleDelete_Project = (projectId: string) => {
    delete_Project(projectId, DELETE_PROJECT);
  };

  const handleAddProjectClick = () => {
    setShowForm(true);
  };

  const handleAddProject = (name: string, desc: string) => {
    const newProjectId = String(projects.length + 1);
    const newProject = {
      id: newProjectId,
      name: name,
      desc: desc,
    };
    const updatedProjectsList = [...projects, newProject];
    setProjects(updatedProjectsList);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    const sortedProjects = [...projects].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setProjects(sortedProjects);
  };

  if (loading) {
    return <div>....Loading</div>;
  }

  if (error) {
    console.log(error.message);
  }

  // @ts-ignore
  const isButtonDisabled: boolean = accessLevel === userData.userType;

  return (
    <div>
      <div className="ml-6 flex items-center">
        <button className="text-md ml-4 mt-4 h-10 rounded-lg bg-blue-200 px-5 font-semibold">
          Team Agile
        </button>
      </div>
      <div className="ml-10 mt-4 flex items-center">
        <h2 className="inline-block text-xl font-semibold">Projects</h2>
        <p className="ml-8 inline-block">Total</p>
        <div className="ml-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
          {data.projects.length}
        </div>
        <button
          className={`text-md ml-auto mr-12 flex items-center rounded-md bg-blue-200 p-2 ${
            isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isButtonDisabled}
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
                  onClick={handleSortClick}
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
                    project.name
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
                    // @ts-ignore
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
                          project.desc
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
        />
      )}
    </div>
  );
}

export default Projects;
