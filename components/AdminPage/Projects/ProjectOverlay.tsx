import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_PROJECT, GET_PROJECTS } from "./gqlProject";
import { Project } from "react-flow-renderer";

interface AddProjectPopupProps {
  onAddProject: (name: string, desc: string) => void;
  onClose: () => void;
  projectData:Array<Project>
}

const AddProjectPopup: React.FC<AddProjectPopupProps> = ({
  onAddProject,
  onClose,
  projectData
}) => {
  const [formData, setFormData] = useState({ name: "", desc: "" });

  

  const [createProject, { data, loading }] = useMutation(ADD_PROJECT);
  const [error,setError] = useState({})
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    let formErrors = {};




    const projectData = {
      description: formData.desc,
      name: formData.name,
      isOpen: true,
      userName: ""
    }
    // onAddProject(formData.name, formData.desc);
    createProject({
      variables: {
        newProject: projectData
      },
      refetchQueries: [{ query: GET_PROJECTS }]
    })

    setFormData({ name: "", desc: "" });
    onClose();
  };

  if (loading) {
    return <p>Loading...</p>
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
    const project = checkEmailExist(projectData)
    console.log(project)
    setSubmitButtonDisabled(false);
  };

  const checkEmailExist = ({projects}:any) =>{
    console.log(formData.name)
    
    // @ts-ignore
    console.log(projects.filter((value:Object)=>value.name===formData.name))
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-8">
        <h2 className="mb-4 text-lg font-semibold">Add New Project</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="projectName" className="mb-2 block font-medium">
              Project Name <span className="text-red-500 text-xl">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
           
            {/* {error && <div> {error.message} </div>} */}
          
            {error.name && <span>{error.name}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="projectDesc" className="mb-2 block font-medium">
              Project Description
            </label>
            <textarea
              id="projectDesc"
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-3 py-2"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 rounded-lg bg-gray-200 px-4 py-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white"
              disabled = {submitButtonDisabled}
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
