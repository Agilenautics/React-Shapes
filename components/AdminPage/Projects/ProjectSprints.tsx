import React, { useState } from "react";

import initData from "./staticData/initData";
import CreateSprint from "./CreateSprint";
import { processedData } from "./staticData/processedData";
import { getTypeLabel } from "./staticData/basicFunctions";



function ProjectSprints() {

  const data = processedData(initData)
  

  // const [sprintsData, setSprintsData] = useState({});
let sprintsData: any[] = []

const objWithoutSprint : any[] = []
  data.map(element=>{
    if(element.sprint){      
      let elementSprint = element.sprint
       if(sprintsData[elementSprint]){
        sprintsData[elementSprint].push(element)
       }else sprintsData[elementSprint] = [element]
    }else{
      objWithoutSprint.push(element)
    }
  })
  

  const [showForm, setShowForm] = useState(false);


  return (
    <div className="absolute ml-3 w-fit">
      <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg">
        Sprints
      </h1>

      <button
        onClick={() => {
          setShowForm(true);
        }}
        className="mt-3 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Create Sprint
      </button>

      {Object.keys(sprintsData).map((sprintName, index) => (
        <div
          key={index}
          className="w-fill overflow-y mb-5 h-60 overflow-x-hidden rounded border shadow-lg"
        >
          <h2 className="text-xl font-semibold">{sprintName}</h2>
          <table className="mr-4 w-[1000px] table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border bg-gray-200 px-1 py-2">Type</th>
                <th className="border bg-gray-200 px-1 py-2">Name</th>
                <th className="border bg-gray-200 px-1 py-2">Description</th>
                <th className="border bg-gray-200 px-1 py-2">Status</th>
                <th className="border bg-gray-200 px-1 py-2">Epic</th>
                <th className="border bg-gray-200 px-1 py-2">User</th>
                <th className="border bg-gray-200 px-1 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {sprintsData[sprintName].map((item: any) => (
                <React.Fragment key={item.name}>
                  <tr className="border-b">
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {getTypeLabel(item.type).type}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.name||item.label}
                    </td>
                    <td className="description-cell w-[400px] break-all rounded-lg border px-1 py-2 text-center">
                      {item.description}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.status}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.epicName}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.user}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.dueDate}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <CreateSprint setShowForm={setShowForm} objWithoutSprint={objWithoutSprint}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSprints;
