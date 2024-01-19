import { onAuthStateChanged } from "firebase/auth";
import MembersTable from "./MembersTable";
import { auth } from "../../../auth";
import React, { useEffect } from "react";
import projectStore from "./projectStore";
import userStore from "../Users/userStore";
import { GET_PROJECTS, getUserByEmail } from "../../../gql";
import { ApolloQueryResult } from "@apollo/client";
import { useTranslation } from "react-i18next";

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
  const updateRecycleBinProject = projectStore(
    (state) => state.updateRecycleBinProject
  );
  const { userEmail, updateUserType, updateLoginUser } = userStore();
  const { t } = useTranslation(); // useTranslation hook

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

  return (
    <div className="pl-4">
      <div className="mt-8 flex w-full items-center">
        <div className="flex min-h-10 min-w-10 items-center justify-center rounded-xl bg-blue-500 p-2 text-xl font-semibold text-white">
          {getInitials(projectName)}
        </div>
        <h1 className="ml-4 text-2xl font-bold ">{projectName}</h1>
      </div>
      <div className="mt-10">
        <h3 className="pl-1 text-lg font-semibold">{t("description")}</h3>
        <p className="mt-2">{projectDesc}</p>
      </div>
      <h2 className="mt-10 pl-1 text-lg font-semibold">
        {t("project_members")}
      </h2>
      <div className="mt-2 flex items-center">
        <h4 className="">{t("total")}</h4>
        <p className="ml-4 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs dark:bg-slate-500">
          {total}
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
