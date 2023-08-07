import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

const types = [
  { label: "Story", value: "file" },
  { label: "Task", value: "BrightBlueNode" },
  { label: "Sub-Task", value: "GreenNode" },
  { label: "Issue", value: "OrangeNode" },
  { label: "Bug", value: "RedNode" },
];

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  name: Yup.string().required("Name is required"),
});

function BacklogForm() {
    const router = useRouter();
    const projectId = router.query.projectId as string;



  const handleSubmit = () => {
    
  };

  const handleCancle = () =>{
     router.push(`/backlogs/${projectId}`)
  }



  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <Formik
          initialValues={{ type: "", name: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-4">
              <label htmlFor="type">Type:</label>
              <Field as="select" name="type" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
                <option value="">Select Type</option>
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="type" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="name">Name:</label>
              <Field
                type="text"
                name="name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              Add Backlog
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              onClick={handleCancle}
            >
              Cancel
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default BacklogForm;
