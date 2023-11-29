  import { Node_Fragment,Info_Fragment } from "../gqlNodes";
  import { Edge_Fragment } from "../gqlEdges";
  
  import { gql } from "@apollo/client";
  
  
  
  export const File_Fragment = gql`
    ${Node_Fragment}
    ${Edge_Fragment}
    ${Info_Fragment}
    fragment FileFragment on File {
      type
      id
      name
      uid
      hasSprint {
        id
        name
      }
      projectHas {
        id
        name
      }
      hasComments {
        id
        message
        timeStamp
        createdBy {
          emailId
        }
      }
      folderHas {
        id
        name
      }
      hasInfo{
      ...InfoFragment
      }
      hasFlowchart {
        name
        hasNodes {
          ...NodeFragment
        }
        hasEdges {
          ...EdgeFragment
        }
      }
    }
  `;
  
  