import { ReactFlowProvider } from "reactflow";
import Flow from "../../../components/Flow/flow";
import AddNodeButton from "../../../components/Sidebar/AddNodeButton";

const businessPlan = () => {
  return (
    <div>
      <div>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
        <AddNodeButton />
      </div>
    </div>
  );
};

export default businessPlan;
