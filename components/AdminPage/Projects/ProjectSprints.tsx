import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import initData from "./staticData/initData";


const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  name: Yup.string()
    .required("Name is required")
    .matches(
      /^[a-zA-Z\s]{3,}$/,
      "Name must be more than two letters and contain only letters and spaces"
    ),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
});



function ProjectSprints() {
  const sprintsData = initData.reduce((acc, epic) => {
    epic.hasFiles &&
      epic.hasFiles.forEach((file) => {
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
    initData.flatMap(
      (epic) =>
        epic.hasFiles != undefined &&
        epic.hasFiles
          .filter((file: any) => !file.sprint)
          .map((file: any) => ({
            epicName: epic.name,
            fileName: file.name,
          }))
    )
  );

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    console.log("submitted");
  };

  const handleCancel = () => {
    setShowForm(!showForm);
  };

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
                <th className="border bg-gray-200 px-1 py-2">Parent</th>
                <th className="border bg-gray-200 px-1 py-2">User</th>
                <th className="border bg-gray-200 px-1 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {sprintsData[sprintName].map((item: any) => (
                <React.Fragment key={item.name}>
                  <tr className="border-b">
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.type == "file" && "Story"}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.name}
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
                <h5 className="mb-4 rounded bg-violet-300 p-2 text-xl font-bold shadow-lg">
                  Create New Sprint
                </h5>
                <div className="mb-4 mt-2">
                  <label htmlFor="name" className="block font-semibold">
                    Name:
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="mt-1 text-red-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-white px-4 py-2 text-gray-700"
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
