import type { NextPage } from "next";
import Sidebar from "../components/Sidebar/Sidebar";
import Flow from "../components/Flow/flow";
import { ReactFlowProvider } from "react-flow-renderer";
import AddNodeButton from "../components/Sidebar/AddNodeButton";
import { getNodes, allNodes } from "../components/Flow/Nodes/gqlNodes";
import nodeStore from "../components/Flow/Nodes/nodeStore";
import { allEdges, getEdges } from "../components/Flow/Edges/gqlEdges";
import edgeStore from "../components/Flow/Edges/edgeStore";
import Tags from "../components/Flow/Nodes/Tags";

/**
 * This is the root of the application.
 * We're using the `ReactFlowProvider` component to wrap our `Flow` component, which is the component
 * that will render our flowchart.
 * @returns A component with a collapsible sidebar, a flowchart, and an add node button.
 */
const Home: NextPage = () => {
  // const updateNodes = nodeStore((state) => state.updateNodes);
  // const updateEdges = edgeStore((state) => state.updateEdges);
  // getEdges(allEdges, "Flowchart 2").then((result) => {
  //   // @ts-ignore
  //   // console.log(result);
  //   updateEdges(result);
  // });
  // getNodes(allNodes, "Flowchart 1").then((result) => {
  //   // @ts-ignore
  //   updateNodes(result);
  //   console.log(result);
  // });

  return (
    <>
      <Sidebar />
      <ReactFlowProvider>
        <Flow/>
      </ReactFlowProvider>
      <AddNodeButton />
      {/* <Tags /> */}
    </>
  );
};

export default Home;
