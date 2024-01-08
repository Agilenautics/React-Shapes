import {gql} from '@apollo/client'


export const UPDATED_UID = gql`
  mutation UpdateUids($where: UidWhere, $update: UidUpdateInput) {
    updateUids(where: $where, update: $update) {
      uids {
        id
        uid
      }
    }
  }
`;