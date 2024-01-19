import React, { useState, useEffect } from "react";
import { MdDeleteOutline, MdDelete, MdManageAccounts } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import UserOverlay from "./UserOverlay";
import LoadingIcon from "../../LoadingIcon";

import {
  GET_USERS,
  DELETE_USER,
  UPDATE_USER,
  handleUpdate_User,
  handleUser_Delete,
  GET_PROJECTS,
  get_user_method,
} from "../../../gql";
import { useQuery } from "@apollo/client";
import ManageAccountOverlay from "./ManageAccountOverlay";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../auth";
import userStore from "./userStore";
import projectStore from "../Projects/projectStore";
import { HiArrowsUpDown } from "react-icons/hi2";
import moment from "moment";
import { User } from "../../../lib/appInterfaces";

function Users() {
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
  const [editedUser, setEditedUser] = useState<string | null>(null);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showManageAccountPopup, setShowManageAccountPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUserDisabled, setIsNewUserDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState<User[]>([]);

  //project store
  const { projects, updateProjectData: updateProject } = projectStore();

  //user store
  const {
    usersList,
    updateUserList,
    sortOrder: sortingOrder,
    updateSortingOrder,
    handleSorting,
    deleteUserById,
    updateUser,
    userType,
    updateUserType,
    accessLevel,
    updateAccessLevel,
  } = userStore();
  // const usersList: any[] = userStore((state) => state.usersList);
  // const updateAccessLevele = userStore((state) => state.updateAccessLevel);

  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        get_user_method(user.email, GET_PROJECTS).then((res: any) => {
          const { hasProjects, ...userData } = res[0];
          const userType = userData.userType;
          updateUserType(userType);
          const userProjects = res[0].hasProjects.filter(
            (project: any) => project.recycleBin === false
          );
          updateProject(userProjects, loading, null);
        });
      }
    });
  };
  useEffect(() => {
    verfiyAuthToken();
    setUserData(usersList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersList]);

  const onhandleSearch = (e: any) => {
    const currentData = e.target.value;
    let filterData = structuredClone(usersList);
    filterData = filterData.filter((val) => {
      if (/^[0-9\/]+$/.test(currentData)) {
        return (
          moment(val.timeStamp).isValid() &&
          moment(val.timeStamp).format("MM/DD/YYYY").includes(currentData)
        );
      } else {
        return val.emailId.toLowerCase().includes(currentData.toLowerCase())
          ? true
          : val.userType.toLowerCase().startsWith(currentData.toLowerCase())
          ? true
          : false;
      }
    });
    setUserData(filterData);
    setSearchTerm(currentData);
  };

  const handleMessage = (message: any) => {
    setMessage(message);
    setIsLoading(true);
    setTimeout(() => {
      setMessage("");
      setIsLoading(false);
    }, 5000);
  };

  const { data, error, loading } = useQuery(GET_USERS);

  const handleEditClick = (userId: string) => {
    setEditedUser(userId);
  };

  const handleChanges_userType = (e: any) => {
    let currentDropdownData = e.target.value;
    let filterDropData = structuredClone(usersList);
    let filterDropdown = filterDropData.filter((val) => {
      return val.userType
        .toLowerCase()
        .startsWith(currentDropdownData.toLowerCase())
        ? true
        : false;
    });
    setSelectedTypeFilters(currentDropdownData);
    setUserData(filterDropdown);
  };

  const handleSaveClick = () => {
    if (editedUser) {
      handleUpdate_User(editedUser, accessLevel, UPDATE_USER, GET_USERS);
      updateUser(editedUser, accessLevel);
      setEditedUser(null);
    }
  };

  const handleSortClick = () => {
    //from user store
    const newSortingValue = sortingOrder === "asc" ? "desc" : "asc";
    updateSortingOrder(newSortingValue);
    handleSorting();
  };

  const handleAddUser = (user: User, selectedProjects: string[]) => {
    setShowAddUserPopup(false);
  };

  const handleDeleteClick = (userId: string) => {
    setConfirmDeleteId(userId);
  };

  const handleConfirmDelete = (userId: string) => {
    deleteUserById(userId);
    handleUser_Delete(userId, DELETE_USER, GET_USERS);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  useEffect(() => {
    if (data && data.users) {
      updateUserList(data.users);
    }
    setIsButtonDisabled(userType.toLowerCase() === "user");
    setIsNewUserDisabled(userType.toLowerCase() === "super user");
    handleChanges_userType;
  }, [data]);

  if (loading || isLoading)
    return (
      <div
        className="flex h-screen items-center justify-center"
        data-test-id="Icontest1"
      >
        <LoadingIcon />
      </div>
    );
  if (error) {
    return error && <div>{error.message}</div>;
  }

  const handleManageAccountClick = (user: User) => {
    setSelectedUser(user);
    setShowManageAccountPopup(true);
  };

  return (
    <div className=" p-6" data-test-id="testUser">
      {/* heading of the table */}
      <div className="flex h-full items-center">
        <button className="text-md   rounded bg-sky-500/75 p-2 font-semibold text-white">
          Team Agile
        </button>
      </div>

      <h2 className="py-4 text-2xl font-semibold">Users</h2>

      {/* top bar  */}

      <div className="grid grid-cols-4 gap-6 rounded bg-white p-4 shadow dark:bg-bgdarkcolor">
        <div className="rounded border border-slate-400 p-1 ">
          <input
            className=" bg-white-200 bg:text-slate-100 h-full w-full outline-none dark:bg-transparent"
            type="text"
            id="search"
            placeholder="Search"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => onhandleSearch(e)}
          />
        </div>

        <div className=" col-span-2  flex items-center justify-end gap-8">
          <span> Total : {userData.length} </span>
          <button onClick={handleSortClick}>
            shorting:{" "}
            <HiArrowsUpDown
              className={`inline ${sortingOrder === "asc" ? "" : "rotate-180"}`}
            />{" "}
          </button>
          <span>
            <label htmlFor="">Type : </label>
            <select
              className="rounded  border p-1 outline-none dark:border-none dark:bg-slate-700"
              defaultValue="All"
              name=""
              id=""
              onChange={handleChanges_userType}
              value={selectedTypeFilters}
            >
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super user">Super User</option>
            </select>
          </span>
        </div>
        {/* add user button */}
        <div className="text-end">
          <button
            className={` rounded border border-sky-500/75 bg-sky-500/75 p-2 text-white duration-300 hover:border hover:border-sky-500/75 hover:bg-transparent hover:text-sky-500 ${
              isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }${isNewUserDisabled ? "opacity-50" : ""}`}
            disabled={isButtonDisabled || isNewUserDisabled}
            onClick={() => setShowAddUserPopup(true)}
            data-test-id="addtestuser"
          >
            Add User
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="my-6 w-full text-left text-sm">
          <thead className=" bg-slate-700 text-xs text-slate-50 dark:bg-bgdarkcolor">
            <tr>
              <th scope="col" className="ml-6 w-60 cursor-pointer px-6 py-3">
                Name
              </th>
              <th scope="col" className="py-3 pl-60 pr-20">
                Access Level
              </th>
              <th scope="col" className="px-16 py-3">
                Date Added
              </th>
              <th scope="col" className="px-10 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll">
            {userData.map((user: any, index) => {
              return (
                <tr
                  key={user.id}
                  className="border-b border-black bg-white dark:border-slate-200 dark:bg-slate-600"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white">
                        {getInitials(user.emailId)}
                      </div>
                      <span className="ml-2">
                        {getNameFromEmail(user.emailId)}
                      </span>
                    </div>
                  </td>
                  {}
                  <td className="max-w-xs whitespace-nowrap py-4 pl-64 ">
                    {editedUser === user.id ? (
                      <select
                        value={accessLevel}
                        onChange={handleChanges_userType}
                        className="rounded-md border border-gray-300 p-1"
                      >
                        <option value="User">User</option>
                        <option value="Super User">Super User</option>
                      </select>
                    ) : (
                      user.userType
                    )}
                  </td>
                  <td className="px-16 py-4">{formatDate(user.timeStamp)}</td>
                  <td className="px-4 py-4 ">
                    {confirmDeleteId === user.id ? (
                      <div className="flex items-center">
                        <button
                          className="text-red-700 "
                          onClick={() => handleConfirmDelete(user.id)}
                          disabled={isButtonDisabled}
                          data-test-id="delTestIcon"
                        >
                          <MdDelete />
                        </button>
                        <button
                          className="px-3 text-gray-500"
                          onClick={handleCancelDelete}
                          disabled={isButtonDisabled}
                        >
                          {/* <RxCross2 /> */}x
                        </button>
                      </div>
                    ) : (
                      <>
                        {editedUser === user.id ? (
                          <button
                            className="rounded-md bg-green-600 px-2 py-1 font-semibold text-white"
                            onClick={handleSaveClick}
                            disabled={isButtonDisabled}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="ml-2 mr-2  rounded-full p-1 duration-300 hover:bg-slate-200"
                            onClick={() => handleEditClick(user.id)}
                            disabled={isButtonDisabled}
                          >
                            <AiFillEdit
                              className={isButtonDisabled ? "opacity-50" : ""}
                            />
                          </button>
                        )}
                        <button
                          className="ml-2 rounded-full p-1 duration-300 hover:bg-slate-200"
                          onClick={() => handleDeleteClick(user.id)}
                          disabled={isButtonDisabled}
                          data-test-id="testDelIcon"
                        >
                          <MdDeleteOutline
                            className={isButtonDisabled ? "opacity-50" : ""}
                          />
                        </button>
                        <button
                          className="ml-2 rounded-full p-1 duration-300 hover:bg-slate-200"
                          type="button"
                          onClick={() => handleManageAccountClick(user)}
                          disabled={isButtonDisabled}
                        >
                          <MdManageAccounts
                            className={isButtonDisabled ? "opacity-50" : ""}
                          />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {message && <div className="mt-4 text-green-500">{message}</div>}
      </div>

      {showAddUserPopup && (
        <UserOverlay
          onClose={() => setShowAddUserPopup(false)}
          //onAddUser={handleAddUser}
          projectData={projects}
          handleMessage={handleMessage}
        />
      )}
      {showManageAccountPopup && selectedUser && (
        <ManageAccountOverlay
          user={selectedUser}
          onClose={() => setShowManageAccountPopup(false)}
          adminProjects={projects}
        />
      )}
    </div>
  );
}

export default Users;

export function getInitials(name: string) {
  const nameArray = getNameFromEmail(name);
  const initials = [nameArray].map((name) => name.charAt(0)).join("");
  return initials;
}

export const getNameFromEmail = (email: string) => {
  const name = email.split("@")[0];
  const words = name.split(" ");

  const userNames = words.map((word) => {
    // Remove non-alphabetic characters
    const userName = word.replace(/[^a-zA-Z]/g, "");
    // Capitalize the first letter of each sanitized word
    return userName.charAt(0).toUpperCase() + userName.slice(1);
  });

  return userNames.join(" ");
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
