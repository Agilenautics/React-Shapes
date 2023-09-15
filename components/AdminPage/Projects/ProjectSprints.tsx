import React, { useEffect, useState } from "react";
import CreateSprint from "./CreateSprint";
import { getTypeLabel } from "./staticData/basicFunctions";
import fileStore from "../../TreeView/fileStore";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import { auth } from "../../../auth";
import { onAuthStateChanged } from "firebase/auth";
import { GET_USER, getUserByEmail } from "./gqlProject";
import { GET_SPRINTS, Sprint, getSprintByProjectId } from "../../Sprints/gqlSprints";
import sprintStore from "../../Sprints/sprintStore";
import { useRouter } from "next/router";
import LoadingIcon from "../../LoadingIcon";
import { ToastContainer, toast } from "react-toastify";

function ProjectSprints() {
  const { sprints, updateSprints, loading, error } = sprintStore();
  const [filteredData, setFilteredData] = useState<any>();


  const router = useRouter();

  const projectId = router.query.projectId as string;

  const getSprint = async (id: string) => {
    await getSprintByProjectId(id, GET_SPRINTS, updateSprints);
  };

  const [showForm, setShowForm] = useState(false);
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore(
    (state) => state.updateRecycleBinProject
  );
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser);

  const verificationToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        getUserByEmail(user.email, GET_USER, {
          updateLoginUser,
          updateProjects,
          updateUserType,
          updateRecycleBinProject,
        });
      }
    });
  };
  useEffect(() => {
    verificationToken();
  }, []);

  useEffect(() => {
    if (projectId) {
      getSprint(projectId)
    }
    setFilteredData(sprints[0])
  }, [projectId, error]);

  const sprintCreateMessage = () => toast.success("New Sprint Created...");



  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    return <> {error && <div> {error.message} </div>} </>;
  }



  const onFilter = (e: any) => {
    const selectedSprintName = e.target.value;
    const selectedSprint = sprints.find(
      (sprint) => sprint.name === selectedSprintName
    );
    if (selectedSprint) setFilteredData(selectedSprint);
  };

  return (
    <div className="absolute ml-3 w-fit">
      <h1 className="mb-4 rounded-lg bg-pink-300 p-2 text-2xl font-bold shadow-lg">
        Sprints
      </h1>

      {/* Add dropdown here */}
      <div className="mb-3">
        <label htmlFor="sprintDropdown" className="mr-2">
          Select Sprint:
        </label>
        <select
          id="sprintDropdown"
          onChange={onFilter}
          value={filteredData ? filteredData.name : ""}
        >
          {sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.name}>
              {sprint.name}
            </option>
          ))}
        </select>
      </div>

      {filteredData && (
        <div
          key={filteredData.id}
          className="w-fill overflow-y mb-5 h-60 overflow-x-hidden rounded border shadow-lg"
        >
          <h2 className="text-xl font-semibold">{filteredData.name}</h2>
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
              {filteredData.folderHas.map((item: any) => (
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
                      {filteredData.endDate}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {filteredData.fileHas.map((item: any) => (
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
                      {filteredData.endDate}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {filteredData.flownodeHas.map((item: any) => (
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
                      {filteredData.endDate}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            <CreateSprint
              setShowForm={setShowForm}
              sprintCreateMessage={sprintCreateMessage}
            />
          </div>
        </div>
      )}
      <ToastContainer autoClose={2500} />
    </div>
  );
}

export default ProjectSprints;
