import React, { useState } from "react";
import { usersList } from "./UsersList";

interface User {
  id: string;
  name: string;
  accessLevel: string;
  dateAdded: string;
}

interface UserOverlayProps {
  onClose: () => void;
  onAddUser: (user: User) => void;
}

const UserOverlay: React.FC<UserOverlayProps> = ({ onClose, onAddUser }) => {
  const [name, setName] = useState("");
  const [accessLevel, setAccessLevel] = useState("User");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAccessLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccessLevel(e.target.value);
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: String(usersList.length + 1),
      name,
      accessLevel,
      dateAdded: new Date().toLocaleDateString(),
    };

    onAddUser(newUser);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg font-semibold mb-4">Add User</h2>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="border border-gray-300 rounded-md p-1 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Access Level</label>
          <select
            value={accessLevel}
            onChange={handleAccessLevelChange}
            className="border border-gray-300 rounded-md p-1 w-full"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Super User">Super User</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
            onClick={handleAddUser}
          >
            Add User
          </button>
          <button
            className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md"
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
