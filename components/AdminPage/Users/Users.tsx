import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { MdDeleteOutline, MdDelete, MdManageAccounts } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import UserOverlay from "./UserOverlay";
import { usersList } from "./UsersList";
import LoadingIcon from "../../LoadingIcon";

import {
  ALL_USERS,
  DELETE_USER,
  UPDATE_USER,
  handleUpdate_User,
  handleUser_Delete,
} from "./gqlUsers";
import { useQuery } from "@apollo/client";
import ManageAccountOverlay from "./ManageAccountOverlay";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../auth";
import {
  get_user_method,
  GET_USER,
} from "../Projects/gqlProject";
import userStore from "./userStore";
import projectStore from "../Projects/projectStore";

//user interface type
export interface User {
  id: string;
  name: string;
  accessLevel: string;
  dateAdded: string;
  projects: string[];
  emailId: string;
  userType: string;
  timeStamp: string;
  hasProjects: Array<{
    id: string;
    name: string;
  }>;
}

interface Project {
  id: string;
  name: string;
}

function Users() {
  const [editedUser, setEditedUser] = useState<string | null>(null);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showManageAccountPopup, setShowManageAccountPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUserDisabled, setIsNewUserDisabled] = useState(false);
  

  //project store
  const projects = projectStore((state)=>state.projects)




  //user store
  const usersList = userStore((state) => state.usersList);
  const updateUserList = userStore((state) => state.updateUserList);
  const sortingOrder = userStore((state) => state.sortOrder);
  const updateSortingOrder = userStore((state) => state.updateSortingOrder);
  const handleSorting = userStore((state) => state.handleSorting);
  const deleteUserById = userStore((state) => state.deleteUserById);
  const updateUser = userStore((state) => state.updateUser);
  const userType = userStore((state) => state.userType);
  const updateUserType = userStore((state) => state.updateUserType);
  const accessLevel = userStore((state) => state.accessLevel)
  const updateAccessLevele = userStore((state) => state.updateAccessLevel);







  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        get_user_method(user.email, GET_USER).then((res: any) => {
          const { hasProjects, ...userData } = res[0]
          const userType = userData.userType;
          updateUserType(userType)
          const userProjects = res[0].hasProjects.filter((project: any) => project.recycleBin === false)
          setProjectsList(userProjects);
        });
      }
    });
  };
  useEffect(() => {
    verfiyAuthToken();
  }, []);


  const handleMessage = (message: any) => {
    setMessage(message);
    setIsLoading(true);
    setTimeout(() => {
      setMessage("");
      setIsLoading(false);
    }, 5000);
  };

  const { data, error, loading } = useQuery(ALL_USERS);



  const handleEditClick = (userId: string) => {
    setEditedUser(userId);
  };

  const handleChanges_userType = (e: any) => {
    updateAccessLevele(e.target.value)
    // console.log(e.target.value)
  }


  const handleSaveClick = () => {
    if (editedUser) {
      handleUpdate_User(editedUser,accessLevel, UPDATE_USER, ALL_USERS);
      updateUser(editedUser, accessLevel)
      setEditedUser(null);
    }

  };


  const handleSortClick = () => {
    //from user store
    const newSortingValue = sortingOrder === "asc" ? "desc" : "asc"
    updateSortingOrder(newSortingValue)
    handleSorting()
  };







  const handleAddUser = (user: User, selectedProjects: string[]) => {
    setShowAddUserPopup(false);
  };

  const handleDeleteClick = (userId: string) => {
    setConfirmDeleteId(userId);
  };

  const handleConfirmDelete = (userId: string) => {
    deleteUserById(userId)
    handleUser_Delete(userId, DELETE_USER, ALL_USERS);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  useEffect(() => {
    if (data && data.users) {
      updateUserList(data.users)
    }
    setIsButtonDisabled(userType.toLowerCase() === "user");
    setIsNewUserDisabled(userType.toLowerCase() === "super user");
    handleChanges_userType
  }, [data]);

  if (loading || isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  if (error) {
    return error && <div> {error.message} </div>;
  }

  const handleManageAccountClick = (user: User) => {
    setSelectedUser(user);
    setShowManageAccountPopup(true);
  };

  return (
    <div className="relative overflow-x-auto" style={{ overflowX: "hidden" }}>
      <div className="ml-6 flex items-center">
        <button className="text-md ml-4 mt-4 h-10 rounded-lg bg-blue-200 px-5 font-semibold">
          Team Agile
        </button>
      </div>
      <div className="ml-10 mt-4 flex items-center">
        <h2 className="inline-block text-xl font-semibold">Users</h2>
        <p className="ml-8 inline-block">Total</p>
        <div className="ml-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
          {data && data.users && data.users.length}
        </div>
        <button
          className={`text-md ml-auto mr-10 flex items-center rounded-md bg-blue-200 p-2 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }${isNewUserDisabled ? "opacity-50" : ""}`}
          disabled={isButtonDisabled || isNewUserDisabled}
          onClick={() => setShowAddUserPopup(true)}
        >
          <GrAdd />
          <div className="mx-2 my-1">New User</div>
        </button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="ml-10 mt-4 rounded-lg text-left text-sm">
          <thead className="bg-gray-200 text-xs">
            <tr>
              <th
                scope="col"
                className="ml-6 w-60 cursor-pointer px-6 py-3"
                onClick={handleSortClick}
              >
                <div className="flex items-center">
                  Name
                  {sortingOrder === "asc" ? (
                    <AiOutlineArrowUp className="ml-2 rotate-180 transform text-gray-600" />
                  ) : (
                    <AiOutlineArrowUp className="ml-2 text-gray-600" />
                  )}
                </div>
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
          <tbody>
            {usersList.map((user: any) => {
              return <tr key={user.id} className="border-b bg-white">
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
                { }
                <td className="max-w-xs whitespace-nowrap py-4 pl-60 pr-20">
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
                <td className="px-10 py-4">
                  {confirmDeleteId === user.id ? (
                    <div className="flex items-center">
                      <button
                        className="text-red-700"
                        onClick={() => handleConfirmDelete(user.id)}
                        disabled={isButtonDisabled}
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
                          className="ml-2 mr-2"
                          onClick={() => handleEditClick(user.id)}
                          disabled={isButtonDisabled}
                        >
                          <AiFillEdit
                            className={isButtonDisabled ? "opacity-50" : ""}
                          />
                        </button>
                      )}
                      <button
                        className="ml-2 "
                        onClick={() => handleDeleteClick(user.id)}
                        disabled={isButtonDisabled}
                      >
                        <MdDeleteOutline
                          className={isButtonDisabled ? "opacity-50" : ""}
                        />
                      </button>
                      <button
                        className="ml-2"
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
            })}
          </tbody>
        </table>
        {message && <div className="mt-4 text-green-500">{message}</div>}
      </div>
      {showAddUserPopup && (
        <UserOverlay
          onClose={() => setShowAddUserPopup(false)}
          //onAddUser={handleAddUser}
          // @ts-ignore
          projectData={projects}
          handleMessage={handleMessage}
        />
      )}
      {showManageAccountPopup && selectedUser && (
        <ManageAccountOverlay
          user={selectedUser}
          onClose={() => setShowManageAccountPopup(false)}
          adminProjects={projectsList}
        />
      )}
    </div>
  );
}

export default Users;

function getInitials(name: string) {
  const nameArray = getNameFromEmail(name);
  const initials = [nameArray].map((name) => name.charAt(0)).join("");
  return initials;
}

const getNameFromEmail = (email: string) => {
  let regex = /[^a-z]/gi;
  const name = email.split("@")[0].toLocaleUpperCase();
  return name.replace(regex, "");
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
