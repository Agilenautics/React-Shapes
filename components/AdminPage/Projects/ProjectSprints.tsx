import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
 import * as Yup from "yup";


let initData: any[] = [];
initData =  [
  {type:"folder",
  name: "epic 1",
  hasFiles : [
    {type:"file",
    name: "story 1",
    description : "This is one of the stories. This is one of the stories. This is one of the stories. This is one of the",
    status : "Completed",
    sprint : "Sprint 1",
    user: "User 1",
  node : []},
  {type:"file",
  name: "story 2",
  description : "story 2 description",
  status : "To-Do",
  user: "User 2",
  sprint : "Sprint 2",
  node : [
    {type : "BrightBlueNode",
  label : "node title 1",
  description : "node 1 description",
  user: "User 2",
  sprint : "Sprint 2",
  status : "To-Do"},
  {type : "GreenNode",
  label : "node title 2",
  description : "node 2 description",
  user: "User 2",
  sprint : "Sprint 2",
  status : "In-Progress"},
  {type : "RedNode",
  label : "node title 3",
  description : "node 3 description",
  user: "User 3",
  sprint : "Sprint 2",
  status : "Completed"}
  ]},
  {type:"file",
  name: "story 3",
  description : "story 3 description",
  user: "User 1",
  status : "To-Do",
  sprint : "Sprint 2",
  node : []},
  {type:"file",
  name: "story 4",
  description : "story 4 description",
  user: "User 4",
  status : "In-Progress",
  sprint : "Sprint 1",
  node : [
    {type : "OrangeNode",
  label : "node title 4",
  description : "node 4 description",
  user: "User 4",
  sprint : "Sprint 1",
  status : "To-Do"},
  {type : "BrightBlueNode",
  label : "node title 5",
  description : "node 5 description",
  user: "User 5",
  sprint : "Sprint 1",
  status : "In-Progress"}
  ]},
  ]
  },
  {type:"folder",
  name: "epic 2",
  hasFiles : [
    {type:"file",
    name: "story 5",
    description : "story 5 description",
    user: "User 2",
    status : "To-Do",
    sprint : "Sprint 1",
  node : []},
  {type:"file",
  name: "story 6",
  description : "story 6 description",
  user: "User 5",
  status : "Completed",
  node : [
    {type : "BrightBlueNode",
  label : "node title 6",
  description : "node 6 description",
  user: "User 3",
  sprint : "Sprint 1",
  status : "In-Progress"}
  ]},
  {type:"file",
  name: "story 7",
  description : "story 7 description",
  user: "User 4",
  status : "Completed",
  sprint : "Sprint 1",
  node : []},
  ]
  },
  {type:"file",
  name: "story 8",
  description : "story 8 description",
  user: "User 1",
  sprint : "Sprint 1",
  status : "In-Progress",
  node : [
    {type : "RedNode",
  label : "node title 7",
  description : "node 7 description",
  user: "User 1",
  status : "To-Do"}
  ]
  }
]

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  name: Yup.string()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]{3,}$/, "Name must be more than two letters and contain only letters and spaces"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
});

function ProjectSprints() {
  const sprintsData = initData.reduce((acc, epic) => {
    epic.hasFiles &&
      epic.hasFiles.forEach((file:any) => {
        if (file.sprint) {
          if (!acc[file.sprint]) {
            acc[file.sprint] = [];
          }
          acc[file.sprint].push({ epicName: epic.name, ...file });
        }
      });
    return acc;
  }, {});

  const [filesAndNodesWithoutSprint, setFilesAndNodesWithoutSprint] = useState(
    initData.flatMap((epic) =>
    epic.hasFiles != undefined &&
      epic.hasFiles.filter((file:any) => !file.sprint).map((file:any) => ({
        epicName: epic.name,
        fileName: file.name,
      }))
    )
  );

  const [showForm, setShowForm] = useState(false)


const handleSubmit = ()=>{
  console.log("submitted");
  
}

  const handleCancel = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="absolute w-fit ml-3">
      <h1 className="text-2xl font-bold m-2 bg-pink-300 w-32 p-3 rounded shadow-lg">
        Sprints
      </h1>

      <button
        onClick={() => {
setShowForm(true)
        }}
        className="bg-green-500 text-white px-4 py-2 rounded mt-3 hover:bg-green-600"
      >
        Create Sprint
      </button>
     


      {Object.keys(sprintsData).map((sprintName) => (
        <div className="w-fill overflow-y overflow-x-hidden h-60 mb-5 border rounded shadow-lg">
          <h2 className="text-xl font-semibold">{sprintName}</h2>
        <table className="w-[1000px] table-auto mr-4">
            <thead>
              <tr className="bg-gray-100">
              <th className="py-2 px-1 bg-gray-200 border">Type</th>
                <th className="py-2 px-1 bg-gray-200 border">Name</th>
                <th className="py-2 px-1 bg-gray-200 border">Description</th>
                <th className="py-2 px-1 bg-gray-200 border">Status</th>
                <th className="py-2 px-1 bg-gray-200 border">Parent</th>
                <th className="py-2 px-1 bg-gray-200 border">User</th>
                <th className="py-2 px-1 bg-gray-200 border">Due Date</th> 
              </tr>
            </thead>
            <tbody>
              {sprintsData[sprintName].map((item:any) => (
                <React.Fragment key={item.name}>
                  <tr className="border-b">
                  <td className="py-2 px-1 rounded-lg text-center border">{item.type=="file"&& "Story"}</td>
                    <td className="py-2 px-1 rounded-lg text-center border">{item.name}</td>
                    <td className="py-2 px-1 rounded-lg text-center border break-all description-cell w-[400px]">{item.description}</td>
                    <td className="py-2 px-1 rounded-lg text-center border">{item.status}</td>
                    <td className="py-2 px-1 rounded-lg text-center border">{item.epicName}</td>
                    <td className="py-2 px-1 rounded-lg text-center border">{item.user}</td>
                    <td className="py-2 px-1 rounded-lg text-center border">{item.dueDate}</td> 
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
              {showForm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <Formik
        initialValues={{
          type: "",
          name: "",
          description: "",
          status: "To-Do",
          assign: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <h5 className="text-xl font-bold mb-4 bg-violet-300 p-2 rounded shadow-lg">
          Create New Sprint
          </h5>
          <div className="mb-4 mt-2">
            <label htmlFor="name" className="block font-semibold">
              Name:
            </label>
            <Field
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              Create
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  </div>
)}
    </div>
  );
}

export default ProjectSprints;