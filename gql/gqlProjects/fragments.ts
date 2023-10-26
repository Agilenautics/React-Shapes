
import {gql} from "@apollo/client"
export const Project_Fragment = gql`
  fragment ProjectFragment on main {
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
