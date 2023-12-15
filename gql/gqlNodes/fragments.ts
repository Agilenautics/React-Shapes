import { gql } from "@apollo/client";
import { Edge_Fragment } from "../gqlEdges";

export const Info_Fragment = gql`
  fragment InfoFragment on Info {
    description
    assignedTo
    status
    dueDate
  }
`;

export const Node_Fragment = gql`
  ${Info_Fragment}
  ${Edge_Fragment}
  fragment NodeFragment on FlowNode {
    id
    draggable
    flowchart
    type
    timeStamp
    uid
    label
    shape
    x
    y
    flowEdge {
      ...EdgeFragment
    }
    isLinkedConnection {
      edges {
        label
        flag
        isLeft
      }
    }
    hasInfo {
      ...InfoFragment
    }
    hasComments {
      message
      createdBy {
        emailId
      }
    }
    hasSprint {
      id
      name
    }
    hasFile {
      id
      name
      folderHas {
        id
        name
      }
    }
  }
`;
