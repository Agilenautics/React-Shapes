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
import App from "./Admin";
import Link from "next/link";
import Router from "next/router";
import {
  createProject,
  createProjectMutation,
} from "../components/TreeView/gqlFiles";
import TopBar from "../components/TopBar/topbar";
import Signout from "../components/Authentication/Signout/Signout";

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
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '2px solid #000',
        width: '100vw',
        height: 75,
        padding: '0px 35px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0
      }}>
        <Sidebar />
        <Signout />
      </div>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
      <AddNodeButton />
      {/* <button className="border-1 p-1 " onClick={()=>createProject({name:"",description:""}, createProjectMutation)} >create project</button> */}

      {/* <Tags /> */}
    </>
  );
};

export default Home;
