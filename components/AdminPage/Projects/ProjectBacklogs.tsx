import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import fileStore from "../../TreeView/fileStore";
// import useBackend from "../../TreeView/backend";
import { types } from "./staticData/types";
import { statuses } from "./staticData/statuses";
// import { users } from "./staticData/users";
// import initData from "./staticData/initData";
import { getTypeLabel, getStatusColor } from "./staticData/basicFunctions";
import AddBacklogs from "./AddBacklogs";
import { processedData, parents } from "./staticData/processedData";
import nodeStore from "../../Flow/Nodes/nodeStore";
import { auth } from "../../../auth";
import { onAuthStateChanged } from "firebase/auth";
import { GET_USER, getUserByEmail } from "./gqlProject";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";



function ProjectBacklogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedEpic, setSelectedEpic] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  // const [items, setItems] = useState()
  // const [users,setUsers] = useState();
  const router = useRouter();
  
  const projectId = router.query.projectId as string;
  const loading = fileStore((state) => state.loading);
  const backend = fileStore(state => state.data);
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject)
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser)


  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        getUserByEmail(user.email, GET_USER, { updateLoginUser, updateProjects, updateUserType, updateRecycleBinProject })
      }
    })
  }
  useEffect(() => {
    verificationToken()
  }, [])





  
  
  const items = processedData(backend.children);

  // console.log(items);

  console.log(backend.userHas)
  
  

  const users =[{emailId:"Select User", value:""}, ...backend.userHas] 
  
  
  const filteredData = items.filter(
    (element:any) =>
      (element.label && element.label.toLowerCase().includes(searchQuery.toLowerCase())||element.name && element.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTypes.length === 0 || selectedTypes.includes(element.type)) &&
      (selectedEpic === "" || element.parent=== selectedEpic) &&
      (selectedStatus === "" || element.status === selectedStatus) &&
      // (selectedUser === "" || element.user === selectedUser) &&
      (selectedSprint === "" || element.sprint === selectedSprint)
  );

  const openFormWithFilledData = (element: any) => {
    setSelectedElement(element);
    setShowForm(true);
  };


  if (Object.keys(backend).length == 0) {
    return <>
      Loading
    </>
  }


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
            <select
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
              value={selectedEpic}
              onChange={(e) => setSelectedEpic(e.target.value)}
            >
              {parents.map((epic) => (
                <option key={epic.id} value={epic.name=="Select Epic"?"":epic.name}>
                  {epic.name}
                </option>
              ))}
            </select>
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
            <select
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user: any) => (
                <option key={user.value || user.emailId} value={user.emailId}>
                  {user.emailId}
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
                <th className="border bg-gray-200 px-1 py-2">Epic</th>
                <th className="border bg-gray-200 px-1 py-2">Status</th>
                <th className="border bg-gray-200 px-1 py-2">Sprint</th>
                <th className="border bg-gray-200 px-1 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((element: any, index: any) => (
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
                  <td className="rounded-lg border px-1 py-2 text-center cursor-pointer" onClick={() => openFormWithFilledData(element)}>
                    {element.label || element.name}
                  </td>
                  <td className="description-cell w-[400px] break-all rounded-lg border px-1 py-2 text-center">
                    {element.description}
                  </td>
                  <td className="rounded-lg border px-1 py-2 text-center">
                    {/* here epic */}
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
          <div className="rounded-lg bg-white shadow-lg h-[70vh] w-[50vw] overflow-y-scroll overflow-x-hidden" >
            <AddBacklogs
              types={types}
              users={users}
              statuses={statuses}
              setShowForm={setShowForm}
              selectedElement={selectedElement}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectBacklogs;
