import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
  assign: Yup.string().email(),
  story: Yup.string().when("type", (type, schema) => {
    //@ts-ignore
    if(type != "file")
      return schema.required("Must enter Story")
    return schema
  }), epic: Yup.string().when('type', (type, schema) => {
    //@ts-ignore
    if (type === 'file') return schema.required('Must enter Epic');
    return schema;
  }),
});

export default validationSchema;

export const sprintValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  endDate: Yup.date().required("End date is required").min(new Date(), "End date cannot be before the current date"),
  startDate : Yup.date().required("Start date is required")
});
