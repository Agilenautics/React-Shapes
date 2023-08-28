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
import { HiArrowsUpDown } from "react-icons/hi2";

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUserDisabled, setIsNewUserDisabled] = useState(false);


  //project store
  const projects = projectStore((state) => state.projects);
  const updateProject = projectStore((state) => state.updateProjectData)








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
          // const userProjects = res[0].hasProjects.filter((project: any) => project.recycleBin === false);
          // updateProject(userProjects)
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
      handleUpdate_User(editedUser, accessLevel, UPDATE_USER, ALL_USERS);
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
    <div className=" p-6">
      {/* heading of the table */}
      <div className="flex items-center">
        <button className="text-md   rounded text-white bg-sky-500/75 p-2 font-semibold">
          Team Agile
        </button>
      </div>

      {/* <div className=" border flex items-center">
        <h2 className="inline-block text-xl font-semibold">Users</h2>
        <p className="ml-8 inline-block">Total :</p>
        <div className="">
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
      </div> */}

      <h2 className="text-2xl font-semibold py-4">Users</h2>

      {/* top bar  */}

      <div className="grid grid-cols-4 bg-white gap-6 p-4 rounded shadow dark:bg-slate-600 ">
        <div className="border rounded border-slate-400 p-1 ">
          <input
            className=" h-full w-full bg-white-200 dark:bg-transparent bg:text-slate-100 outline-none"
            type="text"
            id="search"
            placeholder="Search"
            autoComplete="off"
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className=" col-span-2  flex justify-end gap-8 items-center">
          <span> Total : {usersList.length} </span>
          <button onClick={handleSortClick}>shorting: <HiArrowsUpDown className={`inline ${sortingOrder === 'asc' ? '' : "rotate-180"}`} /> </button>
          <span>
            <label htmlFor="">Type : </label>
            <select className="outline-none  border dark:border-none rounded dark:bg-slate-700 p-1" name="" id="">
              <option value="user">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super user">Super User</option>
            </select>
          </span>
        </div>
        {/* add user button */}
        <div className="text-end">
          <button className={` bg-sky-500/75 p-2 hover:bg-transparent hover:text-sky-500 border border-sky-500/75 duration-300 hover:border-sky-500/75 hover:border rounded text-white ${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }${isNewUserDisabled ? "opacity-50" : ""}`}
            disabled={isButtonDisabled || isNewUserDisabled}
            onClick={() => setShowAddUserPopup(true)}>Add User</button>
        </div>
      </div>


      <div className="relative overflow-x-auto">
        <table className="w-full my-6 text-left text-sm">
          <thead className=" bg-slate-700 text-slate-50 text-xs">
            <tr>
              <th
                scope="col"
                className="ml-6 w-60 cursor-pointer px-6 py-3"
              >
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
            {usersList.map((user: any,index) => {
              return <tr key={user.id} className="border-b border-black dark:border-slate-200 bg-white dark:bg-slate-600">
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
                          className="ml-2 mr-2  rounded-full p-1 hover:bg-slate-200 duration-300"
                          onClick={() => handleEditClick(user.id)}
                          disabled={isButtonDisabled}
                        >
                          <AiFillEdit
                            className={isButtonDisabled ? "opacity-50" : ""}
                          />
                        </button>
                      )}
                      <button
                        className="ml-2 rounded-full p-1 hover:bg-slate-200 duration-300"
                        onClick={() => handleDeleteClick(user.id)}
                        disabled={isButtonDisabled}
                      >
                        <MdDeleteOutline
                          className={isButtonDisabled ? "opacity-50" : ""}
                        />
                      </button>
                      <button
                        className="ml-2 rounded-full p-1 hover:bg-slate-200 duration-300"
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



      {/* <div className="grid  gap-4">
        <div className="shadow flex justify-around bg-white p-2">
          <div className="border">Name</div>
          <div className="border">Type</div>
          <div className="border">Date Added</div>
          <div className="border">Actions</div>
        </div>
        <div className="shadow flex justify-around bg-white p-2">
          <div className="border">Name</div>
          <div className="border">Typeajshahdjadjajdhjhdjhj</div>
          <div className="border">Date Added</div>
          <div className="border">Actions</div>
        </div>
        
      </div> */}





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
          // @ts-ignore
          adminProjects={projects}
        />
      )}
    </div>
    // <div className="p-6">
    //   <button className="text-xl rounded bg-sky-500/75 p-2 text-slate-50">Team Agile</button>


    //   {/* heading */}

    //   <h2 className="text-2xl font-semibold py-4">Users</h2>


    //   {/* top bar  */}

    //   <div className="grid grid-cols-4 bg-white gap-6 p-4 shadow">
    //     <div className="border rounded border-slate-400 p-1 ">
    //       <input
    //         className=" h-full w-full bg-white-200 dark:bg-transparent bg:text-slate-100 outline-none"
    //         type="text"
    //         id="search"
    //         placeholder="Search"
    //         autoComplete="off"
    //       // value={searchTerm}
    //       // onChange={(e) => setSearchTerm(e.target.value)}
    //       />
    //     </div>

    //     <div className=" col-span-2 border ">
    //       <span> Total : {usersList.length} </span>
    //       <button onClick={handleSortClick}>shorting: <HiArrowsUpDown className={`inline ${sortingOrder === 'asc' ? '' : "rotate-180"}`} /> </button>
    //       <span>
    //         <label htmlFor="">Type:</label>
    //         <select className="outline-none  border rounded" name="" id="">
    //           <option value="user">All</option>
    //           <option value="user">User</option>
    //           <option value="admin">Admin</option>
    //           <option value="super user">Super User</option>
    //         </select>
    //       </span>
    //     </div>
    //     {/* add user button */}
    //     <div className="text-end">
    //       <button className="bg-sky-500/75 p-2 hover:bg-transparent hover:text-sky-500 border border-sky-500/75 duration-300 hover:border-sky-500/75 hover:border rounded text-white">Add User</button>
    //     </div>
    //   </div>


    //   {/* heading of the table */}

    //   <div className="grid grid-cols-4 gap-6">
    //     <div className="place-self-center">
    //       name
    //     </div>
    //     <div className="place-self-center">
    //       type
    //     </div>
    //     <div className="place-self-center">
    //       Date Added
    //     </div>
    //     <div className="place-self-center">
    //       Actions
    //     </div>
    //   </div>
    //   {/* users list */}
    //   <div>
    //     {
    //       usersList.map((users,index)=>{
    //         const {id,emailId, timeStamp,userType} = users
    //         console.log(users)
    //         return(
    //           <div key={index} className="grid grid-cols-4">
    //             <div className="">
    //               <span>{getInitials(emailId)}</span>
    //               <span> {getNameFromEmail(emailId)} </span>
    //             </div>
    //             <div> {userType} </div>
    //             <div> {formatDate(timeStamp)} </div>
    //             <div>
    //               <button></button>
    //             </div>


    //           </div>
    //         )
    //       })
    //     }
    //   </div>

    // </div>
  );
}

export default Users;

export function getInitials(name: string) {
  const nameArray = getNameFromEmail(name);
  const initials = [nameArray].map((name) => name.charAt(0)).join("");
  return initials;
}

export const getNameFromEmail = (email: string) => {
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
