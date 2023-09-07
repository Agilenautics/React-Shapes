import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field, ErrorMessage, useFormikContext  } from "formik";
import validationSchema from "./staticData/validationSchema";
import { Types } from "./staticData/types"
import { Statuses } from './staticData/statuses';
import { updateTaskMethod, updateTasksMutation } from '../../Flow/Nodes/gqlNodes';
import { initData2 } from './staticData/processedData';



export default function AddBacklogs({ types, statuses, users, setShowForm, selectedElement }: any) {

  const handleSubmit = (values: object) => {
    console.log("val",values);
    
    if(selectedElement.type != "file"){
      console.log(selectedElement.id);
      
      updateTaskMethod(selectedElement.id , updateTasksMutation , values)
    }
    selectedElement = {}

    setShowForm(false);
  };

  const handleCancel = () => {
    console.log("can");
    selectedElement = {}
    setShowForm(false);
  };


    // // Create a ref for the form element
    // const formikContext = useFormikContext();

    // // Add an event listener to the form element to capture the Enter key press
    // useEffect(() => {
    //   const handleKeyPress = (e: KeyboardEvent) => {
    //     if (e.key === "Enter") {
    //       e.preventDefault(); // Prevent the default form submission
    //       handleSubmit(formikContext.values); // Submit the form using Formik's submitForm function
    //     }
    //   };
  
    //   // Attach the event listener when the component mounts
    //   document.addEventListener("keydown", handleKeyPress);
  
    //   // Remove the event listener when the component unmounts
    //   return () => {
    //     document.removeEventListener("keydown", handleKeyPress);
    //   };
    // }, [formikContext]);

  return (
    <div className='p-6'>
<Formik
    initialValues={{
      type: selectedElement ? selectedElement.type : '', 
      name: selectedElement ? ( selectedElement.name || selectedElement.label) : '',
      description: selectedElement ? selectedElement.description : '', 
      status: selectedElement ? selectedElement.status : 'To-Do',
      assign: selectedElement ? selectedElement.user : '',
    }}
    validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              
              {({
            values
          }) => (
      <Form>
        <h5 className="mb-4 rounded bg-violet-300 p-2 text-xl font-bold shadow-lg">
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
                (status: Statuses) =>
                  status.label !== "All" && (
                    <option key={status.value} value={status.value}>
                      {status.label}
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
        {values.type != "file" && <div className="mb-4">
          <label htmlFor="story" className="block font-semibold">
            Story:
          </label>
          <Field
            as="select"
            name="story"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
          >
           <option value="">Select Story</option>
              {initData2.map((story: any) => (
                <option key={story.name} value={story.id}>
                  {story.name}
                </option>
              ))}
          </Field>
          <ErrorMessage
            name="story"
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
        <div className="mb-4 flex w-[500px] space-x-4">
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
            <Field
              as="textarea"
              name="discussion"
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
