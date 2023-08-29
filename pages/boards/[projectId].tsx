import { useRouter } from "next/router";
import ProjectBoards from "../../components/AdminPage/Projects/ProjectBoards";

const Boards = () => {
  return (
    <div className="h-screen">
      <ProjectBoards />
    </div>
  );
};

export default Boards;
