import { gql } from "@apollo/client";

export const Edge_Fragment = gql`
  fragment EdgeFragment on FlowEdge {
    id
    label
    bidirectional
    boxCSS
    pathCSS
    selected
    createdBy {
      id
      emailId
    }

    flowNodeConnection {
      edges {
        handle
        node {
          id
        }
      }
    }
  }
`;
