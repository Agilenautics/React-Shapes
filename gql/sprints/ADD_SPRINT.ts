import { gql } from "@apollo/client";


export const ADD_SPRINT = gql`
mutation CreateSprints($input: [SprintCreateInput!]!) {
  createSprints(input: $input) {
    sprints {
      id
      name
      startDate
      endDate
      description
    }
  }
}
`