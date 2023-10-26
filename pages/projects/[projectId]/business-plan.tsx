import { ReactFlowProvider } from "reactflow";
import Flow from "../../../components/Flow/flow";
import AddNodeButton from "../../../components/Sidebar/AddNodeButton";
import BreadCrumbs from "../../../components/Sidebar/BreadCrumbs";
import projectStore from "../../../components/AdminPage/Projects/projectStore";
import userStore from "../../../components/AdminPage/Users/userStore";
import { auth } from "../../../auth";
import { onAuthStateChanged } from "firebase/auth";
import { GET_USER, getUserByEmail } from "../../../gql";
import { useEffect } from "react";



const BusinessPlan = () => {
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
