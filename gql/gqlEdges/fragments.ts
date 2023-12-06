import { gql } from "@apollo/client";

export const Edge_Fragment = gql`
  fragment EdgeFragment on FlowEdge {
    id
    selected
    label
    pathCSS
    boxCSS
    bidirectional
    connectedtoFlownode {
      id
    }
    connectedtoFlownodeConnection {
      edges {
        handle
      }
    }
    flownodeConnectedby {
      id
    }
    flownodeConnectedbyConnection {
      edges {
        handle
      }
    }
    hasFile {
      name
    }
  }
`;
