import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useBackend from "../../TreeView/backend";
import fileStore from "../../TreeView/fileStore";
import { getTypeLabel } from "./staticData/basicFunctions";
import { types } from "./staticData/types";
import { processedData } from "./staticData/processedData";

function ProjectBoards() {
  const [tasks, setTasks] = useState([]);
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
  const [statuses, setStatuses] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [columns, setColumns] = useState([
    { id: "To-Do", title: "To Do" },
    { id: "In-Progress", title: "In Progress" },
    { id: "Completed", title: "Completed" },
  ]);
  // let backend = useBackend();
  let backend: any
   backend = fileStore(store=> store.data)
  const loading = fileStore((state) => state.loading);

  useEffect(() => {
    setTasks(backend.children);
    const mainData = processedData(backend.children);
    let filteredStatuses:any
     filteredStatuses = mainData.filter(
      (element) =>
        selectedTypeFilters.length === 0 ||
        selectedTypeFilters.includes(element.type)
    );
    setStatuses(filteredStatuses);
  }, [backend.children, selectedTypeFilters]);

  if (loading) {
    return <div>...loading</div>;
  }

  const handleDragStart = (e: any, task: any) => {
    e.dataTransfer.setData("taskId", task.name);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const update = (obj: any, col: string) => {
    obj.status = col;
    return obj;
  };

  const handleDrop = (e: any, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
     let updatedStatus:any
     updatedStatus = statuses.map((task:any) => {
      if (task.name || task.label === taskId) {
        return update(task, columnId);
      }
      return task;
    });

    setStatuses(updatedStatus);
  };

  // console.log(statuses);
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-4">
        <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg">
          Kanban Board
        </h1>
            <div className="relative inline-block text-left">
              <div className="bg-slate-100 rounded m-2 p-2 hover:shadow-lg">
              <button className="flex" onClick={()=>setShowTypeDropdown(!showTypeDropdown)}>Select type
              {showTypeDropdown ? 
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
              :
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
                    </svg>}
              
              </button>
              {showTypeDropdown && (
                  <div className="py-1">
                    {types.map((type) => (
                      <div className="m-1 hover:bg-slate-50 rounded">
                      <label
                        key={type.value}
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
              <div>
                {/* Code for other filters */}
              </div>
            </div>
        <div className="flex space-x-4 overflow-x-auto">
          {columns.map((column) => (
            <div
              key={column.id}
              className="relative mx-2 min-w-[250px] flex-1 rounded-lg bg-white p-4 shadow-md"
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="statuses-center mb-2 flex justify-between">
                <h2 className="text-lg font-semibold">{column.title}</h2>
              </div>
              <div className="h-80 space-y-2 overflow-y-auto overflow-x-hidden">
                {statuses.map(
                  (task:any) =>
                      task.status==column.id &&
                       <div className="bg-slate-100 border-box hover:shadow-lg p-2 rounded">
                      <div className="font-bold">{task.name||task.label}</div>
                      {/* @ts-ignore */}
                      <div>{getTypeLabel(task.type).type}</div>
                    </div>
                     
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default ProjectBoards;
