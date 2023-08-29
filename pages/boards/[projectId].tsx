import { useRouter } from "next/router";
import ProjectBoards from "../../components/AdminPage/Projects/ProjectBoards";

const Boards = () => {
  return (
    <div className="h-screen">
      <ProjectBoards />
    </div>
      // <div className="flex">
      //   <Sidebar/>
      //   <div className="ml-2 w-full">
      //     <TopBar/>
      //     <ProjectBoards/>
      //   </div>
      // </div>
  );
};

export default Boards;
