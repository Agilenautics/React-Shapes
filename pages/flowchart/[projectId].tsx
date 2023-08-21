import { ReactFlowProvider } from "reactflow";
import Flow from "../../components/Flow/flow";
import AddNodeButton from "../../components/Sidebar/AddNodeButton";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopBar from "../../components/AdminPage/TopBar";
import ProjectBacklogs from "../../components/AdminPage/Projects/ProjectBacklogs";

const Flowchart = () => {
  const router = useRouter();
  return (
    <div className="providerflow">
      <div className="">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
        <AddNodeButton />
      </div>
      <Sidebar />
    </div>
  );
};

export default Flowchart;
