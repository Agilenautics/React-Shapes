import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import fileStore from "../../TreeView/fileStore";
import { getTypeLabel } from "./staticData/basicFunctions";
import { types } from "./staticData/types";
import { allStatus } from "./staticData/processedData";
import { updateTaskMethod, updateTasksMutation } from "../../Flow/Nodes/gqlNodes";
import { updateStoryMethod, updateStoryMutation } from "../../TreeView/gqlFiles";
import { onAuthStateChanged } from "firebase/auth";
import { GET_USER, getUserByEmail } from "./gqlProject";
import { auth } from "../../../auth";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import backlogStore from "../../Backlogs/backlogStore";
// import backlogs from "../../../pages/projects/[projectId]/backlogs";

function ProjectBoards() {
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
  const [statuses, setStatuses] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [columns, setColumns] = useState(allStatus);
  const [showForm, setShowForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState<string>('')

  let backend: any = fileStore((store) => store.data);
  const { backlogs, updateBacklogsData, updateRow } = backlogStore()
  const loading = fileStore((state) => state.loading);

  // let backend = useBackend();

  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject)
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser)


  const loadingFromFileStore = fileStore((state) => state.loading);
  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        getUserByEmail(user.email, GET_USER, { updateLoginUser, updateProjects, updateUserType, updateRecycleBinProject })
      }
    })
  }

  useEffect(() => {

    if(backlogs.length==0){
      updateBacklogsData(backend.children)
      }
    let filteredStatuses: any;
    filteredStatuses = backlogs.filter(
      (element) =>
        selectedTypeFilters.length === 0 ||
        selectedTypeFilters.includes(element.type)
    );
    setStatuses(filteredStatuses);
  }, [backlogs, selectedTypeFilters]);

  useEffect(() => {
    verificationToken()
  }, [])


  const handleDragStart = (e: any, task: any) => {

    localStorage.setItem("task", JSON.stringify(task))
  };

  const handleDragOver = (e:React.MouseEvent) => {
    e.preventDefault();
  };

  const updateStatus = ({ id, newStatus }: any) => {

    const toBeUpdateData: any = statuses.filter((e: any) => e.id === id)[0]


    const removeData = statuses.filter((e: any) => e.id !== id)
    const afterUpdate = { ...toBeUpdateData, status: newStatus }


    const updatedData: any = [...removeData, afterUpdate]

    setStatuses(updatedData)

  }

  const handleDrop = (e: any, columnId: string) => {
    e.preventDefault();

    //@ts-ignore
    const task = JSON.parse(localStorage.getItem("task"))
    task.status = columnId

    // console.log(statuses);
    updateStatus({ id: task.id, newStatus: columnId })

    if (task.type == "file") {
      updateStoryMethod(task.id, updateStoryMutation, task)
      .then(()=> updateRow(task))
    } else {
      updateTaskMethod(task.id, updateTasksMutation, task)
      .then(()=> updateRow(task))
    }

    localStorage.clear()

  };

  // console.log(statuses);


  if (loadingFromFileStore) {
    return <div>...loading</div>;
  }

  
  const addBoard = (name: string) =>{
    if(name==''){
      alert("Please give a name")
      return;
    }
   columns.push(name)
   setNewBoardName('')
   setShowForm(false)
  }


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-4">
        <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg">
          Kanban Board
        </h1>
        <div className="relative inline-block text-left">
          <div className="bg-slate-100 rounded m-2 p-2 hover:shadow-lg">
            <button
              className="flex"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              Select type
              {showTypeDropdown ? (
                <svg
                  className="mr-4 ml-2 h-5 w-5 transform rotate-180"
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
              ) : (
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
              )}
            </button>
            {showTypeDropdown && (
              <div className="py-1">
                {types.map((type) => (
                  <div className="m-1 hover:bg-slate-50 rounded" key={type.value}>
                    <label
                      className="flex cursor-pointer items-center justify-between px-4 py-2"
                    >
                      <span>{type.label}</span>
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        onChange={() =>
                          setSelectedTypeFilters((prevTypes) =>
                            prevTypes.includes(type.value)
                              ? prevTypes.filter((t) => t !== type.value)
                              : [...prevTypes, type.value]
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-4 overflow-x-auto">
          {columns.map((column) => (
            <div
              key={column}
              className="relative mx-2 min-w-[250px] flex-1 rounded-lg bg-white p-4 shadow-md"
              onDrop={(e) => handleDrop(e, column)}
              onDragOver={(e) => handleDragOver(e)}

            >
              <div className="statuses-center mb-2 flex justify-between">
                <h2 className="text-lg font-semibold">{column}</h2>
              </div>
              <div className="h-80 space-y-2 overflow-y-auto overflow-x-hidden">
                {statuses.map((task: any) =>
                  task.status === column ? (
                    <div
                      key={task.id}
                      className="bg-slate-100 border-box hover:shadow-lg p-2 rounded cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                      draggable="true"
                      onDrag={(e) => handleDragStart(e, task)}

                    // onDragStart={(e) => handleDragStart(e, task)}
                    // onDragEnd={(e) => handleDrop(e, column.id)}
                    >
                      <div className="font-bold">{task.name || task.label}</div>
                      {/* @ts-ignore */}
                      <div>{getTypeLabel(task.type).type}</div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="m-5 w-48 rounded-lg bg-blue-700 px-4 py-2 text-white shadow-lg"
        onClick={() => setShowForm(!showForm)}>
        Add Boards
      </button>


      {showForm && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Enter Board Name</h2>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board Name"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => addBoard(newBoardName)}
            >
              Add Board
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
              onClick={() => setShowForm(!showForm)}
            >
             Cancel
            </button>
          </div>
        </div>
      )}



    </DndProvider>
  );
}

export default ProjectBoards;
