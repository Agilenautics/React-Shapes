import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fileStore from "../TreeView/fileStore";
import { types } from "../AdminPage/Projects/staticData/types";
import {
  getTypeLabel,
  getStatusColor,
} from "../AdminPage/Projects/staticData/basicFunctions";
import { auth } from "../../auth";
import { onAuthStateChanged } from "firebase/auth";
import { getUserByEmail, GET_USER } from "../../gql";
import projectStore from "../AdminPage/Projects/projectStore";
import userStore from "../AdminPage/Users/userStore";
import backlogStore from "./backlogStore";
import generateUid from "../getUid";
import LoadingIcon from "../LoadingIcon";
import { RiArrowDropDownLine } from "react-icons/ri";

function ProjectBacklogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedEpic, setSelectedEpic] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  // const [showForm, setShowForm] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const allStatus = backlogStore((state) => state.allStatus);
  const [statuses, setStatuses] = useState(["Select Status", ...allStatus]);
  const parents = backlogStore((state) => state.parents);

  const uid = generateUid([1, 9]);

  const router = useRouter();

  const projectId = router.query.projectId as string;
  const loading = fileStore((state) => state.loading);
  const backend = fileStore((state) => state.data);
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore(
    (state) => state.updateRecycleBinProject
  );
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser);
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  // const [typeDropdown, setTypeDropdown] = useState(false)

  // backlogs store
  const { backlogs, updateBacklogsData } = backlogStore();

  const verificationToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        getUserByEmail(user.email, GET_USER, {
          updateLoginUser,
          updateProjects,
          updateUserType,
          updateRecycleBinProject,
        });
      }
    });
  };
  useEffect(() => {
    setItems(backlogs);
  }, [backlogs]);

  useEffect(() => {
    verificationToken();
    //  callBack()
  }, []);

  useEffect(() => {
    if (backend.userHas && backend.userHas.length) {
      setUsers([{ emailId: "Select User", value: "" }, ...backend.userHas]);
    }
    if (backlogs.length == 0) {
      // @ts-ignore
      updateBacklogsData(backend.children);
    }
    // @ts-ignore
  }, [backend.userHas]);

  useEffect(() => {
    setStatuses(["Select Status", ...allStatus]);
  }, [allStatus]);

  const handleAddBacklogsClick = () => {
    router.push({
      pathname: `/projects/${projectId}/backlogs/add/`,
    });
  };

  const filteredData = items.filter(
    (element: any) =>
      ((element.label &&
        element.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (element.name &&
          element.name.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (selectedTypes.length === 0 || selectedTypes.includes(element.type)) &&
      (selectedEpic === "" || element.parent.name === selectedEpic) &&
      (selectedStatus === "" || element.status === selectedStatus) &&
      (selectedUser === "" || element.assignedTo === selectedUser) &&
      (selectedSprint === "" || element.sprint === selectedSprint)
  );

  const openFormWithFilledData = (element: any) => {
    setSelectedElement(element);
    router.push({
      pathname: `/projects/${projectId}/backlogs/edit/`,
      query: { id: element.id },
    });
  };

  const getSprintName: any = (id: string) => {
    if (id == "" || id == null) return "-";
  };

  return loading ? (
    <div className="flex h-screen items-center justify-center">
      <LoadingIcon />
    </div>
  ) : (
    <div className="ml-3 mt-3">
      <h1 className="mb-4 rounded-lg bg-gray-200 p-2 text-2xl font-bold shadow-lg dark:bg-slate-600 dark:text-white">
        Backlogs
      </h1>
      <div className="m-1 mr-5 rounded-lg bg-white shadow-md dark:bg-white dark:text-slate-600 ">
        <div className="m-1 flex items-center justify-between bg-gray-100 dark:bg-white dark:text-slate-600 ">
          <input
            type="text"
            placeholder="Search by name"
            className="m-1 rounded-lg bg-white px-4 py-2 font-medium focus:outline-none dark:bg-slate-600 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="inline-flex w-fit justify-center rounded-lg bg-gray-100 px-4 py-2 text-[1rem] text-gray-700 hover:bg-gray-200 dark:bg-slate-600 dark:text-white"
            onClick={handleAddBacklogsClick}
          >
            New item +
          </button>

          <div className="relative inline-block text-left">
            <div className="rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-600 dark:text-white">
              <span className="shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown((prevState) => !prevState)}
                  className="relative flex bg-gray-100 text-gray-700  hover:bg-gray-200"
                >
                  <span className="block w-full py-2 pl-3 pr-10 text-left text-base">
                    Select Types
                  </span>
                  <span className="mt-2">
                    <RiArrowDropDownLine className="h-7 w-7" />
                  </span>
                </button>
              </span>
            </div>
            {showTypeDropdown && (
              <div className="absolute right-0 mt-1 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 hover:bg-gray-200 dark:bg-slate-600 dark:text-white">
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
            className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 focus:outline-none dark:bg-slate-600 dark:text-white"
            value={selectedEpic}
            onChange={(e) => setSelectedEpic(e.target.value)}
          >
            {parents.map((epic: any) => (
              <option
                key={epic.id}
                value={epic.name == "Select Epic" ? "" : epic.name}
              >
                {epic.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 focus:outline-none dark:bg-slate-600 dark:text-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map((status: any) => (
              <option
                key={status}
                value={status == "Select Status" ? "" : status}
              >
                {status}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 focus:outline-none dark:bg-slate-600 dark:text-white"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user: any) => (
              <option
                key={user.emailId}
                value={user.emailId == "Select User" ? "" : user.emailId}
              >
                {user.emailId}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-y max-h-screen overflow-x-hidden">
          <table className="mr-4 w-full table-auto">
            <thead>
              <tr>
                <th className="bg-gray-200 px-1 py-2">Id</th>
                <th className="bg-gray-200 px-1 py-2">Type</th>
                <th className="bg-gray-200 px-1 py-2">Name</th>
                <th className="bg-gray-200 px-1 py-2">Description</th>
                <th className="bg-gray-200 px-1 py-2">Epic</th>
                <th className="bg-gray-200 px-1 py-2">Status</th>
                <th className="bg-gray-200 px-1 py-2">Sprint</th>
                <th className="bg-gray-200 px-1 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((element: any, index: any) => (
                <tr key={index} className="py-1">
                  {/* @ts-ignore */}
                  <td className="cursor-pointer px-1 py-2 text-center">
                    {element.uid}
                  </td>
                  <td
                    className={`px-1 py-2 ${
                      // @ts-ignore
                      getTypeLabel(element.type).color
                    } text-grey rounded-lg text-center`}
                  >
                    {/* @ts-ignore */}
                    {getTypeLabel(element.type).type}
                  </td>
                  <td
                    className="cursor-pointer px-1 py-2 text-center hover:text-blue-500 hover:underline"
                    onClick={() => openFormWithFilledData(element)}
                  >
                    {element.label || element.name}
                  </td>
                  <td className="description-cell break-all px-1 py-2 text-center">
                    {element.description}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {/* here epic */}
                    {element.parent &&
                      (element.parent.name == "No epic"
                        ? "-"
                        : element.parent.name)}
                  </td>
                  <td
                    className={`px-1 py-2 ${getStatusColor(
                      // @ts-ignore
                      element.status
                    )} text-grey rounded-lg text-center`}
                  >
                    {element.status}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {element.hasSprint && element.hasSprint.length
                      ? element.hasSprint[0].name
                      : "-"}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {element.assignedTo ? element.assignedTo : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProjectBacklogs;
