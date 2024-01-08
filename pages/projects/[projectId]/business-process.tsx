import React, { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import Flow from "../../../components/Flow/flow";
import AddNodeButton from "../../../components/Sidebar/AddNodeButton";
import BreadCrumbs from "../../../components/Sidebar/BreadCrumbs";
import projectStore from "../../../components/AdminPage/Projects/projectStore";
import userStore from "../../../components/AdminPage/Users/userStore";
import { auth } from "../../../auth";
import { onAuthStateChanged } from "firebase/auth";
import { GET_PROJECTS, getUserByEmail } from "../../../gql";
import { ApolloQueryResult } from "@apollo/client";
import fileStore from "../../../components/TreeView/fileStore";
import backlogStore from "../../../components/Backlogs/backlogStore";

const BusinessPlan = () => {
  const { userEmail } = userStore();
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore(
    (state) => state.updateRecycleBinProject
  );
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser);
  const { data } = fileStore();
  const {updateBacklogsData} = backlogStore()

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
    // setIsButtonDisabled(userType.toLowerCase() === "user");
    // setIsNewProjectDisabled(userType.toLowerCase() === "super user");
  }, [userEmail]);

  useEffect(()=>{
    updateBacklogsData(data.children as any)
  },[])


  return (
    <div>
      <ReactFlowProvider>
        <BreadCrumbs />
        <Flow />
      </ReactFlowProvider>
      <AddNodeButton />
    </div>
  );
};

export default BusinessPlan;
