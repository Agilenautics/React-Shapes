import {gql} from "@apollo/client"


export const UPDATE_SPRINT = gql`
mutation UpdateSprints($where: SprintWhere, $update: SprintUpdateInput) {
  updateSprints(where: $where, update: $update) {
    sprints {
      id
      name
      description
      startDate
      endDate
    }
  }
}
`