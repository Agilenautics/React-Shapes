import Project from "./modules/projectModel"
import User from "./modules/usersModel"

const resolvers = {
    Query: {
        projects: async (parent: any, args: any, { db }: any) => {
            return await Project.find({})
        },
        getUsers:async()=>{
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
        updateProject:async(_:Object,{projectData}:Object) =>{
            const {name,description,id,userName,isOpen} = projectData
            if(!name){
                throw new Error("field required.")
            }

            const [existingProject] = await Project.update({
                where:{
                    name
                }
            })

        }
    }
}


export default resolvers