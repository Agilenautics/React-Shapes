import { useRouter } from "next/router";
import ProjectBacklogs from "../../components/AdminPage/Projects/ProjectBacklogs";
import SummarySidebar from "../../components/AdminPage/Projects/SummarySidebar";
import TopBar from "../../components/AdminPage/TopBar";

import Sidebar from "../../components/Sidebar/Sidebar";

const Backlogs = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
      <div className="flex">
        <Sidebar/>
        <div className="ml-2 w-full">
          <TopBar/>
          <ProjectBacklogs />
        </div>
      </div>
  );
};

export default Backlogs;
