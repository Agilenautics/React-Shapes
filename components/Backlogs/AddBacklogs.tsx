import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Types } from '../AdminPage/Projects/staticData/types';
import {
  createNode,
  newNode,
  updateTaskMethod,
  updateTasksMutation,
} from '../Flow/Nodes/gqlNodes';
import {
  createFileInFolder,
  createFileInMain,
  newFileInFolder,
  newFileInMain,
  updateStoryMethod,
  updateStoryMutation,
  updateUidMethode,
  updateUidMutation,
} from '../TreeView/gqlFiles';
import { useRouter } from 'next/router';
import validationSchema from '../AdminPage/Projects/staticData/validationSchema';
import nodeStore from '../Flow/Nodes/nodeStore';
import backlogStore from './backlogStore';
import {
  SPRINTS_FOR_BACKLOGS,
  getSprintToBacklogs,
  CONNECT_TO_STORY,
  connectToStory,
  getSprintByProjectId,
  GET_SPRINTS,
} from '../Sprints/gqlSprints';
import sprintStore from '../Sprints/sprintStore';
import fileStore from '../TreeView/fileStore';


export default function AddBacklogs({
  types,
  statuses,
  users,
  selectedElement,
  typeDropdown,
}: any) {
  const addRow = backlogStore((state) => state.addRow);
  const updateRow = backlogStore((state) => state.updateRow);
  const allStories = backlogStore((state) => state.allStories);
  const parents = backlogStore((state) => state.parents);
  const idofUid = fileStore(state => state.idofUid);
  const uid = fileStore(state => state.uid);
  const updateUid = fileStore((state) => state.updateUid)

  // sprint store
  const addTaskOrEpicOrStoryToSprint = sprintStore(
    (state) => state.addTaskOrEpicOrStoryToSprint
  );
  const updateSprints = sprintStore((state) => state.updateSprints);
  const sprints = sprintStore((state) => state.sprints);

  const updateNode = nodeStore((state) => state.updateNodes);
  const router = useRouter();

  const projectId = router.query.projectId as string;

  const handleSubmit = async (values: any) => {
    if (selectedElement != null) {
      if (selectedElement.type != 'file') {
        updateTaskMethod(selectedElement.id, updateTasksMutation, values).then(
          (res) => {
            addTaskOrEpicOrStoryToSprint(
              values.addToSprint,
              res.data.updateFlowNodes.flowNodes
            );
            values.parent = values.epic;
            updateRow(values);
          }
        );
      } else {
        updateStoryMethod(selectedElement.id, updateStoryMutation, values).then(
          () => {
            values.parent = values.epic;
            updateRow(values);
          }
        );
      }
    } else {
      values.uid = uid

      if (values.type == 'file') {
        if (values.epic == projectId)
          try {
            const createFileResponse = await createFileInMain(newFileInMain, values.epic, values);
            console.log(createFileResponse, "file")
            const updatedUidResponse = await updateUidMethode(idofUid, updateUidMutation);
            // @ts-ignore
            updateUid(updatedUidResponse.data.updateUids.uids)

          } catch (error) {
            console.log(error, "while creating fileinmain in add backlogs page ")
          }
        // createFileInMain(newFileInMain, values.epic, values).then(() => {
        //   values.parent = values.epic;
        //    updateUidMethode(idofUid,updateUidMutation).then(res =>{
        //     console.log(res,"updatedUid");
        //    })
        //   addRow(values);
        // });
        else
          createFileInFolder(newFileInFolder, values.epic, values).then(() => {
            values.parent = values.epic;
            addRow(values)
           const updateUidRespon =  updateUidMethode(idofUid, updateUidMutation) as any;
           updateUid(updateUidRespon.data.updateUids.uids)
            
          });
      } else {
        try {
          await createNode(newNode, updateNode, values, addRow);
          const updateUidRespon = await updateUidMethode(idofUid, updateUidMutation) as any;
          updateUid(updateUidRespon.data.updateUids.uids);
        }
        catch (error) {
          console.log(error, "while adding new node inside add baclogs page")
        }


        // createNode(newNode, updateNode, values, addRow).then(() => {
        //   updateUidMethode(idofUid, updateUidMutation);
        // })
      }
    }
    router.push({
      pathname: `/projects/${projectId}/backlogs/`,
    });
  };

  const handleCancel = () => {
    router.push({
      pathname: `/projects/${projectId}/backlogs/`,
    });
  };

  useEffect(() => {
    getSprintByProjectId(projectId, GET_SPRINTS, updateSprints);
  }, []);

  console.log(uid, "uid")

  return (
    <div className="p-6">
      <Formik
        initialValues={{
          type: selectedElement ? selectedElement.type : '',
          name: selectedElement ? selectedElement.name || selectedElement.label : '',
          description: selectedElement ? selectedElement.description : '',
          status: selectedElement ? selectedElement.status : 'To-Do',
          assign: selectedElement ? selectedElement.user : '',
          epic: selectedElement ? selectedElement.parent : projectId,
          story:
            selectedElement && selectedElement.type !== 'file'
              ? selectedElement.story.id
              : '',
        }}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <h5 className="mb-4 rounded bg-violet-300 p-2 text-xl font-bold shadow-lg">
              {selectedElement == null ? 'Add Backlog' : 'Update Backlog'}
            </h5>
            <div className="mb-4 flex space-x-4">
              {typeDropdown && (
                <div className="w-full">
                  <label htmlFor="type" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                    Type
                  </label>
                  <Field
                    as="select"
                    name="type"
                    className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
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
              )}
              <div className="w-full">
                <label htmlFor="status" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                  Status
                </label>
                <Field
                  as="select"
                  name="status"
                  className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
                >
                  {statuses.map(
                    (status: any) =>
                      status.label !== 'All' && (
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
            <div className="mb-4 flex space-x-4">
              <div className="mb-4 w-full">
                <label htmlFor="assign" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                  Assign
                </label>
                <Field
                  as="select"
                  name="assign"
                  className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
                >
                  {users.map(
                    (user: any) =>
                      user.emailId !== 'All' && (
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
              <div className="mb-4 w-full">
                <label htmlFor="addToSprint" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                  Add to Sprint
                </label>
                <Field
                  as="select"
                  name="addToSprint"
                  className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
                >
                  <option value="">Select Sprint</option>
                  {sprints.map((sprint: any) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="addToSprint"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>
            </div>
            {/* if story require epic or project id else story */}
            {values.type != 'file' ? (
              <div className="mb-4">
                <label htmlFor="story" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                  Story
                </label>
                <Field
                  as="select"
                  name="story"
                  className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
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
              <div className="mb-4">
                <label htmlFor="epic" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                  Epic
                </label>
                <Field
                  as="select"
                  name="epic"
                  className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
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

            <div className="mb-4">
              <label htmlFor="name" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                Name
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Title..."
                className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-red-500"
              />
            </div>
            <div className="mb-4">
              <div className="w-full">
                <label htmlFor="description" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Details..."
                  className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>
              <div className="w-full">
                <label htmlFor="discussion" className="block underline rounded p-1 w-fit font-semibold hover:bg-sky-100 hover:text-blue-900">
                  Discussion
                </label>
                <div className="p-1 my-2 flex gap-2">
                </div>
                <Field
                  as="textarea"
                  name="discussion"
                  placeholder="Comments..."
                  className="w-full rounded-lg px-4 py-2 focus:outline-none hover:bg-gray-200"
                />
                <ErrorMessage
                  name="discussion"
                  component="div"
                  className="mt-1 text-red-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                {selectedElement ? 'Update Backlog' : 'Add Backlog'}
              </button>
              <button
                type="button"
                className="rounded-lg bg-white px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}