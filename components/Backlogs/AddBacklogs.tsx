import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Types } from "../AdminPage/Projects/staticData/types"
import { createNode, newNode, updateTaskMethod, updateTasksMutation } from '../Flow/Nodes/gqlNodes';
import { createFileInFolder, createFileInMain, newFileInFolder, newFileInMain, updateStoryMethod, updateStoryMutation } from '../TreeView/gqlFiles';
import { useRouter } from 'next/router';
import validationSchema from '../AdminPage/Projects/staticData/validationSchema';
import nodeStore from '../Flow/Nodes/nodeStore';
import backlogStore from './backlogStore';
// import sprintStore from '../Sprints/sprintStore'
import { SPRINTS_FOR_BACKLOGS, getSprintToBacklogs, CONNECT_TO_STORY, connectToStory, getSprintByProjectId, GET_SPRINTS } from '../Sprints/gqlSprints';
import sprintStore from '../Sprints/sprintStore';



export default function AddBacklogs({ types, statuses, users, setShowForm, selectedElement }: any) {
  const addRow = backlogStore(state => state.addRow);
  const updateRow = backlogStore(state => state.updateRow);
  const allStories = backlogStore(state => state.allStories);
  const parents = backlogStore(state => state.parents);

  // sprint store
  const addTaskOrEpicOrStoryToSprint = sprintStore((state) => state.addTaskOrEpicOrStoryToSprint);
  const updateSprints = sprintStore((state) => state.updateSprints);
  const sprints = sprintStore((state) => state.sprints)

  const updateNode = nodeStore((state) => state.updateNodes);
  const formRef = useRef(null);
  const router = useRouter();



  const projectId = router.query.projectId as string;


  const handleSubmit = (values: any) => {
    if (selectedElement != null) {
      if (selectedElement.type != "file") {
        updateTaskMethod(selectedElement.id, updateTasksMutation, values)
          .then((res) => {
            addTaskOrEpicOrStoryToSprint(values.addToSprint, res.data.updateFlowNodes.flowNodes)
            values.parent = values.epic
            updateRow(values)
          });
      } else {
        updateStoryMethod(selectedElement.id, updateStoryMutation, values)
          .then(() => {
            values.parent = values.epic
            updateRow(values)
          });
      }
    } else {
      if (values.type == "file") {
        if (values.epic == projectId) createFileInMain(newFileInMain, values.epic, values)
          .then(() => {
            values.parent = values.epic
            addRow(values)
          });
        else createFileInFolder(newFileInFolder, values.epic, values)
          .then(() => {
            values.parent = values.epic
            addRow(values)
          });
      } else {
        createNode(newNode, updateNode, values, addRow)
      }
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getSprintByProjectId(projectId, GET_SPRINTS, updateSprints)
  }, [])





  return (
    <div className='p-6' ref={formRef}>
      <Formik
        initialValues={{
          type: selectedElement ? selectedElement.type : '',
          name: selectedElement ? (selectedElement.name || selectedElement.label) : '',
          description: selectedElement ? selectedElement.description : '',
          status: selectedElement ? selectedElement.status : 'To-Do',
          assign: selectedElement ? selectedElement.user : '',
          epic: selectedElement ? selectedElement.parent : projectId,
          story: selectedElement && selectedElement.type !== "file" ? selectedElement.story.id : ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >

        {({
          values
        }) => (
          <Form>
            <h5 className="mb-4 rounded bg-violet-300 p-2 text-xl font-bold shadow-lg">
              {selectedElement == null ? "Add Backlog" : "Update Backlog"}
            </h5>
            <div className="mb-4 flex space-x-4">
              <div className="w-full">
                <label htmlFor="type" className="block font-semibold">
                  Type:
                </label>
                <Field
                  as="select"
                  name="type"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                >
                  <option value="">Select Type</option>
                  {types.map((type: Types) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>


              <div className="w-full">
                <label htmlFor="status" className="block font-semibold">
                  Status:
                </label>
                <Field
                  as="select"
                  name="status"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                >
                  {statuses.map(
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
            </div>
            {/* if story require epic or project id else story */}
            {values.type != "file" ? <div className="mb-4">
              <label htmlFor="story" className="block font-semibold">
                Story:
              </label>
              <Field
                as="select"
                name="story"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
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
            </div> : <div className="mb-4">
              <label htmlFor="epic" className="block font-semibold">
                Epic:
              </label>
              <Field
                as="select"
                name="epic"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
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
            </div>}

            <div className="mb-4">
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
            <div className="mb-4">

              <div className="w-full">
                <label
                  htmlFor="description"
                  className="block font-semibold"
                >
                  Description:
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>
              <div className="w-full">
                <label htmlFor="discussion" className="block font-semibold">
                  Discussion:
                </label>
                <div className='p-1 my-2 flex gap-2'>
                  <div className='text-white bg-black rounded-full w-6 text-center'> I </div>
                  <div> Hi <b>@sandeep</b> Please check this task </div>
                  <div className='px-12'  > 4.30pm </div>

                </div>
                <Field
                  as="textarea"
                  name="discussion"
                  placeholder="comments.."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                />
                <ErrorMessage
                  name="discussion"
                  component="div"
                  className="mt-1 text-red-500"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
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
                name="assign"
                component="div"
                className="mt-1 text-red-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="addToSprint" className="block font-semibold">
                Add to Sprint:
              </label>
              <Field
                as="select"
                name="addToSprint"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
              >
                <option value="">Select Sprint</option>
                {sprints.map(
                  (sprint: any) =>
                  (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  )
                )}
              </Field>
              <ErrorMessage
                name="addToSprint"
                component="div"
                className="mt-1 text-red-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type='submit'
                className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
              >
                {selectedElement ? "Update Backlog" : "Add Backlog"}
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
        )}
      </Formik>
    </div>

  )
}
