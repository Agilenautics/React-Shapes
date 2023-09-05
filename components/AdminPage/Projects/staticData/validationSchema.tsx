
import * as Yup from "yup";
let validationSchema :any
export default validationSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    name: Yup.string()
      .required("Name is required")
      .matches(
        /^[a-zA-Z\s]{3,}$/,
        "Name must be more than two letters and contain only letters and spaces"
      ),
    description: Yup.string().required("Description is required"),
    status: Yup.string().required("Status is required"),
    startDate: Yup.date().required("Start Date is required"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be later than Start Date"),
    // assign:Yup.string().matches()
  });
  