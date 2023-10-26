import { onAuthStateChanged } from "firebase/auth";
import MembersTable from "./MembersTable";
import { getUserByEmail } from "../../../gql";
import { auth } from "../../../auth";
import { useEffect } from "react";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import { GET_USER } from "../../../gql";



interface ProjectOverviewProps {
  projectName: string;
  projectDesc: string;
  total: number;
  details: any;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  projectName,
  projectDesc,
  total,
  details,
}) => {
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject)
  const updateUserType = userStore((state) => state.updateUserType);
  const updateLoginUser = userStore((state) => state.updateLoginUser)
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
    <div className="pl-4">
      <div className="mt-8 flex items-center w-full">
        <div className="min-h-10 min-w-10 flex items-center justify-center rounded-xl bg-blue-500 p-2 text-xl font-semibold text-white">
          {getInitials(projectName)}
        </div>
        <h1 className="ml-4 text-2xl font-bold ">{projectName}</h1>
      </div>
      <div className="mt-10">
        <h3 className="text-lg font-semibold pl-1">Description</h3>
        <p className="mt-2">{projectDesc}</p>
      </div>
      <h2 className="mt-10 text-lg font-semibold pl-1">Project Members</h2>
      <div className="mt-2 flex items-center">
        <h4 className="">Total</h4>
        <p className="ml-4 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs dark:bg-slate-500">          {total}
        </p>
      </div>
      <MembersTable details={details} />
    </div>
  );
};

function getInitials(name: string) {
  const initials = name
    .replace(/[^a-zA-Z ]/g, "") // Remove special characters and numbers
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  return initials.toUpperCase();
}

export default ProjectOverview;
