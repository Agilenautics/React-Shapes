import React, { useEffect, useState } from "react";

// import initData from "./staticData/initData";
import CreateSprint from "./CreateSprint";
import { processedData } from "./staticData/processedData";
import { getTypeLabel } from "./staticData/basicFunctions";
import fileStore from "../../TreeView/fileStore";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import { auth } from "../../../auth";
import { onAuthStateChanged } from "firebase/auth";
import { GET_USER, getUserByEmail } from "./gqlProject";
import { GET_SPRINTS, getSprintByProjectId } from "../../Sprints/gqlSprints";
import sprintStore from "../../Sprints/sprintStore";
import { useRouter } from "next/router";
import LoadingIcon from "../../LoadingIcon";
import processSprint from "./staticData/sprintProcessing";



function ProjectSprints() {
  // const [data, setData] = useState<any[]>([])
  // const initData = fileStore((state) => state.data)
  const { sprints, updateSprints, loading, error } = sprintStore()

  // const data = processSprint(sprints)

  // console.log(data);
  

  // console.log(sprints);
  

  // const data = processedData(initData.children)

  const router = useRouter()

  const projectId = router.query.projectId as string

  const getSprint = async (id: string) => {
    await getSprintByProjectId(id, GET_SPRINTS, updateSprints)
  }

  const [showForm, setShowForm] = useState(false);
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject)
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser);




  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        getUserByEmail(user.email, GET_USER, { updateLoginUser, updateProjects, updateUserType, updateRecycleBinProject })
      }
    })
  }
  useEffect(() => {
    verificationToken()
  }, [])

  useEffect(() => {
    if (projectId) {
       getSprint(projectId).then(res=>console.log(res,"res")).catch(err=>console.log(err)
       )  
       
    }
  }, [projectId])


  // const [sprintsData, setSprintsData] = useState({});
  // let sprintsData: any[] = []

  // const objWithoutSprint: any[] = []
  // data.map(element => {
  //   if (element.sprint) {
  //     let elementSprint = element.sprint
  //     if (sprintsData[elementSprint]) {
  //       sprintsData[elementSprint].push(element)
  //     } else sprintsData[elementSprint] = [element]
  //   } else {
  //     objWithoutSprint.push(element)
  //   }
  // })

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
<LoadingIcon />
    </div> 
  }


  if (error) {
    return <> {error && <div> {error.message} </div>} </>
  }

// console.log(data);


  return (
    <div className="absolute ml-3 w-fit">
      <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg">
        Sprints
      </h1>

      {sprints.map((sprint, index) => (
        <div
          key={index}
          className="w-fill overflow-y mb-5 h-60 overflow-x-hidden rounded border shadow-lg"
        >
          <h2 className="text-xl font-semibold">{sprint.name}</h2>
          <table className="mr-4 w-[1000px] table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border bg-gray-200 px-1 py-2">Type</th>
                <th className="border bg-gray-200 px-1 py-2">Name</th>
                <th className="border bg-gray-200 px-1 py-2">Description</th>
                <th className="border bg-gray-200 px-1 py-2">Status</th>
                <th className="border bg-gray-200 px-1 py-2">User</th>
                <th className="border bg-gray-200 px-1 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {sprint.folderHas.map((item: any) => (
                <React.Fragment key={item.name}>
                  <tr className="border-b">
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {/* @ts-ignore */}
                      {getTypeLabel(item.type).type}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.name}
                    </td>
                    <td className="description-cell w-[400px] break-all rounded-lg border px-1 py-2 text-center">
                      {item.hasInfo.description}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.hasInfo.status}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.user}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {sprint.endDate}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {sprint.fileHas.map((item: any) => (
                <React.Fragment key={item.name}>
                  <tr className="border-b">
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {/* @ts-ignore */}
                      {getTypeLabel(item.type).type}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.name}
                    </td>
                    <td className="description-cell w-[400px] break-all rounded-lg border px-1 py-2 text-center">
                      {item.hasInfo.description}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.hasInfo.status}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.user}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {sprint.endDate}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {sprint.flownodeHas.map((item: any) => (
                <React.Fragment key={item.name}>
                  <tr className="border-b">
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {/* @ts-ignore */}
                      {getTypeLabel(item.type).type}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.hasdataNodedata.label}
                    </td>
                    <td className="description-cell w-[400px] break-all rounded-lg border px-1 py-2 text-center">
                      {item.hasdataNodedata.description}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.hasInfo.status}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {item.user}
                    </td>
                    <td className="rounded-lg border px-1 py-2 text-center">
                      {sprint.endDate}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
       <button
        onClick={() => {
          setShowForm(true);
        }}
        className="m-3 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Create Sprint
      </button>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <CreateSprint setShowForm={setShowForm}
            //  objWithoutSprint={objWithoutSprint}
              />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSprints;
