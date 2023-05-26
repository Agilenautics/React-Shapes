import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";
import { MdDeleteOutline, MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import UserOverlay from "./UserOverlay";
import { usersList } from "./UsersList";
interface User {
  id: string;
  name: string;
  accessLevel: string;
  dateAdded: string;
}

const accessLevel: string = "suser";
const isButtonDisabled: boolean = accessLevel === "user";

function Users() {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [users, setUsers] = useState<User[]>(usersList);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const handleAddUser = (user: User) => {
    const newUser: User = {
      ...user,
      id: String(usersList.length + 1),
      dateAdded: String(new Date().toLocaleDateString()),
    };
    const updatedUsersList = setUsers([...users, newUser]);
    console.log(updatedUsersList);

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

  return (
    <div>
      <div className="flex ml-6 items-center">
        <button className="px-5 mt-4 ml-4 h-10 text-md bg-blue-200 rounded-lg font-semibold">
          Team Agile
        </button>
      </div>
      <div className="ml-10 mt-4 flex items-center">
        <h2 className="text-xl font-semibold inline-block">Users</h2>
        <p className="ml-8 inline-block">Total</p>
        <div className="ml-2 mt-1 h-5 w-5 text-xs rounded-full bg-gray-300 flex justify-center items-center">
          {users.length}
        </div>
        <button
          className={`ml-auto mr-10 flex items-center text-md bg-blue-200 rounded-md p-2 ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isButtonDisabled}
          onClick={() => setShowAddUserPopup(true)}
        >
          <GrAdd />
          <div className="mx-2 my-1">New User</div>
        </button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="ml-10 mt-4 rounded-lg text-sm text-left">
          <thead className="text-xs bg-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 w-60 ml-6 cursor-pointer"
                onClick={handleSortClick}
              >
                <div className="flex items-center">
                  Name
                  {sortOrder === "asc" ? (
                    <AiOutlineArrowUp className="ml-2 text-gray-600 transform rotate-180" />
                  ) : (
                    <AiOutlineArrowUp className="ml-2 text-gray-600" />
                  )}
                </div>
              </th>
              <th scope="col" className="pl-60 pr-20 py-3">
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
            {users.map((user: User) => (
              <tr key={user.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium whitespace-nowrap text-right">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex justify-center items-center text-white font-semibold bg-slate-600">
                      {getInitials(user.name)}
                    </div>
                    <span className="ml-2">{user.name}</span>
                  </div>
                </td>
                <td className="pl-60 pr-20 py-4">
                  {editedUser?.id === user.id ? (
                    <select
                      value={editedUser.accessLevel}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          accessLevel: e.target.value,
                        })
                      }
                      className="p-1 border border-gray-300 rounded-md"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Super User">Super User</option>
                    </select>
                  ) : (
                    user.accessLevel
                  )}
                </td>
                <td className="px-16 py-4">{user.dateAdded}</td>
                <td className="px-10 py-4">
                  {confirmDeleteId === user.id ? (
                    <div className="flex items-center">
                      <button
                        className="text-red-700"
                        onClick={() => handleConfirmDelete(user.id)}
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="text-gray-500 px-3"
                        onClick={handleCancelDelete}
                      >
                        {/* <RxCross2 /> */}
                        x
                      </button>
                    </div>
                  ) : (
                    <>
                      {editedUser?.id === user.id ? (
                        <button className="" onClick={handleSaveClick}>
                          Save
                        </button>
                      ) : (
                        <button
                          className="ml-2 mr-2"
                          onClick={() => handleEditClick(user)}
                        >
                          <AiFillEdit />
                        </button>
                      )}
                      <button
                        className="ml-2"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <MdDeleteOutline />
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
        />
      )}
    </div>
  );
}

export default Users;

function getInitials(name: string) {
  const nameArray = name.split(" ");
  const initials = nameArray.map((name) => name.charAt(0)).join("");
  return initials;
}
