import Project from "./modules/projectModel"
import User from "./modules/usersModel"
import driver from "./dbConnection"

const resolvers = {
    Query: {
       
        // projects: async (parent: any, { email }: Object) => {
        //     try {
        //         const projects = await Project.find({})
        //         return projects

        //     } catch (err) {
        //         console.error("error", err)
        //         return []
        //     }
        // },
        // @ts-ignore
        getUsers: async (_: any, { emailId }: any) => {
            const session = driver.session()
            try {
                const result = await session.run('MATCH(u:user {emailId:$emailId}) -->(hasMain)   RETURN u as user,  hasMain as project', { emailId });
                const users = result.records.map((record) => record.get('user').properties);
                // const projects = result.records.map((record)=>record.get('project').properties);

                return users

            }
            catch (error) {
                console.log(error)

            }
            finally {
                session.close()
            }
            driver.close()
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
        },
        // deleteNode: async (_: any, nodeId: Object) => {
        //     // console.log(nodeId.id)
        //     const session = driver.session();
        //     await session
        //         .run('MATCH (n:flowNode {nodeId:$nodeId}) DETACH  DELETE n;', {
        //             nodeId: nodeId.id
        //         })
        //         .subscribe({
        //             onKeys: keys => {
        //                 console.log(keys, "keys")
        //             },
        //             onNext: record => {
        //                 console.log(record, "delete successfully")
        //             },
        //             onCompleted: () => {
        //                 session.close() // returns a Promise
        //             },
        //             onError: error => {
        //                 console.log(error)
        //             }
        //         })

        //     return true


        // }
    }
}


export default resolvers