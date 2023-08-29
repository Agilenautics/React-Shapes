import { ReactFlowProvider } from "reactflow";
import Flow from "../../../components/Flow/flow";
import AddNodeButton from "../../../components/Sidebar/AddNodeButton";
import BreadCrumbs from "../../../components/Sidebar/BreadCrumbs";

const businessPlan = () => {
  return (
    <div>
      <div>
        <ReactFlowProvider>
          <BreadCrumbs />
          <Flow />
        </ReactFlowProvider>
        <AddNodeButton />
      </div>
    </div>
  );
};

export default businessPlan;
