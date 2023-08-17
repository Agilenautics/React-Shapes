import React, { useState, useEffect, useCallback } from "react";
import { GrAdd } from "react-icons/gr";
import { BiRename } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineArrowDown, AiFillDelete } from "react-icons/ai";
import ProjectOverlay from "./ProjectOverlay";
import {
  DELETE_PROJECT,
  GET_USER,
  EDIT_PROJECT,
  edit_Project,
  delete_Project,
} from "./gqlProject";
import { useQuery } from "@apollo/client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../auth";
import Link from "next/link";
import LoadingIcon from "../../LoadingIcon";
import { User, getInitials } from "../Users/Users";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiDotsVerticalRounded, } from 'react-icons/bi'
import { HiArrowsUpDown, HiXMark } from 'react-icons/hi2'
import { MdKeyboardArrowRight } from 'react-icons/md'

import { getNameFromEmail } from "../Users/Users";
import { useRouter } from "next/router";

interface Project {
  id: string;
  name: string;
  desc: string;
  description: string;
  recycleBin: Boolean
  users: User[];
}

function Projects() {
  // Access Level controlled by the server-side or additional validation
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNewProjectDisabled, setIsNewProjectDisabled] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [projectTrackChanges, setProjectTrackChanges] = useState(false);



  const allProjects = projectStore((state) => state.projects)
  const updateProjects = projectStore((state) => state.updateProjectData);
  const handleSorting = projectStore((state) => state.handleSorting);
  const sortValue = projectStore((state) => state.sortOrder)
  const updateSortOrder = projectStore((state) => state.updateSortOrder);
  const deleteProject = projectStore((state) => state.deleteProject);
  const updateProject = projectStore((state) => state.updateProject);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject);
  const recycleBinProject = projectStore((state) => state.recycleBin)



  // user store
  const userType = userStore((state) => state.userType);
  const updateUserType = userStore((state) => state.updateUserType);


  const router = useRouter()



  const notify = () => toast.success("Project Created...");






  const { data, error, loading } = useQuery(GET_USER, {
    variables: {
      where: {
        emailId: userEmail,
      },
    },
  });

  const getProject = async (data: Array<Project>) => {
    // @ts-ignore
    if (data && data.users.length) {
      //@ts-ignore
      const userType = data.users[0].userType;
      updateUserType(userType)
      //@ts-ignore
      const projectData = data.users[0].hasProjects;

      //@ts-ignore
      setProjectData(projectData);
      updateProjects(projectData)
      updateRecycleBinProject(projectData)
    }
  };

  //verifying token
  const verifyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        if (loading) return "";
        getProject(data);
      }
    });
  };





  useEffect(() => {
    const filteredProjects = projectData.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // @ts-ignore
    updateProjects(filteredProjects)
  }, [searchTerm])

  useEffect(() => {
    verifyAuthToken();
    setIsButtonDisabled(userType.toLowerCase() === "user");
    setIsNewProjectDisabled(userType.toLowerCase() === "super user");
  }, [data]);


  const handleSortClick = () => {
    const newSortOrder = sortValue === "asc" ? "desc" : "asc";
    updateSortOrder(newSortOrder)
    handleSorting()
  };



  const handleEditButtonClick = (
    projectId: string,
    projectName: string,
    projectDesc: string
  ) => {
    setProjectId(projectId);
    setProjectName(projectName);
    setProjectDesc(projectDesc);
  };

  const handleSaveButtonClick = (projectId: string) => {
    const result = { projectName, projectDesc }
    edit_Project(projectId, projectName, projectDesc, EDIT_PROJECT, GET_USER);
    updateProject(projectId, result)
    setProjectId(null);
    setProjectName("");
  };

  const handleDelete_Project = (projectId: string) => {
    // Display confirmation box
    setShowConfirmation(true);
    setProjectId(projectId);
  };

  const handleConfirm = useCallback(() => {
    // Delete the project if confirmed
    setShowConfirmation(false);
    if (projectId) {
      delete_Project(projectId, DELETE_PROJECT, GET_USER);
      deleteProject(projectId)
      setProjectId(null);
    }
  }, [projectId]);

  const handleCancel = useCallback(() => {
    // Cancel the delete operation
    setShowConfirmation(false);
    setProjectId(null);
  }, []);

  const handleAddProjectClick = () => {
    console.log("Hello...")
    setShowForm(true);
  };

  const handleAddProject = (name: string, desc: string) => {
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleMessage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };


  // to navigate recycle bin
  const toRecycleBin = () => {
    router.push('/recycleBin')
    // .push("/recyclebin");
  }

  const handleDotClick = (id: string | any) => {
    setProjectTrackChanges(!projectTrackChanges)
    setProjectId(id)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    console.log(error.message);
  }









  return (
    // <div>
    //   <div className="mt-4 flex justify-center">
    //     {successMessage && (
    //       <div className="rounded-md bg-green-200 px-4 py-2 text-green-800">
    //         {successMessage}
    //       </div>
    //     )}
    //   </div>
    //   <div className="ml-6 flex items-center">
    //     <button className="text-md ml-4 mt-4 h-10 rounded-lg bg-blue-200 px-5 font-semibold">
    //       Team Agile
    //     </button>
    //   </div>
    //   <div className="ml-10 mt-4 flex items-center">
    //     <h2 className="inline-block text-xl font-semibold">Projects</h2>
    //     <p className="ml-8 inline-block">Total</p>
    //     <div className="ml-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
    //       {allProjects && allProjects.length}
    //     </div>
    //     <button
    //       className={`text-md ml-auto mr-12 flex items-center rounded-md bg-blue-200 p-2 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
    //         }${isNewProjectDisabled ? "opacity-50" : ""}`}
    //       disabled={isButtonDisabled || isNewProjectDisabled}
    //       onClick={handleAddProjectClick}
    //     >
    //       <GrAdd />
    //       <div className="mx-1 my-1">New Project</div>
    //     </button>
    //   </div>
    //   <div className="ml-10 mt-2">
    //     <div className="max-w-2xl">
    //       <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg bg-gray-200 focus-within:shadow-lg">
    //         <div className="grid h-full w-12 place-items-center text-gray-600">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             className="h-6 w-6"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth="2"
    //               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    //             />
    //           </svg>
    //         </div>

    //         <input
    //           className="peer h-full w-full bg-gray-200 pr-2 text-base text-black outline-none"
    //           type="text"
    //           id="search"
    //           placeholder="Search"
    //           autoComplete="off"
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   <div className="relative overflow-x-auto sm:rounded-lg">
    //     <table className="mb-4 ml-8 mt-4 w-11/12 rounded-lg text-left text-sm">
    //       <thead className="bg-gray-200 text-xs">
    //         <tr>
    //           <th
    //             scope="col"
    //             className="w-40 px-4 py-3"
    //             onClick={handleSortClick}
    //           >
    //             <div className="flex cursor-pointer items-center">
    //               Project name
    //               <AiOutlineArrowDown
    //                 className={`ml-1 text-sm ${sortValue === "asc" ? "rotate-180 transform" : ""
    //                   }`}
    //               />
    //             </div>
    //           </th>
    //           <th scope="col" className="px-6 py-3">
    //             Description
    //           </th>
    //           <th scope="col" className="px-6 py-3">
    //             Actions
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {allProjects
    //           .map((project: any, index) => (
    //             <tr key={index} className="border-b bg-white">
    //               <td className="whitespace-nowrap px-4 py-4 font-medium">
    //                 {projectId === project.id ? (
    //                   <input
    //                     type="text"
    //                     value={projectName}
    //                     onChange={(e) => setProjectName(e.target.value)}
    //                     className="border-b focus:border-blue-500 focus:outline-none"
    //                   />
    //                 ) : (
    //                   <Link
    //                     href={{
    //                       pathname: "/projects/" + project.id,
    //                     }}
    //                   >
    //                     {project.name}
    //                   </Link>
    //                 )}
    //               </td>
    //               <td className="hidden px-6 py-4 md:table-cell">
    //                 {projectId === project.id ? (
    //                   <input
    //                     type="text"
    //                     value={projectDesc}
    //                     onChange={(e) => setProjectDesc(e.target.value)}
    //                     className="w-full border-b focus:border-blue-500 focus:outline-none"
    //                   />
    //                 ) : (
    //                   project.description
    //                 )}
    //               </td>
    //               <td className="px-6 py-4">
    //                 {projectId === project.id ? (
    //                   <button
    //                     onClick={() => handleSaveButtonClick(project.id)}
    //                     className={`mr-2 ${isButtonDisabled ? "opacity-50" : ""
    //                       }`}
    //                     disabled={isButtonDisabled}
    //                   >
    //                     Save
    //                   </button>


    //                 ) : (
    //                   <button
    //                     onClick={() =>
    //                       handleEditButtonClick(
    //                         project.id,
    //                         project.name,
    //                         project.description
    //                       )
    //                     }
    //                     className={`mr-2 w-3 ${isButtonDisabled ? "opacity-50" : ""
    //                       }`}
    //                     disabled={isButtonDisabled}
    //                   >
    //                     <BiRename />
    //                   </button>
    //                 )}
    //                 <button
    //                   onClick={() => handleDelete_Project(project.id)}
    //                   className={`ml-2 ${isButtonDisabled ? "opacity-50" : ""}`}
    //                   disabled={isButtonDisabled}
    //                 >
    //                   <MdDeleteOutline />
    //                 </button>
    //               </td>
    //             </tr>
    //           ))}
    //       </tbody>
    //     </table>
    //   </div>
    //   {showForm && (
    //     <ProjectOverlay
    //       notify = {notify}
    //       onAddProject={handleAddProject}
    //       onClose={handleCloseForm}
    //       // @ts-ignore
    //       projectData={allProjects}
    //       userEmail={userEmail}
    //       handleMessage={handleMessage}
    //     />
    //   )}
    //   {showConfirmation && (
    //     <div className="popup-container">
    //       <div className="popup-window">
    //         <h3>Confirm Deletion</h3>
    //         <p>Are you sure you want to delete the project?</p>
    //         <div>
    //           <button className="popup-button" onClick={handleConfirm}>
    //             Yes
    //           </button>
    //           <button className="popup-button" onClick={handleCancel}>
    //             No
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   <ToastContainer autoClose= {2500} />
    // </div>

    // container
    <div className="p-7 dark:bg-slate-900 dark:text-slate-100">


      {/* Greeting to a user  */}
      <div className="grid shadow-md rounded mb-4 bg-white gap-6 grid-cols-2 item-center justify-center dark:bg-slate-600">

        <div className=" flex item-center justify-center">
          <img src="/assets/grretingImage.png" height="50%" width='50%' alt="" />
        </div>

        <div className="flex flex-col justify-around">
          <div>
            <h2 className="text-4xl"> Welcome! {getNameFromEmail(userEmail)}  </h2>
            <p className="text-xl m-2">Quality is never an accident; it is always the result of high intention, sincere effort, intelligent direction, and skillful execution</p>
          </div>
          <a href="#activities" className="text-sky-500 m-2 duration-300 hover:text-sky-700 cursor-pointer underline">see the daily activities</a>
        </div>

      </div>


      {/* Project  heading*/}
      <h2 className="mb-6 text-2xl font-semibold">Projects</h2>

      {/* project heading bar (functionality) */}
      <div id="activities" className="bg-white gap-6 p-4 mb-6 shadow grid h-fit grid-cols-4 items-center text-center dark:bg-slate-600">
        <div className="border rounded border-slate-400 p-1">
          <input
            className=" h-full w-full bg-white-200 dark:bg-transparent bg:text-slate-100 outline-none"
            type="text"
            id="search"
            placeholder="Search"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className=" col-span-2">
          <span className="ml-5">Total : {allProjects.length}</span>
          <button onClick={handleSortClick} className="ml-5 hover:bg-slate-100 rounded-lg hover:text-slate-500 duration-300 p-2"> sorting:<HiArrowsUpDown className={`inline ${sortValue === 'asc' ? '' : "rotate-180"}`} /> </button>
          <button onClick={toRecycleBin} className="ml-5 relative p-2  rounded-lg hover:bg-slate-100 rounded-lg hover:text-slate-500 duration-300">
            RecycleBin: <AiFillDelete className="inline text-xl" /><span className="bg-sky-500 rounded-full text-sm text-white absolute right-[1px] w-4 h-[20px] top-1"> {recycleBinProject.length} </span>
          </button>
        </div>

        <div className="text-end">
          <button onClick={handleAddProjectClick} className="bg-sky-500/75 p-2 hover:bg-transparent hover:text-sky-500 border border-sky-500/75 duration-300 hover:border-sky-500/75 hover:border rounded text-white">Add Project</button>
        </div>
      </div>

      {/* add project form container */}


      {showForm && (
        <ProjectOverlay
          notify={notify}
          onAddProject={handleAddProject}
          onClose={handleCloseForm}
          // @ts-ignore
          projectData={allProjects}
          userEmail={userEmail}
          handleMessage={handleMessage}
        />
      )}


      {/* project card */}
      <div className=" grid grid-cols-3   gap-6 " >
        {
          allProjects.map((projects, index) => {
            const { name, id, description, userHas } = projects
            return (
              <div key={id} className="bg-white z-30 flex flex-col relative justify-between shadow-md  duration-200  hover:shadow-xl san-sarif p-4 rounded dark:bg-slate-600">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold"> {name} </h3>
                    <button onClick={() => handleDotClick(id)} className="text-xl"> {projectId === id && projectTrackChanges ? <HiXMark /> : <BiDotsVerticalRounded />} </button>
                  </div>
                  <p className="mt-2 mb-3"> {description} </p>
                </div>
                <div>
                  <div className="text-sky-500  hover:underline duration-300">
                    <Link href={`/projects/` + id}>see more</Link>
                    <MdKeyboardArrowRight className="inline" />
                  </div>
                  <div className="flex justify-end "> {projectAssignedUser(userHas)} </div>
                </div>

                {projectId === id &&
                  projectTrackChanges ? (<div className="flex flex-col bg-white absolute -right-[20px] top-10 shadow">
                    <button className="p-1 text-xs bg-yellow-500 text-white border-b-2">Edit</button>
                    <button className="p-1 text-xs bg-red-500 text-white">Delete</button>
                  </div>) : null
                }

                {/* */}
              </div>
            )
          })
        }

      </div>

    </div>
  );
}

export default Projects;



// userList 

export const projectAssignedUser = (users: any) => {




  const user = users.map((value: User, index: string) => {
    const { id, emailId } = value
    return (
      <div style={{ backgroundColor: getRandomColor() }} key={index} className=" rounded-full items-center flex justify-center w-6 group cursor-pointer h-6 text-white">
        <span className="">{getInitials(emailId)}</span>
      </div>
    )
  });
  return user
}


export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
