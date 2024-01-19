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
import nodeStore from "../../../components/Flow/Nodes/nodeStore";
import { useEditingNodeId } from "../../../components/Flow/NodeEditingStore";
import DescSidebar from "../../../components/Flow/Nodes/Description/DescSidebar";
import { useDescSidebarStore } from "../../../components/Flow/Nodes/Description/SidebarStore";
import { dummyComments } from "../../../components/Flow/Nodes/Description/Comments/DummyComments";
import { MiniMap } from "reactflow";
import CustomMinimap from "../../../components/Flow/CustomMiniMap";
import CustomControls from "../../../components/Flow/CustomControls";

const BusinessPlan = () => {
  const { userEmail } = userStore();
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore(
    (state) => state.updateRecycleBinProject
  );
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser);

  const { nodes } = nodeStore();
  const { editingNodeId, setEditingNodeId } = useEditingNodeId();
  const label = nodes.find((node) => node.id === editingNodeId)?.data.label;
  const description = nodes.find((node) => node.id === editingNodeId)?.data
    .description;
  const isSidebarOpen = useDescSidebarStore((state) => state.isDescSidebarOpen);
  const openSidebar = useDescSidebarStore((state) => state.openDescSidebar);
  const closeSidebar = useDescSidebarStore((state) => state.closeDescSidebar);
  const { Id: fileId } = fileStore();
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

  useEffect(() => {
    // Close the sidebar when the editingNodeId orFile ID changes
    closeSidebar();
  }, [editingNodeId, fileId]);

  return (
    <div className="flex">
      <ReactFlowProvider>
        <BreadCrumbs />
        <div className="relative flex-1">
          <Flow />
          <div
            className={`absolute bottom-20 ${
              isSidebarOpen
                ? "right-80 translate-x-0 transition-transform"
                : "right-0"
            } z-10 p-4`}
          >
            <MiniMap
              zoomable
              className="rounded-md border-[#C0D5E7] shadow-md"
              maskColor="#fff"
            />
            <CustomControls />
          </div>
        </div>
      </ReactFlowProvider>
      <AddNodeButton />

      {isSidebarOpen && (
        <DescSidebar
          nodeName={label}
          descriptionText={description}
          onCloseSidebar={closeSidebar}
          comments={dummyComments}
        />
      )}
    </div>
  );
};

export default BusinessPlan;
