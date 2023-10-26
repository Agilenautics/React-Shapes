import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { sprintValidationSchema } from './staticData/validationSchema';
import { useRouter } from 'next/router';
import sprintStore from '../../Sprints/sprintStore';
import { CREATE_SPRINT_MUTATION, createSPrintBackend } from '../../../gql';
import sprints from '../../../pages/projects/[projectId]/sprints';


export default function CreateSprint({ setShowForm,sprintCreateMessage }: any) {
  const router = useRouter();
  const  addSprint = sprintStore(state => state.addSprint);
  const updateError = sprintStore(state => state.updateError);
  const projectId = router.query.projectId as string | ""
  const handleSubmit = (values: any) => {
   const spr: any = createSPrintBackend(projectId, CREATE_SPRINT_MUTATION, values, addSprint,updateError,sprintCreateMessage,setShowForm)
  //  console.log(spr);
  //  if(spr){
  //   addSprint(values)
  //  }
   
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Formik
      initialValues={{
        type: "",
        name: "",
        description: "",
        status: "To-Do",
        assign: "",
        startDate: new Date().toISOString().substr(0, 10),
        endDate: "",
      }}
      validationSchema={sprintValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <h5 className="mb-4 rounded bg-violet-300 p-2 text-xl font-bold shadow-lg  dark:bg-bgdarkcolor">
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
          <div className="flex justify-between">
            <div className="mb-4 mt-2 w-1/2 pr-2">
              <label htmlFor="startDate" className="block font-semibold">
                Start Date:
              </label>
              <Field
                type="date"
                name="startDate"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:text-slate-600"
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="mt-1 text-red-500"
              />
            </div>
            <div className="mb-4 mt-2 w-1/2 pl-2">
              <label htmlFor="endDate" className="block font-semibold">
                End Date:
              </label>
              <Field
                type="date"
                name="endDate"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
              />
              <ErrorMessage
                name="endDate"
                component="div"
                className="mt-1 text-red-500"
              />
            </div>
          </div>
          {/* <div className="mb-4 mt-2">
            <label htmlFor="selectedBacklog" className="block font-semibold">
              Select Backlog:
            </label>
            <Field
              as="select"
              name="selectedBacklog"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
            >
              <option value="" label="Select a Backlog" />
              {objWithoutSprint.map((backlog: any) => (
                <option key={backlog.name||backlog.label} value={backlog.name||backlog.label}>
                  {backlog.name||backlog.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="selectedBacklog"
              component="div"
              className="mt-1 text-red-500"
            />
          </div> */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
            >
              Create
            </button>
            <button
              type="button"
              className="rounded-lg bg-white px-4 py-2 text-gray-700 dark:bg-blue-500 dark:text-white"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
