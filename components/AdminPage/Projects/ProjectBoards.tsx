import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import { FaEdit, FaTrash } from "react-icons/fa";
import initData from "./staticData/initData";

function ProjectBoards() {
  const [tasks, setTasks] = useState(initData);

  function getTypeLabel(type: string) {
    if (type == "file") {
      return "Story";
    } else if (type == "BrightBlueNode") {
      return "Task";
    } else if (type == "GreenNode") {
      return "Subtask";
    } else if (type == "OrangeNode") {
      return "Issue";
    } else if (type == "RedNode") {
      return "Bug";
    }
    return "Unknown";
  }

  let initData2 = [];
  let temproary = [];

  for (let i of tasks) {
    if (i.type == "folder") {
      //@ts-ignore
      for (let j of i.hasFiles) {
        initData2.push(j);
        if (j.status == "To-Do")
          temproary.push({
            type: j.type,
            name: j.name,
            description: j.description,
            status: "To-Do",
          });
        else if (j.status == "In-Progress")
          temproary.push({
            type: j.type,
            name: j.name,
            description: j.description,
            status: "In-Progress",
          });
        else
          temproary.push({
            type: j.type,
            name: j.name,
            description: j.description,
            status: "Completed",
          });
      }
    } else if (i.type == "file") {
      initData2.push(i);
      if (i.status == "To-Do")
        temproary.push({
          type: i.type,
          name: i.name,
          description: i.description,
          status: "To-Do",
        });
      else if (i.status == "In-Progress")
        temproary.push({
          type: i.type,
          name: i.name,
          description: i.description,
          status: "In-Progress",
        });
      else
        temproary.push({
          type: i.type,
          name: i.name,
          description: i.description,
          status: "Completed",
        });
    }
  }

  for (let i of initData2) {
    if (i.node) {
      for (let j of i.node) {
        if (j.status == "To-Do")
          temproary.push({
            type: j.type,
            name: j.label,
            description: j.description,
            status: "To-Do",
          });
        else if (j.status == "In-Progress")
          temproary.push({
            type: j.type,
            name: j.label,
            description: j.description,
            status: "In-Progress",
          });
        else
          temproary.push({
            type: j.type,
            name: j.label,
            description: j.description,
            status: "Completed",
          });
      }
    }
  }

  const [statuses, setStatuses] = useState(temproary);

  const [columns, setColumns] = useState([
    { id: "To-Do", title: "To Do" },
    { id: "In-Progress", title: "In Progress" },
    { id: "Completed", title: "Completed" },
  ]);

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
    const updatedStatus = statuses.map((task) => {
      if (task.name === taskId) {
        update(task, columnId);
      }
      return task;
    });
    setStatuses(updatedStatus);
  };

  // const handleAddColumn = () => {
  //   if (newColumnName.trim() !== "") {
  //     const newColumn = { id: newColumnName.toLowerCase(), title: newColumnName };
  //     setColumns([...columns, newColumn]);
  //     setNewColumnName("");
  //   }
  // };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-4">
        <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg">
          Kanban Board
        </h1>
        <div className="flex space-x-4 overflow-x-auto">
          {columns.map((column) => (
            <div
              key={column.id}
              className="relative mx-2 min-w-[250px] flex-1 rounded-lg bg-white p-4 shadow-md"
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{column.title}</h2>
              </div>
              <div className="h-80 space-y-2 overflow-y-auto overflow-x-hidden">
                {column.id === "To-Do" &&
                  statuses.map(
                    (task) =>
                      task.status == "To-Do" && (
                        <div
                          key={task.name}
                          className="cursor-pointer rounded-md bg-gray-100 p-2"
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                        >
                          <div className="mb-1 font-semibold">{task.name}</div>
                          <div className="text-xs">
                            {getTypeLabel(task.type)}
                          </div>
                        </div>
                      )
                  )}
                {column.id === "In-Progress" &&
                  statuses.map(
                    (task) =>
                      task.status == "In-Progress" && (
                        <div
                          key={task.name}
                          className="cursor-pointer rounded-md bg-gray-100 p-2"
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                        >
                          <div className="mb-1 font-semibold">{task.name}</div>
                          <div className="text-xs">
                            {getTypeLabel(task.type)}
                          </div>
                        </div>
                      )
                  )}
                {column.id === "Completed" &&
                  statuses.map(
                    (task) =>
                      task.status == "Completed" && (
                        <div
                          key={task.name}
                          className="cursor-pointer rounded-md bg-gray-100 p-2"
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                        >
                          <div className="mb-1 font-semibold">{task.name}</div>
                          <div className="text-xs">
                            {getTypeLabel(task.type)}
                          </div>
                        </div>
                      )
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
