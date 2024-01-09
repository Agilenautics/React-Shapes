// have to check with irfan line no:8 & 10
import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import client from "../../apollo-client";
import { Project, User } from "../../lib/appInterfaces";
import { GET_PROJECTS } from "./GET_PROJECTS";
const getUserByEmail = async (
  email: String,
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  try {
    return await client.query({
      query: customQuery,
      variables: {
        where: {
          emailId: email,
        },
      },
    });
  } catch (errors) {
    console.log(errors, "while getUser by email");
  }
};

const get_user_method = async (
  email: string,
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  let admin = {};

  await client
    .query({
      query: customQuery,
      variables: {
        where: {
          emailId: email,
        },
      },
    })
    .then((res) => {
      admin = res.data.users;
    });
  return admin;
};

const delete_Project = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  email: string
) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  let deleteData = {};

  const newdate = year + "/" + month + "/" + day;
  await client
    .mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        update: {
          recycleBin: true,
          deletedAT: newdate,
        },
      },
      update: (
        cache,
        {
          data: {
            updateProjects: { projects },
          },
        }
      ) => {
        const existingUser = cache.readQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
        });
        const { hasProjects, ...userData } = existingUser.users[0];
        const updated_projects = hasProjects.map((project: Project) => {
          if (project.id === id) {
            return {
              ...project,
              ...projects[0]
            };
          }
          return project;
        });
        const updated_user = { ...userData, hasProjects: updated_projects };
        cache.writeQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
          data: {
            users: [updated_user],
          },
        });
      },
    })
    .then((response) => {
      deleteData = response.data.updateProjects;
    });
};

const update_recentProject = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        update: {
          recentProject: true,
        },
      },
      update: (cache, { data }) => {
        const existanceData = cache.readQuery({
          query: GET_PROJECTS,
          variables: {
            where: {
              emailId: "irfan123@gmail.com",
            },
          },
        });
      },
    });
  } catch (error) {
    console.log(error, "while deleting the project..");
  }
};
const restoreFromRecycleBin = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  email: string
) => {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        update: {
          recycleBin: false,
          deletedAT: "",
        },
      },
      update: (
        cache,
        {
          data: {
            updateProjects: { projects },
          },
        }
      ) => {
        const existanceUser = cache.readQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
        });
        const { hasProjects, ...userData } = existanceUser.users[0];
        const updated_projects = hasProjects.map((project: Project) => {
          if (project.id === id) {
            return {
              ...project,
              ...projects[0],
            };
          }
          return project;
        });
        const updated_user = { ...userData, hasProjects: updated_projects };
        cache.writeQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
          data: {
            users: [updated_user],
          },
        });
      },
    });
  } catch (error) {
    console.log(
      error,
      "error while restoring the the project from the recyclebin"
    );
  }
};

//parmenant delete project
const parmenantDelete = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  email: string
) => {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        delete: {
          hasContainsFile: [
            {
              delete: {
                hasNodes: [
                  {
                    delete: {
                      flowEdge: [
                        {
                          delete: {},
                        },
                      ],
                      hasInfo: {},
                    },
                  },
                ],
                hasInfo: {},
              },
            },
          ],
          hasContainsFolder: [
            {
              delete: {
                hasFolder: [
                  {
                    delete: {
                      hasFile: [
                        {
                          delete: {
                            hasInfo: {},
                            hasNodes: [
                              {
                                delete: {
                                  hasInfo: {},
                                  flowEdge: [
                                    {
                                      delete: {},
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                      hasInfo: {},
                    },
                  },
                ],
                hasFile: [
                  {
                    delete: {
                      hasInfo: {},
                      hasNodes: [
                        {
                          delete: {
                            hasInfo: {},
                            flowEdge: [
                              {
                                delete: {},
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
                hasInfo: {},
              },
            },
          ],
        },
      },
      update: (cache, { data }) => {
        const existingUser = cache.readQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
        });
        const { hasProjects, ...userData } = existingUser.users[0];
        const deletedProject = hasProjects.filter(
          (project: Project) => project.id !== id
        );
        const updated_user = { ...userData, hasProjects: deletedProject };
        cache.writeQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
          data: {
            users: [updated_user],
          },
        });
      },
    });
  } catch (error) {
    console.log(error, "while parmenant deleting the project");
  }
};

const clearRecycleBin = async (
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  email: string
) => {
  try {
    return await client.mutate({
      mutation,
      variables: {
        where: {
          recycleBin: true,
        },
        delete: {
          hasContainsFile: [
            {
              delete: {
                hasNodes: [
                  {
                    delete: {
                      flowEdge: [
                        {
                          delete: {},
                        },
                      ],
                      hasInfo: {},
                    },
                  },
                ],
                hasInfo: {},
              },
            },
          ],
          hasContainsFolder: [
            {
              delete: {
                hasFolder: [
                  {
                    delete: {
                      hasFile: [
                        {
                          delete: {
                            hasInfo: {},
                            hasNodes: [
                              {
                                delete: {
                                  hasInfo: {},
                                  flowEdge: [
                                    {
                                      delete: {},
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                      hasInfo: {},
                    },
                  },
                ],
                hasFile: [
                  {
                    delete: {
                      hasInfo: {},
                      hasNodes: [
                        {
                          delete: {
                            hasInfo: {},
                            flowEdge: [
                              {
                                delete: {},
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
                hasInfo: {},
              },
            },
          ],
        },
      },
      update: (cache, { data }) => {
        const existingData = cache.readQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
        });
        const { hasProjects, ...userData } = existingData.users[0];
        const to_be_updated = hasProjects.filter(
          (values: Project) => values.recycleBin !== true
        );
        const updated_user = { ...userData, hasProjects: to_be_updated };
        cache.writeQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
          data: {
            users: [updated_user],
          },
        });
      },
    });
  } catch (error) {
    console.log(error, "error while clearing recycleBin projects");
  }
};

const addProject_Backend = async (
  email: String,
  project: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  addProject: any,
  query: any
) => {
  let data = [];
  // try {
  await client
    .mutate({
      mutation,
      variables: {
        input: [
          {
            deletedAT: "",
            description: project.description,
            isOpen: true,
            name: project.name,
            recentProject: false,
            recycleBin: false,
            createdBy: {
              connect: {
                where: {
                  node: {
                    emailId: email,
                  },
                },
              },
            },
            usersInProjects: {
              connect: [
                {
                  where: {
                    node: {
                      emailId: email,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      update: (
        cache,
        {
          data: {
            createProjects: { projects },
          },
        }
      ) => {
        // @ts-ignore
        const { users } = cache.readQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
        });
        const { hasProjects, ...user } = users[0];
        const updated_projects = [...projects, ...hasProjects];
        const updated_user = { ...user, hasProjects: updated_projects };
        cache.writeQuery({
          query,
          variables: {
            where: {
              emailId: email,
            },
          },
          data: {
            users: [updated_user],
          },
        });
      },
    })
    .then((response) => {
      addProject(response.data.createProjects.projects[0]);
    });
  // } catch (error) {
  //   console.log(error, "While adding the project");
  // }
};

const edit_Project = async (
  id: string,
  projectName: string,
  projectDesc: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id,
      },
      update: {
        name: projectName,
        description: projectDesc,
      },
    },
    refetchQueries: [{ query: customQuery }],
  });
};

export {
  delete_Project,
  get_user_method,
  edit_Project,
  parmenantDelete,
  restoreFromRecycleBin,
  clearRecycleBin,
  addProject_Backend,
  update_recentProject,
  getUserByEmail,
};
