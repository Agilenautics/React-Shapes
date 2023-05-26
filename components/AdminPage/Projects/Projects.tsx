import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";
import { BiRename } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import { updateProjectName, deleteProject } from "./ProjectUtils";
import ProjectOverlay from "./ProjectOverlay";
import { ProjectsList } from "./ProjectsList";

interface Project {
  id: string;
  name: string;
  desc: string;
}

function Projects() {
  const accessLevel: string = "suser";
  const isButtonDisabled: boolean = accessLevel === "user";

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>(ProjectsList);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleEditButtonClick = (projectId: string, projectName: string) => {
    setProjectId(projectId);
    setProjectName(projectName);
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

  const handleDeleteButtonClick = (projectId: string) => {
    const updatedProjectsList: Project[] = deleteProject(projectId, projects);

    setProjects(updatedProjectsList);
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

  return (
    <div>
      <div className="ml-6 flex items-center">
        <button className="text-md mt-4 ml-4 h-10 rounded-lg bg-blue-200 px-5 font-semibold">
          Team Agile
        </button>
      </div>
      <div className="ml-10 mt-4 flex items-center">
        <h2 className="inline-block text-xl font-semibold">Projects</h2>
        <p className="ml-8 inline-block">Total</p>
        <div className="ml-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
          {projects.length}
        </div>
        <button
          className={`text-md  ml-auto mr-12 flex items-center rounded-md bg-blue-200 p-2 ${
            isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isButtonDisabled}
          onClick={handleAddProjectClick}
        >
          <GrAdd />
          <div className="mx-x my-1 ">New Project</div>
        </button>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="ml-8 mt-4 rounded-lg text-left text-sm">
          <thead className="bg-gray-200 text-xs">
            <tr>
              <th scope="col" className="w-16 px-2 py-3">
                <input type="checkbox" className="m-2" />
              </th>
              <th scope="col" className="w-60 px-2 py-3">
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
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project: Project) => (
              <tr key={project.id} className="border-b bg-white">
                <td className="px-2 py-4">
                  <input type="checkbox" className="m-2" />
                </td>
                <td className="whitespace-nowrap px-2 py-4 font-medium">
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
                <td className="px-6 py-4">{project.desc}</td>
                <td className="px-6 py-4">
                  {projectId === project.id ? (
                    <button
                      onClick={() => handleSaveButtonClick(project.id)}
                      className="mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleEditButtonClick(project.id, project.name)
                      }
                      className="mr-2"
                    >
                      <BiRename />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteButtonClick(project.id)}
                    className="ml-2"
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
        />
      )}
    </div>
  );
}

export default Projects;
