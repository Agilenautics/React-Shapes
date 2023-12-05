import { gql } from "@apollo/client";

export const Edge_Fragment = gql`
  fragment EdgeFragment on FlowEdge {
    id
    source
    target
    sourceHandle
    targetHandle
    selected
    label
    pathCSS
    boxCSS
    bidirectional
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
