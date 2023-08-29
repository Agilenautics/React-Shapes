
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
  });
  