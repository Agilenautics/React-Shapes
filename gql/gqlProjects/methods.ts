import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import client from "../../apollo-client";
import { Project } from "../../components/AdminPage/Projects/projectStore";
import { GET_PROJECTS, GET_USER, GET_PROJECTS_BY_ID } from "./mutations";

const getUserByEmail = async (email: String, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>, methods: any) => {
  const { updateLoginUser, updateProjects, updateUserType, updateRecycleBinProject } = methods
  let admin = {}
  await client.query({
    query: customQuery,
    variables: {
      where: {
        emailId: email
      }
    }
  }).then((res) => {
    updateProjects(res.data.users[0].hasProjects, res.loading);
    updateRecycleBinProject(res.data.users[0].hasProjects, res.loading);
    updateLoginUser(res.data.users);
    updateUserType(res.data.users[0].userType)
    admin = res
  })

  return admin

}

const get_user_method = async (email: String, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {

  let admin = {}

  await client.query({
    query: customQuery,
    variables: {
      where: {
        emailId: email
      }
    }
  }).then((res) => {
    admin = res.data.users
  })
  return admin
}



const delete_Project = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>, email: string) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  let deleteData = {}

  const newdate = year + "/" + month + "/" + day;
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      },
      update: {
        recycleBin: true,
        deletedAT: newdate
      }
    },
    update: (cache, { data: { updateMains: { mains } } }) => {
      const existingUser = cache.readQuery({
        query,
        variables: {
          where: {
            emailId: email
          }
        }
      });
      const { hasProjects, ...userData } = existingUser.users[0]
      const updated_projects = hasProjects.map((project: Project) => {
        if (project.id === id) {
          return { ...mains[0] }
        }
        return project
      });
      const updated_user = { ...userData, hasProjects: updated_projects }
      cache.writeQuery({
        query,
        variables: {
          where: {
            emailId: email
          }
        },
        data: {
          users: [updated_user]
        }
      })
    },
  }).then((response) => {
    deleteData = response.data.updateMains
  })
}


const update_recentProject = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,) => {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id
        },
        update: {
          recentProject: true,
        }
      },
      update: (cache, { data }) => {
        const existanceData = cache.readQuery(
          {
            query: GET_USER,
            variables: {
              where: {
                emailId: "irfan123@gmail.com"
              }
            }
          }
        );
        console.log(existanceData, "hii")
      }
      // refetchQueries(result) {
      //   return [GET_USER]
      // },
    })

  } catch (error) {
    console.log(error, "while deleting the project..")

  }
}
const recycleProject = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id
        },
        update: {
          recycleBin: false,
          deletedAT: ""
        }
      },
      update: (cache, { data: { updateMains: { mains } } }) => {
        const existanceUser = cache.readQuery(
          {
            query,
            variables: {
              where: {
                emailId: "irfan123@gmail.com"
              }
            }
          }
        );
        const { hasProjects, ...userData } = existanceUser.users[0];
        const updated_projects = hasProjects.map((project: Project) => {
          if (project.id === id) {
            return {
              ...mains[0]
            }
          }
          return project
        });
        const updated_user = { ...userData, hasProjects: updated_projects }
        cache.writeQuery(
          {
            query,
            variables: {
              where: {
                emailId: "irfan123@gmail.com"
              }
            },
            data: {
              users: [updated_user]
            }
          }
        )
      }
    })

  } catch (error) {
    console.log(error, "error while restoring the the project from the recyclebin")
  }
}

//parmenant delete project
const parmenantDelete = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id
        }
      },
      update: (cache, { data }) => {
        const existingUser = cache.readQuery({
          query,
          variables: {
            where: {
              emailId: "irfan123@gmail.com"
            }
          }
        });
        const { hasProjects, ...userData } = existingUser.users[0]
        const deletedProject = hasProjects.filter((project: Project) => project.id !== id)
        const updated_user = { ...userData, hasProjects: deletedProject }
        cache.writeQuery(
          {
            query,
            variables: {
              where: {
                emailId: "irfan123@gmail.com"
              }
            },
            data: {
              users: [updated_user]
            }
          }
        );
      }
    })
  } catch (error) {
    console.log(error, "while parmenant deleting the project")
  }
}


const clearRecycleBin = async (mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  try {
    client.mutate({
      mutation,
      variables: {
        "where": {
          "recycleBin": true
        },
        "delete": {
          "hasContainsFile": [
            {
              "delete": {
                "hasflowchart": {
                  "delete": {
                    "edges": [
                      {
                        "delete": {
                          "hasedgedataEdgedata": {
                            "delete": {}
                          }
                        }
                      }
                    ],
                    "nodes": [
                      {
                        "delete": {
                          "haspositionPosition": {
                            "delete": {}
                          },
                          "hasdataNodedata": {}
                        }
                      }
                    ]
                  }
                }
              }
            }
          ],
          "hasContainsFolder": [
            {
              "delete": {
                "hasFile": [
                  {
                    "delete": {
                      "hasflowchart": {
                        "delete": {
                          "edges": [
                            {
                              "delete": {
                                "hasedgedataEdgedata": {}
                              }
                            }
                          ],
                          "nodes": [
                            {
                              "delete": {
                                "haspositionPosition": {},
                                "hasdataNodedata": {}
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                ],
                "hasFolder": [
                  {
                    "delete": {
                      "hasFile": [
                        {
                          "delete": {
                            "hasflowchart": {
                              "delete": {
                                "nodes": [
                                  {
                                    "delete": {
                                      "hasdataNodedata": {},
                                      "haspositionPosition": {}
                                    }
                                  }
                                ],
                                "edges": [
                                  {
                                    "delete": {
                                      "hasedgedataEdgedata": {}
                                    }
                                  }
                                ]
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      update: (cache, { data }) => {
        const existingData = cache.readQuery(
          {
            query,
            variables: {
              where: {
                emailId: "irfan123@gmail.com"
              }
            }
          }
        );
        const { hasProjects, ...userData } = existingData.users[0]
        const to_be_updated = hasProjects.filter((values: Project) => values.recycleBin !== true);
        const updated_user = { ...userData, hasProjects: to_be_updated }
        console.log(data)
        cache.writeQuery(
          {
            query,
            variables: {
              where: {
                emailId: "irfan123@gmail.com"
              }
            },
            data: {
              users: [updated_user]
            }
          }
        )
      }


    })

  } catch (error) {
    console.log(error, "error while clearing recycleBin projects")

  }


}

const addProject_Backend = async (email: String, project: any, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, addProject: any, query: any) => {
  let data = []
  try {
    await client.mutate({
      mutation,
      variables: {
        "input": [
          {
            "deletedAT": "",
            "description": project.description,
            "isOpen": true,
            "name": project.name,
            "recentProject": false,
            "recycleBin": false,
            "userHas": {
              "connect": [
                {
                  "where": {
                    "node": {
                      "emailId": email
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      update: (cache, { data: { createMains: { mains } } }) => {
        // @ts-ignore
        const { users } = cache.readQuery({
          query,
          variables: {
            where: {
              emailId: email
            }
          }
        });
        const { hasProjects, ...user } = users[0];
        const updated_projects = [...mains, ...hasProjects];
        const updated_user = { ...user, hasProjects: updated_projects };
        cache.writeQuery({
          query,
          variables: {
            where: {
              emailId: email
            }
          },
          data: {
            users: [updated_user]
          }
        })
      },
    }).then((response) => {
      addProject(response.data.createMains.mains[0])
    }
    )

  } catch (error) {
    console.log(error, "While adding the project")
  }

}

const edit_Project = async (id: string, projectName: string, projectDesc: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      },
      "update": {
        "name": projectName,
        "description": projectDesc,
      }
    },
    refetchQueries: [{ query: customQuery }]
  })
}

export {
  GET_PROJECTS,
  delete_Project,
    get_user_method,
  edit_Project,
  parmenantDelete,
  recycleProject,
    clearRecycleBin,
  addProject_Backend,
  update_recentProject,
  getUserByEmail,
  GET_PROJECTS_BY_ID,
};