import client from "../../apollo-client";
import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
  FetchResult,
} from "@apollo/client";

import { Info_Fragment } from "../TreeView/gqlFiles";
import { FetchError } from "node-fetch";
export interface Sprint {
  id: string;
  name?: string | null;
  description: string;
  timeStamp: string;
  startDate: string;
  endDate: string;
}
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

//get sprint by the project id
const GET_SPRINTS = gql`
  ${Sprint_Fragment}
  query Sprints($where: sprintWhere) {
    sprints(where: $where) {
      ...SprintFragment
    }
  }
`;
const getSprintByProjectId = async (
  projectId: string,
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  updateSprints: any
) => {
  let sprint;
  await client
    .query({
      query: customQuery,
      variables: {
        where: {
          hasProjects: {
            id: projectId,
          },
        },
      },
    })
    .then((response) => {
      const { data, loading, error } = response;
      updateSprints(data.sprints, loading, error);
      sprint = response;
    })
    .catch((error) => {
      return error;
    });
};

const SPRINTS_FOR_BACKLOGS = gql`
  query Sprints($where: sprintWhere) {
    sprints(where: $where) {
      id
      name
    }
  }
`;
const getSprintToBacklogs = async (
  projectId: string,
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  try {
    const response = await client.query({
      query: customQuery,
      variables: {
        where: {
          hasProjects: {
            id: projectId,
          },
        },
      },
    });
    // .then((response) => {
    //   // console.log(response)
    //   return response.data.sprints;
    // })
    // .catch((error) => error);
    return response.data.sprints;
  } catch (error) {
    return error;
  }
};

const CREATE_SPRINT_MUTATION = gql`
  ${Sprint_Fragment}
  mutation CreateSprints($input: [sprintCreateInput!]!) {
    createSprints(input: $input) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;

const createSPrintBackend = (
  projectId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  inputVariables: Sprint,
  addSprint: any,
  handleError: any,
  sprintCreateMessage: any,
  hidePopUp: any
) => {
  client
    .mutate({
      mutation: mutation,
      variables: {
        input: [
          {
            hasProjects: {
              connect: {
                where: {
                  node: {
                    id: projectId,
                  },
                },
              },
            },
            name: inputVariables.name,
            description: inputVariables.description || "",
            startDate: inputVariables.startDate,
            endDate: inputVariables.endDate,
          },
        ],
      },
    })
    .then((response: FetchResult<any>) => {
      addSprint(response.data.createSprints.sprints[0], response.errors);
      sprintCreateMessage();
      hidePopUp(false);
    })
    .catch((error) => handleError(error));
};

const UPDATE_SPRINT_MUTATION = gql`
  mutation updateSprint($where: sprintWhere, $update: sprintUpdateInput) {
    updateSprints(where: $where, update: $update) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;

const updateSprintBackend = async (
  sprintId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  updatedData: Sprint
) => {
  await client
    .mutate({
      mutation,
      variables: {
        where: {
          id: sprintId,
        },
        update: {
          name: updatedData.name,
          description: updatedData.description,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate,
        },
      },
    })
    .then((response: FetchResult<any>) => {
      console.log(response);
    })
    .catch((error: FetchError) => {
      console.log(error.message, "update sprint backend ");
    });
};

const DELETE_SPRINT = gql`
  mutation DeleteSprints($where: sprintWhere) {
    deleteSprints(where: $where) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

const deleteSprintBackend = async (
  sprintId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  deleteSprint: any
) => {
  await client
    .mutate({
      mutation,
      variables: {
        where: {
          id: sprintId,
        },
      },
    })
    .then((response: FetchResult<any>) => {
      // deleteSprint(id)
      console.log(response);
    })
    .catch((error: FetchError) => {
      console.log(error.message, "delete sprint");
    });
};

const CONNECT_TO_STORY = gql`
  ${Sprint_Fragment}
  mutation connectToStory($where: sprintWhere, $connect: sprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;

const connectToStory = (
  sprintId: string,
  storyId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  connectToStoryFromStore: any
) => {
  client
    .mutate({
      mutation,
      variables: {
        where: {
          id: sprintId,
        },
        connect: {
          fileHas: [
            {
              where: {
                node: {
                  id: storyId,
                },
              },
            },
          ],
        },
      },
    })
    .then((response: FetchResult<any>) => {
      console.log(response);
      // connectToStory(response.data)
    })
    .catch((error: FetchError) => {
      console.log(error.message, "connect sprint to story");
    });
};

// connect to epic

const CONNECT_TO_EPIC = gql`
  ${Sprint_Fragment}
  mutation connectToEpic($where: sprintWhere, $connect: sprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;

const connectToEpic = (
  sprintId: string,
  epicId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  client
    .mutate({
      mutation,
      variables: {
        where: {
          id: sprintId,
        },
        connect: {
          folderHas: [
            {
              where: {
                node: {
                  id: epicId,
                },
              },
            },
          ],
        },
      },
    })
    .then((response: FetchResult<any>) => {
      console.log(response);
    })
    .catch((error: FetchError) => {
      console.log(error.message, "from connect sprint to epic");
    });
};

//sprint to task

const CONNECT_TO_TASK = gql`
  ${Sprint_Fragment}
  mutation connectToTask($where: sprintWhere, $connect: sprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;

const connectToTask = (
  sprintId: string,
  taskId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  client
    .mutate({
      mutation,
      variables: {
        where: {
          id: sprintId,
        },
        connect: {
          flownodeHas: [
            {
              where: {
                node: {
                  id: taskId,
                },
              },
            },
          ],
        },
      },
    })
    .then((response: FetchResult) => {
      console.log(response);
    })
    .catch((error: FetchError) => {
      console.log(error.message, "connecting sprint to task error");
    });
};

export {
  GET_SPRINTS,
  getSprintByProjectId,
  SPRINTS_FOR_BACKLOGS,
  getSprintToBacklogs,
  createSPrintBackend,
  CREATE_SPRINT_MUTATION,
  CONNECT_TO_EPIC,
  CONNECT_TO_STORY,
  CONNECT_TO_TASK,
  connectToEpic,
  connectToTask,
  connectToStory,
  deleteSprintBackend,
  updateSprintBackend,
  DELETE_SPRINT,
  UPDATE_SPRINT_MUTATION,
};
