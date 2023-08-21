import { useRouter } from "next/router";
import TopBar from "../../components/AdminPage/TopBar";

import Sidebar from "../../components/Sidebar/Sidebar";
import ProjectBoards from "../../components/AdminPage/Projects/ProjectBoards";

const Boards = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
      <div className="flex">
        <Sidebar/>
        <div className="ml-6 w-full">
          <TopBar/>
          <ProjectBoards/>
        </div>
      </div>
  );
};

export default Boards;
