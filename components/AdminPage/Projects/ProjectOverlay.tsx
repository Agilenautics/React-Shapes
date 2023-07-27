import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ADD_PROJECT } from "./gqlProject";
import { Project } from "reactflow";
import LoadingIcon from "../../LoadingIcon";
import projectStore from "./projectStore";

interface AddProjectPopupProps {
  onAddProject: (name: string, desc: string) => void;
  onClose: () => void;
  projectData: Array<Project>;
  userEmail: String;
  handleMessage: (message: string) => void;
}

const AddProjectPopup: React.FC<AddProjectPopupProps> = ({
  onClose,
  handleMessage,
}) => {
  const [formData, setFormData] = useState({ name: "", desc: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  const [createProject, { data, error, loading }] = useMutation(ADD_PROJECT);
  const [errors, setError] = useState({});
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const addProject = projectStore((state) => state.addProject)
  const errorFromStore = projectStore((state)=>state.error);

  

  

  

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.floor(Math.random() * 26) + Date.now();
    const newProject = {
      ...formData,
      id,
      recycleBin: false,
      createdAt: new Date(),
      timeStamp: new Date(),
    }

    addProject(newProject)

    // onAddProject(formData.name, formData.desc);
    sendMessage("project created");
    // createProject({
    //   variables: {
    //     where: {
    //       emailId: userEmail,
    //     },
    //     update: {
    //       hasProjects: [
    //         {
    //           create: [
    //             {
    //               node: {
    //                 description: formData.desc,
    //                 name: formData.name,
    //                 isOpen: true,
    //                 recycleBin: false,
    //                 userName: "",
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   },
    //   // refetchQueries: [{ query: GET_PROJECTS }],
    // });
    setFormData({ name: "", desc: "" });
    if(errorFromStore!==""){
      console.log(errorFromStore,"inside condition")
      // onClose()
    }
    // onClose();
    console.log(errorFromStore,"inside condition")

    

  };

  const sendMessage = (message: string) => {
    handleMessage(message);
  };
  if (loading || isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <LoadingIcon />
    </div>
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    setSubmitButtonDisabled(false);
    setIsFormValid(formData.name.trim() !== "");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-8">
        <h2 className="mb-4 text-lg font-semibold">Add New Project</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="projectName" className="mb-2 block font-medium">
              Project Name <span className="text-xl text-red-500">*</span>
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
              disabled={!isFormValid}
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
