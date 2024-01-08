import {gql} from '@apollo/client'


export const GET_UID = gql`
  query Uids {
    uids {
      id
      uid
    }
  }
`;