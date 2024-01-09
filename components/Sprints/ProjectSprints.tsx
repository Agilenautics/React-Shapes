import React, { useEffect, useState } from "react";
import CreateSprint from "./CreateSprint";
import { getTypeLabel } from "../AdminPage/Projects/staticData/basicFunctions";
// import fileStore from "../../TreeView/fileStore";
import projectStore from "../AdminPage/Projects/projectStore";
import userStore from "../AdminPage/Users/userStore";
import { auth } from "../../auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserByEmail,
  GET_PROJECTS,
  GET_SPRINTS,
  getSprintByProjectId,
} from "../../gql";
import sprintStore from "./sprintStore";
import { useRouter } from "next/router";
import LoadingIcon from "../LoadingIcon";
import { ToastContainer, toast } from "react-toastify";
import SprintBoard from "./SprintBoard";
import { ApolloQueryResult } from "@apollo/client";

function ProjectSprints() {
  const [showForm, setShowForm] = useState(false);
  const [filteredData, setFilteredData] = useState<any>();
  const [boardView, setBoardView] = useState(false);

  const { sprints, updateSprints, loading, error } = sprintStore();
  const { userEmail, updateUserType, updateLoginUser } = userStore();
  const { updateRecycleBinProject, updateProjectData: updateProjects } =
    projectStore();
  
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const getSprint = async (id: string) => {
    await getSprintByProjectId(id, GET_SPRINTS, updateSprints);
  };

  

  const getProjects = async (email: string) => {
    try {
      const response: ApolloQueryResult<any> | undefined = await getUserByEmail(
        email,
        GET_PROJECTS
      );
      const { hasProjects, ...userData } = response?.data.users[0];
      updateProjects(hasProjects, response?.loading, response?.error);
      updateRecycleBinProject(hasProjects);
      updateLoginUser(userData);
      updateUserType(userData.userType);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userEmail) {
      getProjects(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    if (projectId) {
      getSprint(projectId);
    }
  }, [projectId, error]);

  useEffect(() => {
    if (sprints.length > 0) {
      setFilteredData(sprints[0]);
    } else {
      setFilteredData(null);
    }
  }, [sprints]);

  const sprintCreateMessage = () => toast.success("New Sprint Created...");

  const handleBoardView = () => {
    setBoardView(!boardView);
  };

  const onFilter = (e: any) => {
    const selectedSprintName = e.target.value;
    const selectedSprint = sprints.find(
      (sprint) => sprint.name === selectedSprintName
    );
    if (selectedSprint) setFilteredData(selectedSprint);
  };

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

  return (
    <div className="p-4 ">
      <h1 className="mb-4 rounded-lg bg-gray-200 p-2 text-2xl font-bold shadow-lg">
        Sprints
      </h1>

      {/* Add dropdown here */}
      {sprints.length ? (
        <div className="mb-3 dark:text-black">
          <label htmlFor="sprintDropdown" className="mr-2  dark:text-white">
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
          <button
            className={`ml-5 rounded-md bg-blue-500 px-4 py-2 text-white`}
            onClick={handleBoardView}
          >
            {boardView ? "Table View" : "Board View"}
          </button>
          {filteredData &&
            (!boardView ? (
              <div
                key={filteredData.id}
                className="w-fill overflow-y mb-5 h-60 overflow-x-hidden rounded border shadow-lg"
              >
                <h2 className="text-xl font-semibold dark:text-white">
                  {filteredData.name}
                </h2>
                <table className="mr-4 w-[1000px] table-auto">
                  <thead>
                    <tr className="bg-gray-100 ">
                      <th className="border bg-gray-200 px-1 py-2 dark:bg-bgdarkcolor dark:text-white">
                        Type
                      </th>
                      <th className="border bg-gray-200 px-1 py-2 dark:bg-bgdarkcolor dark:text-white">
                        Name
                      </th>
                      <th className="border bg-gray-200 px-1 py-2 dark:bg-bgdarkcolor dark:text-white">
                        Description
                      </th>
                      <th className="border bg-gray-200 px-1 py-2 dark:bg-bgdarkcolor dark:text-white">
                        Status
                      </th>
                      <th className="border bg-gray-200 px-1 py-2 dark:bg-bgdarkcolor dark:text-white">
                        User
                      </th>
                      <th className="border bg-gray-200 px-1 py-2 dark:bg-bgdarkcolor dark:text-white">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="dark:bg-slate-700 dark:text-white">
                    {filteredData.folderHas.map((item: any) => (
                      <React.Fragment key={item.id}>
                        <tr className="border-b ">
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
                            {item.hasInfo.assignedTo}
                          </td>
                          <td className="rounded-lg border px-1 py-2 text-center">
                            {filteredData.endDate}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                    {filteredData.fileHas.map((item: any) => (
                      <React.Fragment key={item.id}>
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
                            {item.hasInfo.assignedTo}
                          </td>
                          <td className="rounded-lg border px-1 py-2 text-center">
                            {filteredData.endDate}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                    {filteredData.flownodeHas.map((item: any) => (
                      <React.Fragment key={item.id}>
                        <tr className="border-b">
                          <td className="rounded-lg border px-1 py-2 text-center">
                            {/* @ts-ignore */}
                            {getTypeLabel(item.type).type}
                          </td>
                          <td className="rounded-lg border px-1 py-2 text-center">
                            {item.data.label}
                          </td>
                          <td className="description-cell w-[400px] break-all rounded-lg border px-1 py-2 text-center">
                            {item.data.description}
                          </td>
                          <td className="rounded-lg border px-1 py-2 text-center">
                            {item.hasInfo.status}
                          </td>
                          <td className="rounded-lg border px-1 py-2 text-center">
                            {item.hasInfo.assignedTo}
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
            ) : (
              <div className="flex">
                <SprintBoard data={filteredData} />
              </div>
            ))}
        </div>
      ) : (
        <div>No Sprints to show</div>
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
          <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-bgdarkcolor dark:text-white">
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
