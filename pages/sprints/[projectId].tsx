import { useRouter } from "next/router";
import TopBar from "../../components/AdminPage/TopBar";

import Sidebar from "../../components/Sidebar/Sidebar";
import ProjectSprints from "../../components/AdminPage/Projects/ProjectSprints";

const Sprints = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
      <div className="flex">
        <Sidebar/>
        <div className="ml-6 w-full">
          <TopBar/>
          <ProjectSprints/>
        </div>
      </div>
  );
};

export default Sprints;
