// import React, { useEffect, useState, useRef, memo } from "react";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import fileStore from "../../TreeView/fileStore";
// import { getTypeLabel } from "./staticData/basicFunctions";
// import { types } from "./staticData/types";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../../../auth";
// import projectStore from "./projectStore";
// import userStore from "../Users/userStore";
// import backlogStore from "../../Backlogs/backlogStore";
// import { AiFillPlusCircle } from "react-icons/ai";
// import {
//   GET_PROJECTS,
//   updateStoryMethod,
//   updateStoryMutation,
//   updateTaskMethod,
//   getUserByEmail,
//   updateTasksMutation,
// } from "../../../gql";
// import { ApolloQueryResult } from "@apollo/client";
// import { useRouter } from "next/router";
// import { useTranslation } from "react-i18next";

// function ProjectBoards() {
//   const router = useRouter();

//   const { t } = useTranslation(); // useTranslation hook
//   const allStatus = backlogStore((state) => state.allStatus);
//   const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
//   const [statuses, setStatuses] = useState([]);
//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [columns, setColumns] = useState(allStatus);
//   const [showForm, setShowForm] = useState(false);
//   const [newBoardName, setNewBoardName] = useState<string>("");
//   const tooltipRef = useRef<HTMLSpanElement>(null);
//   const container = useRef<HTMLDivElement>(null);

//   const { loading, data: backend } = fileStore();
//   const { backlogs, updateBacklogsData, updateRow } = backlogStore();
//   const { updateProjectData: updateProjects, updateRecycleBinProject } =
//     projectStore();
//   const { updateUserType, updateLoginUser, userEmail } = userStore();

//   const getProjects = async (email: string) => {
//     try {
//       const response: ApolloQueryResult<any> | undefined = await getUserByEmail(
//         email,
//         GET_USER
//       );
//       const { hasProjects, ...userData } = response?.data.users[0];
//       updateProjects(hasProjects, response?.loading, response?.error);
//       updateRecycleBinProject(hasProjects);
//       updateLoginUser(userData);
//       updateUserType(userData.userType);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     if (userEmail) {
//       getProjects(userEmail);
//     }
//     // setIsButtonDisabled(userType.toLowerCase() === "user");
//     // setIsNewProjectDisabled(userType.toLowerCase() === "super user");
//   }, [userEmail]);

//   useEffect(() => {
//     if (backlogs.length == 0) {
//       updateBacklogsData(backend.children as any);
//     }
//     let filteredStatuses: any;
//     filteredStatuses = backlogs.filter(
//       (element) =>
//         selectedTypeFilters.length === 0 ||
//         selectedTypeFilters.includes(element.type)
//     );
//     setStatuses(filteredStatuses);
//   }, [backlogs, selectedTypeFilters]);

//   const handleDragStart = (e: any, task: any) => {
//     localStorage.setItem("task", JSON.stringify(task));
//   };

//   const handleDragOver = (e: React.MouseEvent) => {
//     e.preventDefault();
//   };

//   const updateStatus = ({ id, newStatus }: any) => {
//     const toBeUpdateData: any = statuses.filter((e: any) => e.id === id)[0];

//     const removeData = statuses.filter((e: any) => e.id !== id);
//     const afterUpdate = { ...toBeUpdateData, status: newStatus };

//     const updatedData: any = [...removeData, afterUpdate];

//     setStatuses(updatedData);
//   };

//   const handleDrop = (e: any, columnId: string) => {
//     e.preventDefault();

//     const task = JSON.parse(localStorage.getItem("task") as string);
//     task.status = columnId;

//     updateStatus({ id: task.id, newStatus: columnId });

//     if (task.type == "file") {
//       updateStoryMethod(task.id, updateStoryMutation, task).then(() =>
//         updateRow(task)
//       );
//     } else {
//       updateTaskMethod(task.id, updateTasksMutation, task).then(() =>
//         updateRow(task)
//       );
//     }

//     localStorage.clear();
//   };

//   const addBoard = (name: string) => {
//     if (name == "") {
//       alert("Please give a name");
//       return;
//     }
//     columns.push(name);
//     setNewBoardName("");
//     setShowForm(false);
//   };

//   const projectId = router.query.;

//   const toDetailPage = (selectedId: string) => {
//     router.push({
//       pathname: `/projects/${projectId}/boards/edit/`,
//       query: { id: selectedId },
//     });
//   };

//   if (loading) {
//     return <div>...loading</div>;
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="w-full p-4">
//         <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg dark:bg-bgdarkcolor dark:text-white">
//           {t("kanban_board")}
//         </h1>
//         <div className="relative inline-block text-left">
//           <div className="m-2 rounded bg-slate-100 p-2 hover:shadow-lg dark:bg-bgdarkcolor">
//             <button
//               className="flex"
//               onClick={() => setShowTypeDropdown(!showTypeDropdown)}
//             >{t("select_type")}

//               {showTypeDropdown ? (
//                 <svg
//                   className="ml-2 mr-4 h-5 w-5 rotate-180 transform"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="-mr-1 ml-2 h-5 w-5"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               )}
//             </button>
//             {showTypeDropdown && (
//               <div className="absolute  z-10 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 hover:bg-gray-200 ">
//                 <div className="py-1">
//                   {types.map((type) => (
//                     <div
//                       className=" rounded hover:bg-slate-50"
//                       key={type.value}
//                     >
//                       <label className="flex cursor-pointer items-center justify-between px-4 ">
//                         <span>{type.label}</span>
//                         <input
//                           type="checkbox"
//                           className="form-checkbox h-5 w-5 text-blue-600"
//                           onChange={() =>
//                             setSelectedTypeFilters((prevTypes) =>
//                               prevTypes.includes(type.value)
//                                 ? prevTypes.filter((t) => t !== type.value)
//                                 : [...prevTypes, type.value]
//                             )
//                           }
//                         />
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="flex space-x-4 overflow-x-auto ">
//           {columns.map((column: any) => (
//             <div
//               key={column}
//               className="relative mx-2 min-w-[250px] flex-1 rounded-lg bg-white p-4 shadow-md dark:bg-bgdarkcolor dark:text-white"
//               onDrop={(e) => handleDrop(e, column)}
//               onDragOver={(e) => handleDragOver(e)}
//             >
//               <div className="statuses-center mb-2 flex justify-between dark:bg-bgdarkcolor">
//                 <h2 className="text-lg font-semibold">{column}</h2>
//               </div>
//               <div className="h-80 space-y-2 overflow-y-auto overflow-x-hidden dark:text-slate-600">
//                 {statuses.map((task: any) =>
//                   task.status === column ? (
//                     <div
//                       key={task.id}
//                       className="border-box transform cursor-pointer rounded bg-slate-100 p-2 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
//                       draggable="true"
//                       onDrag={(e) => handleDragStart(e, task)}

//                       // onDragStart={(e) => handleDragStart(e, task)}
//                       // onDragEnd={(e) => handleDrop(e, column.id)}
//                     >
//                       <div className="font-bold hover:text-blue-500 hover:underline duration-300 " onClick={() => toDetailPage(task.id)}>{task.name || task.label}</div>
//                       <div>{getTypeLabel(task.type).type}</div>
//                     </div>
//                   ) : null
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div ref={container} className="group relative cursor-pointer pl-1.5">
//         <AiFillPlusCircle
//           onClick={() => setShowForm(!showForm)}
//           onMouseEnter={({ clientX }) => {
//             if (!tooltipRef.current || !container.current) return;
//             const { left } = container.current.getBoundingClientRect();
//             tooltipRef.current.style.left = clientX - left + "px";
//           }}
//           className="rounded-full bg-white stroke-white  text-[2.5rem] text-sky-500 duration-700"
//         />
//         <span
//           ref={tooltipRef}
//           className="invisible absolute top-full z-10 mt-2 whitespace-nowrap rounded-md  border-black  bg-slate-500 p-1.5 text-[0.8rem]  text-white opacity-0 transition group-hover:visible group-hover:opacity-100"
//         >
//           {t("add_column")}

//         </span>
//       </div>

//       {showForm && (
//         <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-bgdarkcolor dark:text-white">
//             <h2 className="mb-4 text-xl font-semibold ">{t("enter_column_name")}</h2>
//             <input
//               type="text"
//               className="w-full rounded border p-2 dark:text-bgdarkcolor"
//               value={newBoardName}
//               onChange={(e) => setNewBoardName(e.target.value)}
//               placeholder="Column Name"
//             />
//             <button
//               className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
//               onClick={() => addBoard(newBoardName)}
//             >
//              {t("add_column")}
//             </button>
//             <button
//               className="ml-2 mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {t("cancel")}
//             </button>
//           </div>
//         </div>
//       )}
//     </DndProvider>
//   );
// }

// export default memo(ProjectBoards);

import React, { useEffect } from "react";
import { GET_PROJECTS, getUserByEmail } from "../../../gql";
import { ApolloQueryResult } from "@apollo/client";
import userStore from "../Users/userStore";
import projectStore from "./projectStore";

const ProjectBoards = () => {
  const { updateProjectData: updateProjects, updateRecycleBinProject } =
    projectStore();
  const { updateUserType, updateLoginUser, userEmail } = userStore();

  const getProjects = async (email: string) => {
    try {
      const response: ApolloQueryResult<any> | undefined = await getUserByEmail(
        email,
        GET_PROJECTS
      );
      const { hasProjects, ...userData } = response?.data.users[0];
      updateProjects(hasProjects, response?.loading, response?.error);
      updateRecycleBinProject(hasProjects);
      updateLoginUser(userData);
      updateUserType(userData.userType);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userEmail) {
      getProjects(userEmail);
    }
    // setIsButtonDisabled(userType.toLowerCase() === "user");
    // setIsNewProjectDisabled(userType.toLowerCase() === "super user");
  }, [userEmail]);
  return <div>...In Progress...</div>;
};

export default ProjectBoards;
