import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";
import { MdDeleteOutline, MdDelete, MdManageAccounts } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import UserOverlay from "./UserOverlay";
import { usersList } from "./UsersList";
import { ALL_USERS } from "./gqlUsers";
import { useQuery } from "@apollo/client";
import ManageAccountOverlay from "./ManageAccountOverlay";
import { ProjectsList } from "../Projects/ProjectsList";

interface User {
  id: string;
  name: string;
  accessLevel: string;
  dateAdded: string;
  projects: string[];
}

const accessLevel: string = "user";
const isButtonDisabled: boolean = accessLevel === "user";

function Users() {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [users, setUsers] = useState<User[]>(usersList);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showManageAccountPopup, setShowManageAccountPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, error, loading } = useQuery(ALL_USERS);

  const handleEditClick = (user: User) => {
    setEditedUser(user);
  };

  const handleSaveClick = () => {
    if (editedUser) {
      const updatedUsers = users.map((user) => {
        if (user.id === editedUser.id) {
          return { ...user, accessLevel: editedUser.accessLevel };
        }
        return user;
      });

      setUsers(updatedUsers);
      setEditedUser(null);
    }
  };

  const handleAddUser = (user: User, selectedProjects: string[]) => {
    const newUser: User = {
      ...user,
      id: String(usersList.length + 1),
      dateAdded: String(new Date().toLocaleDateString()),
      projects: selectedProjects,
    };

    setUsers([...users, newUser]);
    setShowAddUserPopup(false);
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  const handleDeleteClick = (userId: string) => {
    setConfirmDeleteId(userId);
  };

  const handleConfirmDelete = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  if (loading) return <div>....Loading</div>;

  if (error) {
    return error && <div> {error.message} </div>;
  }

  // console.log(new Date("2023-05-29T12:35:27.575Z"))

  function convert(str: string) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  console.log(convert("2023-05-29T12:35:27.575Z"));
  //-> "2011-06-08"

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
          {users.length}
        </div>
        <button
          className={`text-md ml-auto mr-10 flex items-center rounded-md bg-blue-200 p-2 ${
            isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isButtonDisabled}
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
                  {sortOrder === "asc" ? (
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
            {data.users.map((user: User) => (
              <tr key={user.id} className="border-b bg-white">
                <td className="whitespace-nowrap px-6 py-4 text-right font-medium">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white">
                      {
                        // @ts-ignore
                        getInitials(user.emailId)
                      }
                    </div>
                    <span className="ml-2">
                      {
                        // @ts-ignore
                        getNameFromEmail(user.emailId)
                      }
                    </span>
                  </div>
                </td>
                {}
                <td className="max-w-xs whitespace-nowrap py-4 pl-60 pr-20">
                  {editedUser?.id === user.id ? (
                    <select
                      value={editedUser.accessLevel}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          accessLevel: e.target.value,
                        })
                      }
                      className="rounded-md border border-gray-300 p-1"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Super User">Super User</option>
                    </select>
                  ) : (
                    // @ts-ignore
                    user.userType
                  )}
                </td>
                <td className="px-16 py-4">
                  {
                    // @ts-ignore
                    formatDate(user.timeStamp)
                  }
                </td>
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
                      {editedUser?.id === user.id ? (
                        <button
                          className="rounded-md bg-red-600 px-2 py-1 font-semibold text-white"
                          onClick={handleSaveClick}
                          disabled={isButtonDisabled}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="ml-2 mr-2"
                          onClick={() => handleEditClick(user)}
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
            ))}
          </tbody>
        </table>
      </div>
      {showAddUserPopup && (
        <UserOverlay
          onClose={() => setShowAddUserPopup(false)}
          onAddUser={handleAddUser}
          projectData={ProjectsList}
        />
      )}
      {showManageAccountPopup && selectedUser && (
        <ManageAccountOverlay
          user={selectedUser}
          onClose={() => setShowManageAccountPopup(false)}
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
    // hour: "2-digit",
    // minute: "2-digit",
  });
};
