import { gql } from "@apollo/client";

export const Info_Fragment = gql`
  fragment InfoFragment on info {
    description
    assignedTo
    status
    dueDate
    sprint
  }
`;

export const Node_Fragment = gql`
  ${Info_Fragment}
  fragment NodeFragment on flowNode {
    id
    draggable
    flowchart
    type
    timeStamp
    uid
    comments {
      message
      user {
        emailId
      }
    }
    hasSprint {
      id
      name
    }
    hasInfo {
      ...InfoFragment
    }
    hasdataNodedata {
      label
      shape
      description
      links {
        label
        id
        flag
        fileId
      }
      linkedBy {
        label
        id
        fileId
        flag
      }
    }
    haspositionPosition {
      name
      x
      y
    }
  }
`;
