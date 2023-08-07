import { useRouter } from "next/router";
import ProjectBacklogs from "../../components/AdminPage/Projects/ProjectBacklogs";
import SummarySidebar from "../../components/AdminPage/Projects/SummarySidebar";
import TopBar from "../../components/AdminPage/TopBar";

const Backlogs = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
    <div>
      <TopBar />
      <div className="flex flex-row">
        <SummarySidebar projectId={projectId} />
        <div className="flex w-full flex-col bg-gray-200 p-5">
          <h1 className="text-2xl font-bold m-2 bg-pink-300 w-32 p-3 rounded  shadow-lg">Backlogs</h1>
          <ProjectBacklogs />
        </div>
      </div>
    </div>
  );
};

export default Backlogs;
