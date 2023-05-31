import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ProjectsList } from "../Projects/ProjectsList";

interface ManageAccountOverlayProps {
  user: {
    id: string;
    name: string;
    accessLevel: string;
    dateAdded: string;
  };
  onClose: () => void;
}

const animatedComponents = makeAnimated();

const ManageAccountOverlay: React.FC<ManageAccountOverlayProps> = ({
  user,
  onClose,
}) => {
  const [selectedProject, setSelectedProject] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const projectsList = ProjectsList.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const handleProjectChange = (selectedOption: any) => {
    setSelectedProject(selectedOption);
  };

  const handleSave = () => {
    // Perform save logic here with the selected project and user details
    console.log("Selected Project:", selectedProject);
    console.log("User:", user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-2/5 rounded-lg bg-white p-8">
        <h3 className="mb-4 text-xl font-semibold">Manage Account</h3>
        <div className="mb-4 flex flex-col">
          <p className="">{user.name}</p>
        </div>
        <div className="mb-4 flex items-center">
          <h2 className="mr-2 font-semibold">Access Level:</h2>
          <p className="">{user.accessLevel}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="projectSelect" className="font-semibold">
            Select Project:
          </label>
        </div>
        <div className="mb-4">
          <Select
            id="projectSelect"
            value={selectedProject}
            onChange={handleProjectChange}
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={projectsList}
            isMulti
          />
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
            onClick={handleSave}
            disabled={!selectedProject}
          >
            Save
          </button>
          <button
            className="mr-2 rounded-md bg-gray-300 px-4 py-2 text-sm text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAccountOverlay;
