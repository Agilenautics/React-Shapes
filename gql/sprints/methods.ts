import client from "../../apollo-client";
import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
  FetchResult,
} from "@apollo/client";

import { FetchError } from "node-fetch";
export interface Sprint {
  id: string;
  name?: string | null;
  description: string;
  timeStamp: string;
  startDate: string;
  endDate: string;
}

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

const createSPrintBackend = (
  projectId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  inputVariables: Sprint,
  cahceQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  try {
   return client.mutate({
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
      update: (
        cache,
        {
          data: {
            createSprints: { sprints },
          },
        }
      ) => {
        const structuredSprint = {
          ...sprints[0], // we assume that the array only contains one item
          fileHas:[],
          folderHas:[],
          flownodeHas:[]
        }
        const existanceSprints = cache.readQuery({
          query: cahceQuery,
          variables: {
            where: {
              hasProjects: {
                id: projectId,
              },
            },
          },
        });

        cache.writeQuery({
          query: cahceQuery,
          variables: {
            where: {
              hasProjects: {
                id: projectId,
              },
            },
          },
          data: {
            // @ts-ignore
            sprints: [...existanceSprints.sprints, structuredSprint],
          },
        });
      },
    });
  } catch (error) {}
};
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
  getSprintByProjectId,
  getSprintToBacklogs,
  createSPrintBackend,
  connectToEpic,
  connectToTask,
  connectToStory,
  deleteSprintBackend,
  updateSprintBackend,
};
