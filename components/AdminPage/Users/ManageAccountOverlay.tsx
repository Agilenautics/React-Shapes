import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  allocateProjectToUserMethod,
  ADD_PROJECT_TO_USER,
  deAllocateProjectToUserMethod,
  REMOVE_PROJECT_TO_USER,
} from "../../../gql";
import { User } from "../../../lib/appInterfaces";

interface ManageAccountOverlayProps {
  user: User;
  adminProjects: {
    id: string;
    name: string;
  }[];
  onClose: () => void;
}

const animatedComponents = makeAnimated();

const ManageAccountOverlay: React.FC<ManageAccountOverlayProps> = ({
  user,
  adminProjects,
  onClose,
}) => {
  const [selectedProjects, setSelectedProjects] = useState<
    Array<{
      value: string;
      label: string;
    } | null>
  >(
    user.hasProjects.map((projectId) => {
      const project = user.hasProjects.find((p) => p.id === projectId.id);
      return project ? { value: project.id, label: project.name } : null;
    })
  );

  const projectsList = adminProjects
    .filter(
      (project) =>
        !selectedProjects.find(
          (selectedProject) => selectedProject?.value === project.id
        )
    )
    .map((project) => ({
      value: project.id,
      label: project.name,
    }));

  const handleProjectChange = (selectedOptions: any) => {
    setSelectedProjects(selectedOptions);
  };

  const handleSave = () => {
    const currentProjects = selectedProjects
      .filter((project) => project !== null)
      .map((project) => project!.value);

    const deletedProjects = user.hasProjects
      .filter((project) => !currentProjects.includes(project.id))
      .map((project) => ({
        id: project.id,
        name: project.name,
      }));

    const addedProjects = currentProjects
      .filter(
        (projectId) =>
          !user.hasProjects.find((project) => project.id === projectId)
      )
      .map((projectId) => {
        const project = adminProjects.find(
          (project) => project.id === projectId
        );
        return project ? { id: project.id, name: project.name } : null;
      })
      .filter(Boolean);

    for (let i = 0; i < addedProjects.length; i++) {
      const id = addedProjects[i]?.id || "";
      allocateProjectToUserMethod(id, user.id, ADD_PROJECT_TO_USER);
    }

    for (let i = 0; i < deletedProjects.length; i++) {
      const id = deletedProjects[i].id;
      deAllocateProjectToUserMethod(id, user.id, REMOVE_PROJECT_TO_USER);
    }

    const editedUser = {
      ...user,
      hasProjects: currentProjects,
    };

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-2/5 rounded-lg bg-white p-8">
        <h3 className="mb-4 text-xl font-semibold">Manage Account</h3>
        <div className="mb-4 flex flex-col">
          <p className="">{user.emailId}</p>
        </div>
        <div className="mb-4 flex items-center">
          <h2 className="mr-2 font-semibold">Access Level:</h2>
          <p className="">{user.userType}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="projectSelect" className="font-semibold">
            Select Project:
          </label>
        </div>
        <div className="mb-4">
          <Select
            id="projectSelect"
            value={selectedProjects}
            onChange={handleProjectChange}
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={projectsList}
            isMulti
            getOptionValue={(option) => option?.value || ""}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
            onClick={handleSave}
            disabled={!selectedProjects}
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
