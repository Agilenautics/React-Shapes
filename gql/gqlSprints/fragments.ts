import {gql} from "@apollo/client";
import { Info_Fragment } from "../gqlNodes";
//  Epic fragment for Sprints
export const EpicSprint_Fragment = gql`
  ${Info_Fragment}
  fragment EpicSprintFragment on folder {
    id
    name
    type
    hasInfo {
      ...InfoFragment
    }
  }
`;
//  Story fragment for Sprints
export const StorySprint_Fragment = gql`
  ${Info_Fragment}
  fragment StorySprintFragment on file {
    id
    name
    type
    hasInfo {
      ...InfoFragment
    }
  }
`;
//  Task/Issue/subtask/Bug fragment for Sprints
export const TaskSprint_Fragment = gql`
  ${Info_Fragment}
  fragment TaskSprintFragment on flowNode {
    id
    type
    hasInfo {
      ...InfoFragment
    }
    hasdataNodedata {
      label
      description
    }
  }
`;
export const Sprint_Fragment = gql`
  ${StorySprint_Fragment}
  ${EpicSprint_Fragment}
  ${TaskSprint_Fragment}
  fragment SprintFragment on sprint {
    id
    name
    description
    timeStamp
    startDate
    endDate
    folderHas {
      ...EpicSprintFragment
    }
    fileHas {
      ...StorySprintFragment
    }
    flownodeHas {
      ...TaskSprintFragment
    }
    hasProjects {
      name
    }
  }
`;
