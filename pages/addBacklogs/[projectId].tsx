import { useRouter } from "next/router";
import BacklogForm from "../../components/AdminPage/Projects/BacklogForm";
import SummarySidebar from "../../components/AdminPage/Projects/SummarySidebar";
import TopBar from "../../components/AdminPage/TopBar";

const AddBacklogs = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
    <div>
      <TopBar />
      <div className="flex flex-row">
        <SummarySidebar projectId={projectId} />
        <div className="flex w-full flex-col bg-gray-200 p-5">
          <h1 className="text-2xl font-bold m-2 bg-violet-300 w-52 p-3 rounded  shadow-lg">Add Backlog</h1>
          <BacklogForm />
        </div>
      </div>
    </div>
  );
};

export default AddBacklogs;