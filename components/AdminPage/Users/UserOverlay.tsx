import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { usersList } from "./UsersList";

interface Project {
  id: string;
  name: string;
  desc: string;
}

interface User {
  id: string;
  name: string;
  accessLevel: string;
  projects: string[];
  email: string;
  dateAdded: string;
}

interface UserOverlayProps {
  onClose: () => void;
  onAddUser: (user: User, selectedProjects: string[]) => void;
  projectData: Array<Project>;
}

const UserOverlay: React.FC<UserOverlayProps> = ({
  onClose,
  onAddUser,
  projectData,
}) => {
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    accessLevel: "",
    projects: [],
    email: "",
    dateAdded: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "email") {
      // Check if the entered email is valid and not already in the users list
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isExistingEmail = usersList.some((user) => user.name === value);
      setIsEmailValid(isValid && !isExistingEmail);
    }
  };

  const handleProjectSelect = (selectedOptions: any) => {
    const selectedProjects = selectedOptions.map((option: any) => option.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      projects: selectedProjects, // Set the selected projects in the formData state
    }));
  };

  const handleAddUser = () => {
    const newUser: User = {
      ...formData,
      id: String(usersList.length + 1),
      dateAdded: new Date().toLocaleDateString(),
    };
    console.log(formData);
    onAddUser(newUser, formData.projects);
    onClose();
  };

  const animatedComponents = makeAnimated();
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-6/12 rounded-lg bg-white p-8">
        <h2 className="mb-4 text-lg font-semibold">Add User</h2>
        <div className="mb-4">
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-1"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Access Level</label>
          <select
            name="accessLevel"
            value={formData.accessLevel}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-1"
          >
            <option value="">Select Access Level</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Super User">Super User</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Project</label>
          <Select
            name="projectId"
            value={projectData
              .filter((project) => formData.projects.includes(project.id))
              .map((project) => ({ value: project.id, label: project.name }))}
            onChange={handleProjectSelect}
            classNamePrefix="react-select"
            isMulti
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={projectData.map((project: Project) => ({
              value: project.id,
              label: project.name,
            }))}
          />
        </div>

        <div className="mb-4 flex justify-between">
          {" "}
          <div className="flex items-center">
            <input type="checkbox" className="p-4" />
            <label className="ml-2">Invite User via email</label>
          </div>
          <div className="flex">
            <button
              className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
              onClick={handleAddUser}
              disabled={!isEmailValid}
            >
              Add User
            </button>
            <button
              className="rounded-md bg-gray-300 px-4 py-2 text-sm text-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverlay;
