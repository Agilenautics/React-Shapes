import { ReactFlowProvider } from "react-flow-renderer"
import Flow from "../../components/Flow/flow"
import AddNodeButton from "../../components/Sidebar/AddNodeButton"
import { useRouter } from "next/router"
import Sidebar from "../../components/Sidebar/Sidebar"

const flowchart = () => {
    const router = useRouter()
    return (
        <>
            <Sidebar />
            <ReactFlowProvider>
                <Flow />
            </ReactFlowProvider>
            <AddNodeButton />
        </>
    )
}

export default flowchart