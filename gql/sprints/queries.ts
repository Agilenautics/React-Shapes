import {
    gql
  } from "@apollo/client";
 
  
//get sprint by the project id
export const GET_SPRINTS = gql`
 
  query Sprints($where: SprintWhere) {
    sprints(where: $where) {
      id
    name
    description
    timeStamp
    startDate
    endDate
    folderHas {
      id
      name
      type
      hasInfo {
        description
        assignedTo
        status
        dueDate
      }
    }
    fileHas {
      id
      name
      type
      hasInfo {
        description
        assignedTo
        status
        dueDate
      }
    }
    flownodeHas {
      id
      type
      hasInfo {
        description
        assignedTo
        status
        dueDate
      }
      data {
        label
        description
      }
    }
    hasProjects {
      name
    }
    }
  }
`;
export const SPRINTS_FOR_BACKLOGS = gql`
  query Sprints($where: SprintWhere) {
    sprints(where: $where) {
      id
      name
    }
  }
`;
  