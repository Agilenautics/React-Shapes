
import {gql} from "@apollo/client"
export const Project_Fragment = gql`
  fragment ProjectFragment on Project {
      id
      timeStamp
      description
      name
      recycleBin
      recentProject
      deletedAT
      userHas {
        emailId
        userType
      }
  }
`;
