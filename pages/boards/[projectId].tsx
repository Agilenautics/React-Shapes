import { useRouter } from "next/router";
import TopBar from "../../components/AdminPage/TopBar";

import Sidebar from "../../components/Sidebar/Sidebar";
import ProjectBoards from "../../components/AdminPage/Projects/ProjectBoards";

const Boards = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
    <div className="h-screen">
      <ProjectBoards />
    </div>
  );
};

export default Boards;
