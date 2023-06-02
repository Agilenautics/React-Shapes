import Project from "./modules/projectModel"
import User from "./modules/usersModel"

const resolvers = {
    Query: {
        // @ts-ignore
        projects: async (parent: any, {email}:Object) => {
            const projects = await Project.find({})
            return projects
        },
        getUsers: async () => {
            return await User.find({})
        }
    },
    Mutation: {
        // @ts-ignore
        createProject: async (_: Object, { newProject }: Object) => {
            const { name, description, userName, isOpen } = newProject
            if (!name) {
                throw new Error("field required.")
            }
            const [existingProject] = await Project.find({
                where: {
                    name,
                },
            });
            if (existingProject) {
                throw new Error("project already exists.")
            }


            const project = await Project.create({
                input: [
                    {
                        name,
                        description,
                        userName,
                        isOpen
                    }
                ]
            })
            return newProject
        },
        // @ts-ignore
        updateProject: async (_: Object, { projectData }: Object) => {
            const { name, description, id, userName, isOpen } = projectData
            if (!name) {
                throw new Error("field required.")
            }

            const [existingProject] = await Project.update({
                where: {
                    name
                }
            })
            if (existingProject.length === 0) {
                throw new Error("project not found.")
            }

            const project = await Project.update({
                where: {
                    id
                },

            })
            // const project = await Project.update({
            //     where: {
            //         id
            //     },
            //     data: {
            //         name,
            //         description,
            //         userName,
            //         isOpen
            //     }
            // })
        },
        // @ts-ignore
        // deleteProject: async (_: Object, { id }: Object) => {
        //     const existingProject = await Project.delete({
        //         where: {
        //             id
        //         }
        //     })
        //     if (!existingProject) {
        //         throw new Error("project not found.")
        //     }
        //     return {
        //         message: "project deleted successfully."
        //     }

        // },
        // @ts-ignore
        addUser: async (_: Object, { newUser }: Object) => {
            const { userName, emailId, active, userType } = newUser
            if (!userType || !emailId) {
                throw new Error("field required.")
            }
            const [existingUser] = await User.find({
                where: {
                    emailId
                }
            })
            if (existingUser) {
                throw new Error("user already exist.")
            }
            const user = await User.create({
                input: [
                    {
                        userName,
                        emailId,
                        active,
                        userType
                    }
                ]
            })
            return newUser
        }
    }
}


export default resolvers