import { gql } from "@apollo/client";

export const Info_Fragment = gql`
  fragment InfoFragment on Info {
    description
    assignedTo
    status
    dueDate
    sprint
  }
`;

export const Node_Fragment = gql`
  ${Info_Fragment}
  fragment NodeFragment on FlowNode {
    id
    draggable
    flowchart
    type
    timeStamp
    uid
    hasComments {
      message
      userHas {
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
      hasLinkedTo {
        label
        id
        flag
        fileId
      }
      hasLinkedBy {
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
