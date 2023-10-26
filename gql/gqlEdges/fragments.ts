import { gql} from "@apollo/client";

export const Edge_Fragment = gql`
  fragment EdgeFragment on flowEdge {
    id
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