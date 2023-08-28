import React, { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useBackend from "../../TreeView/backend";
import fileStore from "../../TreeView/fileStore";



const types = [
  { label: "Story", value: "file" },
  { label: "Task", value: "BrightBlueNode" },
  { label: "Sub-Task", value: "GreenNode" },
  { label: "Issue", value: "OrangeNode" },
  { label: "Bug", value: "RedNode" },
];

const statuses = [
  { label: "All", value: "" },
  { label: "Todo", value: "To-Do" },
  { label: "In-Progress", value: "In-Progress" },
  { label: "Completed", value: "Completed" },
];

const users = [
  { label: "All", value: "" },
  { label: "User 1", value: "User 1" },
  { label: "User 2", value: "User 2" },
  { label: "User 3", value: "User 3" },
  { label: "User 4", value: "User 4" },
  { label: "User 5", value: "User 5" },

];

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  name: Yup.string()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]{3,}$/, "Name must be more than two letters and contain only letters and spaces"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
});

function ProjectBacklogs() {
  const backend = useBackend()


  
let initData: any[] = [];
initData = [
  {
    type: "folder",
    name: "epic 1",
    hasFiles: [
      {
        type: "file",
        name: "story 1",
        description: "This is one of the stories. This is one of the stories. This is one of the stories. This is one of the",
        status: "Completed",
        sprint: "Sprint 1",
        user: "User 1",
        node: []
      },
      {
        type: "file",
        name: "story 2",
        description: "story 2 description",
        status: "To-Do",
        user: "User 2",
        sprint: "Sprint 2",
        node: [
          {
            type: "BrightBlueNode",
            label: "node title 1",
            description: "node 1 description",
            user: "User 2",
            sprint: "Sprint 2",
            status: "To-Do"
          },
          {
            type: "GreenNode",
            label: "node title 2",
            description: "node 2 description",
            user: "User 2",
            sprint: "Sprint 2",
            status: "In-Progress"
          },
          {
            type: "RedNode",
            label: "node title 3",
            description: "node 3 description",
            user: "User 3",
            sprint: "Sprint 2",
            status: "Completed"
          }
        ]
      },
      {
        type: "file",
        name: "story 3",
        description: "story 3 description",
        user: "User 1",
        status: "To-Do",
        sprint: "Sprint 2",
        node: []
      },
      {
        type: "file",
        name: "story 4",
        description: "story 4 description",
        user: "User 4",
        status: "In-Progress",
        sprint: "Sprint 1",
        node: [
          {
            type: "OrangeNode",
            label: "node title 4",
            description: "node 4 description",
            user: "User 4",
            sprint: "Sprint 1",
            status: "To-Do"
          },
          {
            type: "BrightBlueNode",
            label: "node title 5",
            description: "node 5 description",
            user: "User 5",
            sprint: "Sprint 1",
            status: "In-Progress"
          }
        ]
      },
    ]
  },
  {
    type: "folder",
    name: "epic 2",
    hasFiles: [
      {
        type: "file",
        name: "story 5",
        description: "story 5 description",
        user: "User 2",
        status: "To-Do",
        sprint: "Sprint 1",
        node: []
      },
      {
        type: "file",
        name: "story 6",
        description: "story 6 description",
        user: "User 5",
        status: "Completed",
        node: [
          {
            type: "BrightBlueNode",
            label: "node title 6",
            description: "node 6 description",
            user: "User 3",
            sprint: "Sprint 1",
            status: "In-Progress"
          }
        ]
      },
      {
        type: "file",
        name: "story 7",
        description: "story 7 description",
        user: "User 4",
        status: "Completed",
        sprint: "Sprint 1",
        node: []
      },
    ]
  },
  {
    type: "file",
    name: "story 8",
    description: "story 8 description",
    user: "User 1",
    sprint: "Sprint 1",
    status: "In-Progress",
    node: [
      {
        type: "RedNode",
        label: "node title 7",
        description: "node 7 description",
        user: "User 1",
        status: "To-Do"
      }
    ]
  }
]

let items: {
  label: string;
  parent: string;
  type: string;
  description: string;
  status: string;
  sprint: string;
  user: string;
}[] = [];



for (let i of initData) {
  if (i.type === "folder") {
    if (i.hasFiles.length !== 0) {
      for (let j of i.hasFiles) {
        items.push({
          label: j.name,
          parent: i.name,
          description: j.description,
          type: "file",
          status: j.status,
          sprint: j.sprint,
          user: j.user,
        });

        if (j.node && j.node.length > 0) {
          for (let node of j.node) {
            items.push({
              label: node.label,
              parent: j.name,
              description: node.description,
              type: node.type,
              status: node.status,
              sprint: j.sprint,
              user: j.user,
            });
          }
        }
      }
    }
  } else if (i.type === "file") {
    items.push({
      label: i.name,
      parent: "no parent",
      description: i.description,
      type: "file",
      status: i.status,

      sprint: i.sprint,
      user: i.user,
    });

    if (i.node && i.node.length > 0) {
      for (let node of i.node) {
        items.push({
          label: node.label,
          parent: i.name,
          description: node.description,
          type: node.type,
          status: node.status,

          sprint: i.sprint,
          user: i.user,
        });
      }
    }
  }
}



  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const projectId = router.query.projectId as string;

  
  const loading = fileStore((state) => state.loading);


  const handleSubmit = (values: object) => {
    //@ts-ignore     
    if (values.assign === "invite") {
      //@ts-ignore 
      console.log("Inviting user:", values.assign);
    } else {
      console.log("Submitting form:", values);
    }
    setShowForm(!showForm);
  };

  const handleCancel = () => {
    setShowForm(!showForm);
  };


  const filteredData = items.filter(
    (element) =>
      (element.label.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTypes.length === 0 || selectedTypes.includes(element.type)) &&
      (selectedStatus === "" || element.status === selectedStatus) &&
      (selectedUser === "" || element.user === selectedUser) &&
      (selectedSprint === "" || element.sprint === selectedSprint)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-200";
      case "In-Progress":
        return "bg-blue-200";
      case "To-Do":
        return "bg-red-200";
      default:
        return "";
    }
  };

  if (loading) {
    return <div> ......loading </div>
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold m-2 bg-pink-300 w-32 p-3 rounded shadow-lg">Backlogs</h1>
      <div className="bg-white rounded-lg shadow-md mr-5 m-1 overflow-x-auto">
        <div className="flex items-center justify-between m-1">
          <input
            type="text"
            placeholder="Search by name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none m-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <div className="relative inline-block text-left">
              <div>
                <span className="rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown((prevState) => !prevState)}
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Select Types
                    <svg
                      className="w-5 h-5 ml-2 -mr-1"
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
                  </button>
                </span>
              </div>
              {showTypeDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                  <div className="py-1">
                    {types.map((type) => (
                      <label
                        key={type.value}
                        className="flex items-center justify-between px-4 py-2 cursor-pointer"
                      >
                        <span>{type.label}</span>
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          checked={selectedTypes.includes(type.value)}
                          onChange={() =>
                            setSelectedTypes((prevTypes) =>
                              prevTypes.includes(type.value)
                                ? prevTypes.filter((t) => t !== type.value)
                                : [...prevTypes, type.value]
                            )
                          }
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <label>Status :</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <label>User :</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.value} value={user.value}>
                  {user.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-fill overflow-y overflow-x-hidden h-60">
          <table className="w-[1000px] table-auto mr-4">
            <thead>
              <tr>
                <th className="py-2 px-1 bg-gray-200 border">Type</th>
                <th className="py-2 px-1 bg-gray-200 border">Name</th>
                <th className="py-2 px-1 bg-gray-200 border">Description</th>
                <th className="py-2 px-1 bg-gray-200 border">Parent</th>
                <th className="py-2 px-1 bg-gray-200 border">Status</th>
                <th className="py-2 px-1 bg-gray-200 border">Sprint</th>
                <th className="py-2 px-1 bg-gray-200 border">User</th>
              </tr>
            </thead>
            <tbody>
              {/* {JSON.stringify(filteredData)} */}
              {filteredData.map((element, index) => (
                <tr key={index} className="border-b py-1">
                  {/* @ts-ignore */}
                  <td className={`py-2 px-1 ${getTypeLabel(element.type).color} rounded-lg text-center text-grey border`}>{getTypeLabel(element.type).type}</td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.label}</td>
                  <td className="py-2 px-1 rounded-lg text-center border break-all description-cell w-[400px]">
                    {element.description}
                  </td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.parent}</td>
                  <td className={`py-2 px-1 ${getStatusColor(element.status)} rounded-lg text-center text-grey border`}>{element.status}</td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.sprint ? element.sprint : "not added"}</td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className="px-4 py-2 bg-blue-700 text-white rounded-lg m-5 w-48 shadow-lg"
        onClick={() => setShowForm(!showForm)}
      >
        Add backlog +
      </button>
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
                  Add Backlog
                </h5>
                <div className="mb-4 flex space-x-4">
                  <div className="w-full">
                    <label htmlFor="type" className="block font-semibold">
                      Type:
                    </label>
                    <Field
                      as="select"
                      name="type"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    >
                      <option value="">Select Type</option>
                      {types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-red-500 mt-1" />
                  </div>

                  <div className="w-full">
                    <label htmlFor="status" className="block font-semibold">
                      Status:
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    >
                      {statuses.map((status) => (
                        status.label !== "All" && (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        )
                      ))}
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-red-500 mt-1" />
                  </div>
                </div>

                <div className="mb-4">
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
                <div className="mb-4 w-[500px] flex space-x-4">
                  <div className="w-full">
                    <label htmlFor="description" className="block font-semibold">
                      Description:
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="discussion" className="block font-semibold">
                      Discussion:
                    </label>
                    <Field
                      as="textarea"
                      name="discussion"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    <ErrorMessage
                      name="discussion"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="assign" className="block font-semibold">
                    Assign:
                  </label>
                  <Field
                    as="select"
                    name="assign"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      user.label !== "All" && (
                        <option key={user.value} value={user.value}>
                          {user.label}
                        </option>
                      )
                    ))}
                    <option value="invite">Invite User</option>
                  </Field>
                  <ErrorMessage name="assign" component="div" className="text-red-500 mt-1" />
                </div>
                <div className="mb-4">
                  <label htmlFor="addToSprint" className="block font-semibold">
                    Add to Sprint:
                  </label>
                  <Field
                    as="select"
                    name="addToSprint"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  >
                    <option value="">Select Sprint</option>
                    {/* You can map over your sprints and generate options here */}
                  </Field>
                  <ErrorMessage
                    name="addToSprint"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
                  >
                    Add Backlog
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
      {/* TODO ======================================> Sprints */}
      {/* <h1 className="text-2xl font-bold m-2 bg-pink-300 w-32 p-3 rounded shadow-lg">Sprints</h1>
    <div className="bg-white rounded-lg shadow-md mr-5 m-1 overflow-x-auto">
      <div className="flex items-center justify-between m-1">
      <input
        type="text"
        placeholder="Search by name"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none m-1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex items-center space-x-4">
          <div className="relative inline-block text-left">
            <div>
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown((prevState) => !prevState)}
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Select Types
                  <svg
                    className="w-5 h-5 ml-2 -mr-1"
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
                </button>
              </span>
            </div>
            {showTypeDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                <div className="py-1">
                  {types.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center justify-between px-4 py-2 cursor-pointer"
                    >
                      <span>{type.label}</span>
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() =>
                          setSelectedTypes((prevTypes) =>
                            prevTypes.includes(type.value)
                              ? prevTypes.filter((t) => t !== type.value)
                              : [...prevTypes, type.value]
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        <label>Status :</label>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <label>User :</label>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <option key={user.value} value={user.value}>
                {user.label}
              </option>
            ))}
          </select>
      </div>
    </div>
    <div className="w-fill overflow-y overflow-x-hidden h-60">
          <table className="w-[1000px] table-auto mr-4">
            <thead>
              <tr>
                <th className="py-2 px-1 bg-gray-200 border">Type</th>
                <th className="py-2 px-1 bg-gray-200 border">Name</th>
                <th className="py-2 px-1 bg-gray-200 border">Description</th>
                <th className="py-2 px-1 bg-gray-200 border">Parent</th>
                <th className="py-2 px-1 bg-gray-200 border">Status</th>
                <th className="py-2 px-1 bg-gray-200 border">Due</th>
                <th className="py-2 px-1 bg-gray-200 border">User</th>
              </tr>
            </thead>
            <tbody>
              
              {filteredData.map((element, index) => (
                <tr key={index} className="border-b py-1">
                 
                  <td className={`py-2 px-1 ${getTypeLabel(element.type).color} rounded-lg text-center text-grey border`}>{getTypeLabel(element.type).type}</td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.label}</td>
                  <td className="py-2 px-1 rounded-lg text-center border break-all description-cell w-[400px]">
  {element.description}
</td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.parent}</td>
                  <td className={`py-2 px-1 ${getStatusColor(element.status)} rounded-lg text-center text-grey border`}>{element.status}</td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.due}</td>
                  <td className="py-2 px-1 rounded-lg text-center border">{element.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

    </div>

  );
}

function getTypeLabel(type: string) {
  switch (type) {
    case "file":
      return { type: "Story", color: "bg-purple-200" };
    case "BrightBlueNode":
      return { type: "Task", color: "bg-blue-200" };
    case "GreenNode":
      return { type: "Sub-Task", color: "bg-green-200" };
    case "OrangeNode":
      return { type: "Issue", color: "bg-orange-200" };
    case "RedNode":
      return { type: "Bug", color: "bg-red-200" };
    default:
      return "";
  }
}

export default ProjectBacklogs;
