import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Types } from "../AdminPage/Projects/staticData/types";

import {
  createNode,
  updateTaskMethod,
  newNode,
  updateTasksMutation,
  createFile,
  updateStoryMethod,
  updateStoryMutation,
  updateUidMethode,
  updateUidMutation,
  getSprintByProjectId,
  GET_SPRINTS,
  createFileMutation,
  getProjectById,
  updateFolderBackend,
  updateFoldersMutation,
  allNodes,
} from "../../gql";
import { useRouter } from "next/router";
import validationSchema from "../AdminPage/Projects/staticData/validationSchema";
import nodeStore from "../Flow/Nodes/nodeStore";
import backlogStore from "./backlogStore";
import sprintStore from "../Sprints/sprintStore";
import fileStore from "../TreeView/fileStore";
import Discussion from "./Discussion";
import { getTypeLabel } from "../AdminPage/Projects/staticData/basicFunctions";
import { RiArrowDropDownLine } from "react-icons/ri";
import userStore from "../AdminPage/Users/userStore";

export default function AddBacklogs({
  types,
  statuses,
  users,
  selectedElement,
  typeDropdown,
}: any) {
  const { addRow, updateRow, allStories, parents } = backlogStore();
  const { uid, idofUid, updateUid,Id:fileId } = fileStore();
  const userEmail = userStore((state)=>state.userEmail);


  // const {data,error,loading} = useQuery(getUidQuery);

  // sprint store
  const addTaskOrEpicOrStoryToSprint = sprintStore(
    (state) => state.addTaskOrEpicOrStoryToSprint
  );
  const updateSprints = sprintStore((state) => state.updateSprints);
  const sprints = sprintStore((state) => state.sprints);
  const router = useRouter();
  const projectId = router.query.projectId as string;
  

  const handleSubmit = async (values: any) => {
    const backToThePage = () => router.back();
    if (selectedElement != null) {
      values.uid = selectedElement.uid;
      values.id = selectedElement.id;
      values.parent = selectedElement.parent;
      switch (selectedElement.type) {
        case "file":
          updateStoryMethod(
            selectedElement.id,
            updateStoryMutation,
            values
          ).then((res) => {
            values.hasSprint = res.data.updateFiles.files[0].hasSprint;
            updateRow(values);
            backToThePage();
          });
          break;
        case "folder":
          const updatedvalues = { ...values, projectId };
          await updateFolderBackend(
            updatedvalues,
            updateFoldersMutation,
            getProjectById
          );
          backToThePage();
          break;
        default:
          updateTaskMethod(
            selectedElement.id,
            updateTasksMutation,
            values
          ).then((res) => {
            addTaskOrEpicOrStoryToSprint(
              values.addToSprint,
              res.data.updateFlowNodes.flowNodes
            );
            values.hasSprint = res.data.updateFlowNodes.flowNodes[0]?.hasSprint;
            updateRow(values);
            backToThePage();
          });
      }
    } else {
      values.uid = uid;
      if (values.type == "file") {
        if (values.epic == projectId)
          try {
            const createFileResponse = await createFile(
              projectId,
              values.epic,
              userEmail,
              createFileMutation,
              values,
              getProjectById
            );
            values.parent = values.epic;
            // values.id = createFileResponse.id;
            // values.uid = createFileResponse.uid;
            // values.sprint = createFileResponse.hasSprint;
            addRow(values);
            const updatedUidResponse = (await updateUidMethode(
              idofUid,
              updateUidMutation
            )) as any;
            updateUid(updatedUidResponse.data.updateUids.uids);
          } catch (error) {
            console.log(
              error,
              "while creating fileinmain in add backlogs page "
            );
          }
        else
          createFile(
            "",
            values.epic,
            userEmail,
            createFileMutation,
            getProjectById,
            values
          ).then(async (res) => {
            values.parent = values.epic;
            addRow(values);
            const updateUidRespon = (await updateUidMethode(
              idofUid,
              updateUidMutation
            )) as any;
            updateUid(updateUidRespon.data.updateUids.uids);
          });
      } else {
        try {
          await createNode(newNode, values,userEmail,allNodes,fileId);
          const updateUidRespon = (await updateUidMethode(
            idofUid,
            updateUidMutation
          )) as any;
          updateUid(updateUidRespon.data.updateUids.uids);
        } catch (error) {
          console.log(error, "while adding new node inside add baclogs page");
        }
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    getSprintByProjectId(projectId, GET_SPRINTS, updateSprints);
  }, []);
  // useEffect(() => {
  //   setType(selectedElement.type);
  // }, [selectedElement]);

  return (
    <div className="p-6">
      <Formik
        initialValues={{
          type: selectedElement ? selectedElement.type : "",
          name: selectedElement
            ? selectedElement.name || selectedElement.label
            : "",
          description: selectedElement ? selectedElement.description : "",
          status: selectedElement ? selectedElement.status : "To-Do",
          assignedTo: selectedElement ? selectedElement.assignedTo : "",
          sprint: selectedElement ? selectedElement.hasSprint?.id : "",
          epic: selectedElement ? selectedElement.parent.id : projectId,
          story:
            selectedElement && selectedElement.type !== "file"
              ? selectedElement.story?.id
              : "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <h5 className="mb-4 rounded bg-gray-200 p-2 text-xl font-bold shadow-lg">
              {selectedElement == null ? "Add Item" : "Update Item"}
            </h5>
            <div className="flex">
              <label
                htmlFor="name"
                className="block w-fit rounded p-2 text-sm hover:text-sky-600"
              >
                {selectedElement != null ? selectedElement.uid : "Name"}
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Title..."
                className="h-fit w-full rounded-lg px-2 text-2xl hover:border focus:outline-none"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-red-500"
              />
            </div>
            <div className="mb-2 flex w-fit">
              <label
                htmlFor="assignedTo"
                className="block w-fit rounded p-1 text-sm font-extralight hover:text-sky-600"
              >
                Assign :
              </label>
              <Field
                as="select"
                name="assignedTo"
                className="h-fit w-fit rounded-lg px-2 py-1 hover:border focus:outline-none"
              >
                {users.map(
                  (user: any) =>
                    user.emailId !== "All" && (
                      <option key={user.value} value={user.emailId}>
                        {user.emailId}
                      </option>
                    )
                )}
                <option value="invite">Invite User</option>
              </Field>
              <ErrorMessage
                name="assignedTo"
                component="div"
                className="mt-1 text-red-500"
              />

              <div className="ml-[40vw]">
                <button
                  type="submit"
                  className="mr-2 rounded-lg bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-white px-2 py-1 text-gray-700 hover:bg-gray-200"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex w-fit">
                <label
                  htmlFor="type"
                  className="block w-fit rounded p-1 text-sm hover:text-sky-600"
                >
                  Type :
                </label>
                <Field
                  as="select"
                  name="type"
                  className="h-fit w-40 rounded-lg px-2 py-1 hover:bg-gray-200 focus:outline-none"
                >
                  {typeDropdown ? (
                    <>
                      <option value="">Select Type</option>
                      {types.map((type: Types) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value={selectedElement.type}>
                      {getTypeLabel(selectedElement.type).type}
                    </option>
                  )}
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>
              <div className="flex w-fit">
                <label
                  htmlFor="status"
                  className="block w-fit rounded p-1 text-sm hover:text-sky-600"
                >
                  Status :
                </label>
                <Field
                  as="select"
                  initialValue="To-do"
                  name="status"
                  className="h-fit w-40 rounded-lg px-2 py-1 hover:bg-gray-200 focus:outline-none"
                >
                  {selectedElement == null && (
                    <option key={"To-Do"} value={"To-Do"}>
                      To-Do
                    </option>
                  )}
                  {selectedElement !== null &&
                    statuses.map(
                      (status: any) =>
                        status.label !== "All" && (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                    )}
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>
              <div>
                <label htmlFor="EstimatedTime">Estimated Time:</label>
                <Field
                  as="input"
                  name="EstimatedTime"
                  className="h-fit w-40 rounded-lg px-2 py-1 hover:bg-gray-200 focus:outline-none"
                ></Field>
              </div>
              <div className="flex w-fit">
                <label
                  htmlFor="sprint"
                  className="block w-fit rounded p-1 text-sm hover:text-sky-600"
                >
                  Add to Sprint :
                </label>
                <Field
                  as="select"
                  name="sprint"
                  className="h-fit w-40 rounded-lg px-2 py-1 hover:bg-gray-200 focus:outline-none"
                >
                  <option value="">Select Sprint</option>
                  {sprints.map((sprint: any) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="sprint"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>
              <div className="mb-2 flex space-x-4">
                {values.type !== "folder" && (
                  <>
                    {values.type != "file" ? (
                      <div className="mb-4 flex">
                        <label
                          htmlFor="story"
                          className="block w-fit rounded p-1 text-sm hover:text-sky-600"
                        >
                          Story :
                        </label>
                        <Field
                          as="select"
                          name="story"
                          className="h-fit w-40 rounded-lg px-2 py-1 hover:bg-gray-200 focus:outline-none"
                        >
                          <option value="">Select Story</option>
                          {allStories.map((story: any) => (
                            <option key={story.id} value={story.id}>
                              {story.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="story"
                          component="div"
                          className="mt-1 text-red-500"
                        />
                      </div>
                    ) : (
                      <div className="mb-2 flex">
                        <label
                          htmlFor="epic"
                          className="block w-fit rounded p-1 text-sm hover:text-sky-600"
                        >
                          Epic :
                        </label>
                        <Field
                          as="select"
                          name="epic"
                          className="h-fit w-40 rounded-lg px-2 py-1 hover:bg-gray-200 focus:outline-none"
                        >
                          {parents.map((epic: any) => (
                            <option key={epic.id} value={epic.id}>
                              {epic.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="epic"
                          component="div"
                          className="mt-1 text-red-500"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                <label htmlFor="EstimatedCost">Estimated Cost:</label>
                <Field
                  as="input"
                  name="EstimatedCost"
                  className="h-fit w-40 rounded-lg px-2 py-1 hover:bg-gray-200 focus:outline-none"
                ></Field>
              </div>
            </div>

            {/* if story require epic or project id else story */}
            <div className="mb-1 flex">
              <div>
                <div className="w-[50vw]">
                  <label
                    htmlFor="description"
                    className="block w-fit rounded p-1 font-semibold hover:text-sky-600"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Details..."
                    className="w-full rounded-lg px-4 py-2 hover:bg-gray-200 focus:outline-none"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-1 text-red-500"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="discussion"
                    className="block w-fit rounded p-1 font-semibold hover:text-sky-600"
                  >
                    Discussion
                  </label>
                  <Field
                    as="textarea"
                    name="discussion"
                    placeholder="Comments..."
                    className="w-full rounded-lg px-4 py-2 hover:bg-gray-200 focus:outline-none"
                  />
                  <ErrorMessage
                    name="discussion"
                    component="div"
                    className="mt-1 text-red-500"
                  />
                </div>
                {router.pathname !== "/projects/[projectId]/backlogs/add" && (
                  <Discussion comments={selectedElement.comment} />
                )}
              </div>

              {/* hard coded part */}
              <div className="m-2 border-l p-1">
                <div className="m-1 flex p-1">
                  <div className="w-fit">
                    <label
                      htmlFor="Planning"
                      className="flex w-fit rounded p-1 font-semibold hover:text-sky-600"
                    >
                      Planning <RiArrowDropDownLine className="m-1" />
                    </label>
                    <p className="hover:bg-gray-100">
                      Anything related to planning should be written here
                    </p>
                  </div>
                  <div className="w-fit">
                    <label
                      htmlFor="Deployment"
                      className="flex w-fit rounded p-1 font-semibold hover:text-sky-600"
                    >
                      Deployment <RiArrowDropDownLine className="m-1" />
                    </label>
                    <p className="hover:bg-gray-100">
                      Anything related to Deployment should be written here
                    </p>
                  </div>
                </div>
                <div className="m-1 flex p-1">
                  <div className="w-fit">
                    <label
                      htmlFor="Development"
                      className="flex w-fit rounded p-1 font-semibold hover:text-sky-600"
                    >
                      Development <RiArrowDropDownLine className="m-1" />
                    </label>
                    <p className="hover:bg-gray-100">
                      Anything related to Development should be written here
                    </p>
                  </div>
                  <div className="w-fit">
                    <label
                      htmlFor="Classification"
                      className="flex w-fit rounded p-1 font-semibold hover:text-sky-600"
                    >
                      Classification <RiArrowDropDownLine className="m-1" />
                    </label>
                    <p className="hover:bg-gray-100">
                      Anything related to Classification should be written here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
