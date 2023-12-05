import { gql} from "@apollo/client";

export const Edge_Fragment = gql`
  fragment EdgeFragment on FlowEdge {
    id
    name
    source
    target
    sourceHandle
    targetHandle
    selected
    hasedgedataEdgedata {
      label
      pathCSS
      boxCSS
      bidirectional
    }
    flownodeConnectedby {
      id
      flowchart
    }
    connectedtoFlownode {
      id
      flowchart
    }
  }
`;