import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GET_PROJECT_BY_ID, getTreeNodeByUser } from "../../gql";
import LoadingIcon from "../../components/LoadingIcon";
import ProjectOverview from "../../components/AdminPage/Projects/ProjectOverview";
import fileStore from "../../components/TreeView/fileStore";

interface User {
  email: string;
  userType: string;
}

function SideBar() {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<User[]>([]);
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const setLoading = fileStore((state) => state.setLoading);

  async function fetchData() {
    if (projectId) {
      const initData = await getTreeNodeByUser(
        GET_PROJECT_BY_ID,
        projectId.toString(),
        setLoading
      );
      setTotal(initData[0].usersInProjects.length);
      setProjectName(initData[0].name);
      setProjectDesc(initData[0].description);
      const usersInProjects = initData[0].usersInProjects;
      const userDetails = usersInProjects.map((user: any) => ({
        email: user.emailId,
        userType: user.userType,
      }));
      setDetails(userDetails);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [router.query.projectId]);

  return (
    <div className="h-screen">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <LoadingIcon />
        </div>
      ) : (
        <ProjectOverview
          projectName={projectName}
          projectDesc={projectDesc}
          total={total}
          details={details}
        />
      )}
    </div>
  );
}

export default SideBar;
