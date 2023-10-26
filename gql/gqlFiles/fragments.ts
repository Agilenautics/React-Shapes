  import { Node_Fragment,Info_Fragment } from "../gqlNodes";
  import { Edge_Fragment } from "../gqlEdges";
  
  import { gql } from "@apollo/client";
  
  
  
  export const File_Fragment = gql`
    ${Node_Fragment}
    ${Edge_Fragment}
    ${Info_Fragment}
    fragment FileFragment on file {
      type
      id
      name
      uid
      hasSprint {
        id
        name
      }
      mainHas {
        id
        name
      }
      comments {
        id
        message
        timeStamp
        user {
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
      hasflowchart {
        name
        nodes {
          ...NodeFragment
        }
        edges {
          ...EdgeFragment
        }
      }
    }
  `;
  
  