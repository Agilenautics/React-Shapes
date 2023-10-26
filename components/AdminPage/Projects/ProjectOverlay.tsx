import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {  GET_USER, addProject_Backend } from "../../../gql";

import { Project } from "reactflow";
import LoadingIcon from "../../LoadingIcon";
import projectStore from "./projectStore";
import { ADD_PROJECT } from "../../../gql";

interface AddProjectPopupProps {
  onAddProject: (name: string, desc: string) => void;
  onClose: () => void;
  notify: () => void;
  projectData: Array<Project>;
  userEmail: String;
  handleMessage: (message: string) => void;
}

const AddProjectPopup: React.FC<AddProjectPopupProps> = ({
  onClose,
  notify,
  userEmail,
  projectData,
}) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const [createProject, { data, error, loading }] = useMutation(ADD_PROJECT);
  const [errors, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addProject = projectStore((state) => state.addProject);

  // successfull message

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const existanceProject = projectData.find(
      (project) => project.name === formData.name
    );
    if (existanceProject) {
      setError("This Project already exists");
    } else {
      addProject_Backend(userEmail, formData, ADD_PROJECT, addProject,GET_USER).then((response) => {
        // addProject(newProject)
        notify()
        onClose();
        setError(null);
      }).catch((err) => console.log(err))
        // .finally((result) => {
        //   // window.location.reload();
        // })
      setFormData({ name: "", description: "" });
    }
  };

  
  if (loading || isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[45%] rounded bg-white p-8 dark:bg-bgdarkcolor dark:text-white">
        <h2 className="mb-4 text-lg font-semibold">Add New Project</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="">
            <label htmlFor="projectName" className="mb-2 block font-medium">
              Project Name <span className="text-xl text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-3 py-2 dark:text-bgdarkcolor"
              autoComplete="off"
              required
            />
          </div>
          <div className="p-2 text-red-500">
            {" "}
            {errors && <span> {errors} </span>}{" "}
          </div>
          <div className="mb-4">
            <label htmlFor="projectDesc" className="mb-2 block font-medium">
              Project Description
            </label>
            <textarea
              id="projectDesc"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              autoComplete="off"
              className="w-full rounded-lg border px-3 py-2 dark:text-bgdarkcolor"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 rounded-lg bg-gray-200 px-4 py-2 dark:bg-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white"
              disabled={formData.name === ""}
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPopup;
