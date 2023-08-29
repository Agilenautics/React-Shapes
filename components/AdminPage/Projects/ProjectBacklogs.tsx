import React, { useState } from "react";
import { useRouter } from "next/router";
import fileStore from "../../TreeView/fileStore";
import useBackend from "../../TreeView/backend";
import { types } from "./staticData/types";
import { statuses } from "./staticData/statuses";
import { users } from "./staticData/users";
import initData from "./staticData/initData";
import { getTypeLabel, getStatusColor } from "./staticData/basicFunctions";
import AddBacklogs from "./AddBacklogs";

let items: {
  label: string;
  parent: string | undefined;
  type: string | "file";
  description: string | undefined;
  status: string | undefined;
  sprint: string | undefined;
  user: string | undefined;
}[] = [];

for (let i of initData) {
  if (i.type === "folder") {
    if (i.hasFiles) {
      for (let j of i.hasFiles) {
        items.push({
          label: j.name,
          parent: i.name,
          description: j.description,
          type: "file",
          status: j.status,
          sprint: j.sprint,
          user: j.user,
        });

        if (j.node && j.node.length > 0) {
          for (let node of j.node) {
            items.push({
              label: node.label,
              parent: j.name,
              description: node.description,
              type: node.type,
              status: node.status,
              sprint: j.sprint,
              user: j.user,
            });
          }
        }
      }
    }
  } else if (i.type === "file") {
    items.push({
      label: i.name,
      parent: "no parent",
      description: i.description,
      type: "file",
      status: i.status,

      sprint: i.sprint,
      user: i.user,
    });

    if (i.node && i.node.length > 0) {
      for (let node of i.node) {
        items.push({
          label: node.label,
          parent: i.name,
          description: node.description,
          type: node.type,
          status: node.status,

          sprint: i.sprint,
          user: i.user,
        });
      }
    }
  }
}

function ProjectBacklogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const loading = fileStore((state) => state.loading);
  const backend = useBackend();

  const filteredData = items.filter(
    (element) =>
      element.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTypes.length === 0 || selectedTypes.includes(element.type)) &&
      (selectedStatus === "" || element.status === selectedStatus) &&
      (selectedUser === "" || element.user === selectedUser) &&
      (selectedSprint === "" || element.sprint === selectedSprint)
  );

  return (
    <div className="absolute ml-3 w-fit">
      <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg">
        Backlogs
      </h1>
      <div className="m-1 mr-5 overflow-x-auto rounded-lg bg-white shadow-md">
        <div className="m-1 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by name"
            className="m-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <div className="relative inline-block text-left">
              <div>
                <span className="rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setShowTypeDropdown((prevState) => !prevState)
                    }
                    className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Select Types
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
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
                <div className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {types.map((type) => (
                      <label
                        key={type.value}
                        className="flex cursor-pointer items-center justify-between px-4 py-2"
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
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
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
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
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
        <div className="w-fill overflow-y h-60 overflow-x-hidden">
          <table className="mr-4 w-[1000px] table-auto">
            <thead>
              <tr>
                <th className="border bg-gray-200 px-1 py-2">Type</th>
                <th className="border bg-gray-200 px-1 py-2">Name</th>
                <th className="border bg-gray-200 px-1 py-2">Description</th>
                <th className="border bg-gray-200 px-1 py-2">Parent</th>
                <th className="border bg-gray-200 px-1 py-2">Status</th>
                <th className="border bg-gray-200 px-1 py-2">Sprint</th>
                <th className="border bg-gray-200 px-1 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((element, index) => (
                <tr key={index} className="border-b py-1">
                  {/* @ts-ignore */}
                  <td
                    className={`px-1 py-2 ${
                      // @ts-ignore
                      getTypeLabel(element.type).color
                    } text-grey rounded-lg border text-center`}
                  >
                    {/* @ts-ignore */}
                    {getTypeLabel(element.type).type}
                  </td>
                  <td className="rounded-lg border px-1 py-2 text-center">
                    {element.label}
                  </td>
                  <td className="description-cell w-[400px] break-all rounded-lg border px-1 py-2 text-center">
                    {element.description}
                  </td>
                  <td className="rounded-lg border px-1 py-2 text-center">
                    {element.parent}
                  </td>
                  <td
                    className={`px-1 py-2 ${getStatusColor(
                      // @ts-ignore
                      element.status
                    )} text-grey rounded-lg border text-center`}
                  >
                    {element.status}
                  </td>
                  <td className="rounded-lg border px-1 py-2 text-center">
                    {element.sprint ? element.sprint : "not added"}
                  </td>
                  <td className="rounded-lg border px-1 py-2 text-center">
                    {element.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className="m-5 w-48 rounded-lg bg-blue-700 px-4 py-2 text-white shadow-lg"
        onClick={() => setShowForm(!showForm)}
      >
        Add backlog +
      </button>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <AddBacklogs
              types={types}
              users={users}
              statuses={statuses}
              setShowForm={setShowForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectBacklogs;
