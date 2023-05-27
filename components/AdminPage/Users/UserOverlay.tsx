import React, { useState } from "react";
import { ProjectsList } from "../Projects/ProjectsList";

interface Project {
  id: string;
  name: string;
  desc: string;
}

interface User {
  id: string;
  name: string;
  accessLevel: string;
  projectId: string;
  email: string;
  dateAdded: string;
}

interface UserOverlayProps {
  onClose: () => void;
  onAddUser: (user: User) => void;
}

const UserOverlay: React.FC<UserOverlayProps> = ({ onClose, onAddUser }) => {
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    accessLevel: "",
    projectId: "",
    email: "",
    dateAdded: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddUser = () => {
    const newUser: User = {
      ...formData,
      dateAdded: new Date().toLocaleDateString(),
    };

    onAddUser(newUser);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-8">
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
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-1"
          >
            <option value="">Select Project</option>
            {ProjectsList.map((project: Project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
            onClick={handleAddUser}
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
  );
};

export default UserOverlay;
