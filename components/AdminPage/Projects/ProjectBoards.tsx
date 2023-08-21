import React, { useState } from "react";

function ProjectBoards() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", status: "todo" },
    { id: 2, title: "Task 2", status: "inprogress" },
    { id: 3, title: "Task 3", status: "done" },
  ]);

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  const handleDragStart = (e : any, task : any) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e : any) => {
    e.preventDefault();
  };

  const handleDrop = (e : any, columnId : string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const updatedTasks = tasks.map((task) =>
      task.id.toString() === taskId ? { ...task, status: columnId } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="absolute w-[1000px]">
      <h1 className="text-2xl font-bold m-2 bg-pink-300 w-32 p-3 rounded shadow-lg">Boards</h1>
    <div className="bg-lime-200 w-full h-full flex p-4 space-x-4">
      
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-1 bg-white rounded-lg p-4 shadow-md h-[300px]"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
          <div className="space-y-2">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-100 p-2 rounded-md cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  {task.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
    </div>

  );
}

export default ProjectBoards;
