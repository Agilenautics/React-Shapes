import {
  gql
} from "@apollo/client";
import { File_Fragment } from "./fragments";
import { Node_Fragment,Info_Fragment } from "../gqlNodes";

//Get root using unique userName(UID)
export const getProjectById = gql`
  ${File_Fragment}
  ${Info_Fragment}
  query getprojectById($where: ProjectWhere) {
    projects(where: $where) {
      name
      description
      isOpen
      id
      hasContainsFile {
        ...FileFragment
      }
      hasContainsFolder {
        id
        type
        isOpen
        name
        uid
        hasSprint {
         id
         name
        }   
        hasInfo{
         ...InfoFragment
        }
        hasFile {
          ...FileFragment
        }
      }
      usersInProjects {
        emailId
        userType
      }
    }
  }
`;
export const getFile = gql`
  ${Node_Fragment}
  query Query($where: FileWhere) {
    files(where: $where) {
      name
      id
      type
      hasNodes {
        ...NodeFragment
      }
    }
  }
`;
//getting uid
export const getUidQuery = gql`
  query Uids {
    uids {
      id
      uid
    }
  }
`;
