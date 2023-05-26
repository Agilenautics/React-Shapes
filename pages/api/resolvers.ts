import Project from "./models/projectModel"

const resolvers = {
    Query: {

    },
    Mutation: {
        createProject: async (_: Object, { newProject }: any) => {
            const { name, description, userName, isOpen } = newProject
            if (!name) {
                throw new Error("field required.")
            }
            const [existing] = await Project.find({
                where: {
                    name,
                },
            });
            if (existing) {
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
        }
    }
}


export default resolvers