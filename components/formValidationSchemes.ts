import * as Yup from 'yup'

export const addProjectScheme = Yup.object({
    name:Yup.string().min(3).max(15).required("*field required.")
})