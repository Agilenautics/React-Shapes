import { ReactFlowProvider } from "reactflow";
import Flow from "../../components/Flow/flow";
import AddNodeButton from "../../components/Sidebar/AddNodeButton";

const Flowchart = () => {
  return (
    <div className="providerflow">
      <div className="">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
        <AddNodeButton />
      </div>
    </div>
  );
};

export default Flowchart;
