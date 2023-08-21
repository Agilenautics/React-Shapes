import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getMainByUser,
  getTreeNodeByUser,
} from "../../components/TreeView/gqlFiles";
import TopBar from "../../components/AdminPage/TopBar";
// import SummarySidebar from "../../components/AdminPage/Projects/SummarySidebar";
import LoadingIcon from "../../components/LoadingIcon";
// import MembersTable from "../../components/AdminPage/Projects/MembersTable";
import ProjectOverview from "../../components/AdminPage/Projects/ProjectOverview";
import fileStore from "../../components/TreeView/fileStore";
import Sidebar from "../../components/Sidebar/Sidebar";

interface Project {
  name: string;
  id: string;
  description: string;
}

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
  const setLoading = fileStore((state)=> state.setLoading);

  async function fetchData() {
    if (projectId) {
      const initData = await getTreeNodeByUser(
        getMainByUser,
        projectId.toString(),
        setLoading
      );
      setTotal(initData[0].userHas.length);
      setProjectName(initData[0].name);
      setProjectDesc(initData[0].description);
      const userHas = initData[0].userHas;
      const userDetails = userHas.map((user: any) => ({
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
      <div className="flex">
        <Sidebar/>
        <div className="absolute ml-72 w-[75vw]">
        <TopBar />
          {isLoading ? 
            <div className="flex justify-center items-center h-full">
            <LoadingIcon />
            </div>
          : 
              <ProjectOverview
                projectName={projectName}
                projectDesc={projectDesc}
                total={total}
                details={details}
              />
          }
        </div>
      </div>
  );
}

export default SideBar;
