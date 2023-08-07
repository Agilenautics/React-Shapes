import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const staticData = [
  {
    id : "1",
    type: "file",
    name: "New File",
    description: "This is one of the stories",
    status: "Completed",
    user : "User 1",
    parent : "Epic 1"
  },
  {
    id : "2",
    type: "BrightBlueNode",
    name: "New File 2",
    description: "This is two of the stories",
    status: "In-Progress",
    user : "User 2",
    parent : "Epic 2"
  },
  {
    id : "3",
    type: "GreenNode",
    name: "New Node 3",
    description: "This is three of the stories",
    status: "To-Do",
    user : "User 3",
    parent : "Epic 1"
  },
  {
    id : "4",
    type: "OrangeNode",
    name: "New Node 4",
    description: "This is four of the stories",
    status: "In-Progress",
    user : "User 4",
    parent : "Epic 1"
  },
  {
    id : "5",
    type: "RedNode",
    name: "New Node 5",
    description: "This is five of the stories",
    status: "To-Do",
    user : "User 5",
    parent : "Epic 2"
  },
];

const types = [
  { label: "Story", value: "file" },
  { label: "Task", value: "BrightBlueNode" },
  { label: "Sub-Task", value: "GreenNode" },
  { label: "Issue", value: "OrangeNode" },
  { label: "Bug", value: "RedNode" },
];

const statuses = [
  { label: "All", value: "" },
  { label: "Todo", value: "To-Do" },
  { label: "In-Progress", value: "In-Progress" },
  { label: "Completed", value: "Completed" },
];

const users = [
  { label: "All", value: "" },
  { label: "User 1", value: "User 1" },
  { label: "User 2", value: "User 2" },
  { label: "User 3", value: "User 3" },
  { label: "User 4", value: "User 4" },
  { label: "User 5", value: "User 5" },
  
];

function ProjectBacklogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();
  const projectId = router.query.projectId as string;

  useEffect(()=>{
    if (showAddForm) {
      router.push(`/addBacklogs/${projectId}`);
    }
  },[showAddForm, router])

  const filteredData = staticData.filter(
    (element) =>
      (element.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTypes.length === 0 || selectedTypes.includes(element.type)) &&
      (selectedStatus === "" || element.status === selectedStatus) &&
      (selectedUser === "" || element.user === selectedUser)
  );

  const getStatusColor = (status:string) => {
    switch (status) {
      case "Completed":
        return "bg-green-400";
      case "In-Progress":
        return "bg-blue-400";
      case "To-Do":
        return "bg-red-400";
      default:
        return "";
    }
  };

  return (
    <>    <div className="bg-white rounded-lg shadow-md mr-5">
      <div className="flex items-center justify-between m-1">
      <input
        type="text"
        placeholder="Search by name"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none m-1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex items-center space-x-4">
          <div className="relative inline-block text-left">
            <div>
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown((prevState) => !prevState)}
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Select Types
                  <svg
                    className="w-5 h-5 ml-2 -mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </span>
            </div>
            {showTypeDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                <div className="py-1">
                  {types.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center justify-between px-4 py-2 cursor-pointer"
                    >
                      <span>{type.label}</span>
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() =>
                          setSelectedTypes((prevTypes) =>
                            prevTypes.includes(type.value)
                              ? prevTypes.filter((t) => t !== type.value)
                              : [...prevTypes, type.value]
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        <label>Status :</label>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <label>User :</label>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <option key={user.value} value={user.value}>
                {user.label}
              </option>
            ))}
          </select>
      </div>
    </div>
    <div className="w-full">
        <table className="w-full table-auto mr-4">
        <thead>
          <tr>
            <th className="py-2 px-1 bg-gray-200 border">Type</th>
            <th className="py-2 px-1 bg-gray-200 border">Name</th>
            <th className="py-2 px-1 bg-gray-200 border">Description</th>
            <th className="py-2 px-1 bg-gray-200 border">Parent</th>
            <th className="py-2 px-1 bg-gray-200 border">Status</th>
            <th className="py-2 px-1 bg-gray-200 border">User</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((element) => (
            <tr key={element.id} className="border-b py-1">
              {/* @ts-ignore */}
              <td className= {`py-2 px-1 ${getTypeLabel(element.type).color} rounded-lg text-center text-white border`}>{getTypeLabel(element.type).type}</td>
              <td className="py-2 px-1 rounded-lg text-center border">{element.name}</td>
              <td className="py-2 px-1 rounded-lg text-center border">{element.description}</td>
              <td className="py-2 px-1 rounded-lg text-center border">{element.parent}</td>
              <td className={`py-2 px-1 ${getStatusColor(element.status)} rounded-lg text-center text-white border`}>{element.status}</td>
              <td className="py-2 px-1 rounded-lg text-center border">{element.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    <button
          className="px-4 py-2 bg-blue-700 text-white rounded-lg m-5 w-48 shadow-lg"
          onClick={() => setShowAddForm(true)}
        >
         Add backlog +
        </button>
    </>

  );
}

function getTypeLabel(type: string) {
  switch (type) {
    case "file":
      return {type:"Story", color: "bg-purple-400"};
    case "BrightBlueNode":
      return {type:"Task", color: "bg-blue-400"};
    case "GreenNode":
      return {type:"Sub-Task", color: "bg-green-400"};
    case "OrangeNode":
      return {type:"Issue", color: "bg-orange-400"};
    case "RedNode":
      return {type:"Bug", color: "bg-red-400"};
    default:
      return "";
  }
}

export default ProjectBacklogs;
