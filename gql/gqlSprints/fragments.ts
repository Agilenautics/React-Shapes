import {gql} from "@apollo/client";
import { Info_Fragment } from "../flowNodes";
//  Epic fragment for Sprints
export const EpicSprint_Fragment = gql`
  ${Info_Fragment}
  fragment EpicSprintFragment on Folder {
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
  fragment StorySprintFragment on File {
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
  fragment TaskSprintFragment on FlowNode {
    id
    type
    label
    hasInfo {
      ...InfoFragment
    }
    
  }
`;
export const Sprint_Fragment = gql`
  ${StorySprint_Fragment}
  ${EpicSprint_Fragment}
  ${TaskSprint_Fragment}
  fragment SprintFragment on Sprint {
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
