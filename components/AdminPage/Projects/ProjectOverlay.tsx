import React, { useState } from "react";

interface AddProjectPopupProps {
  onAddProject: (name: string, desc: string) => void;
  onClose: () => void;
}

const AddProjectPopup: React.FC<AddProjectPopupProps> = ({
  onAddProject,
  onClose,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject(projectName, projectDesc);
    setProjectName("");
    setProjectDesc("");
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="projectName" className="block font-medium mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="projectDesc" className="block font-medium mb-2">
              Project Description
            </label>
            <textarea
              id="projectDesc"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-gray-200 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
