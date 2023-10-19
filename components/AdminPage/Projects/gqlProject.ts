import { DocumentNode, OperationVariables, TypedDocumentNode, gql } from "@apollo/client";
import client from "../../../apollo-client";
import { Project } from "./projectStore";

const GET_PROJECTS = gql`
query getProjets {
  projects {
    id
    isOpen
    name
    timeStamp
    userName
    description
    
  }
}
`

const Project_Fragment = gql`
  fragment ProjectFragment on main {
      id
      timeStamp
      description
      name
      recycleBin
      recentProject
      deletedAT
      userHas {
        emailId
        userType
      }
  }
`;

const GET_PROJECTS_BY_ID = gql`

query Projects {
  projects {
    id
    isOpen
    name
    recentProject
    recycleBin
    timeStamp
    userName
    deletedAT
    description
  }
}
`


const UserSheme = gql`
query GetUsers {
  getUsers {
    emailId
  }
}

`




const GET_USER = gql`
${Project_Fragment}
query getUser($where: userWhere) {
  users(where: $where) {
    active
    id
    userName
    userType
    emailId
    hasProjects {
    ...ProjectFragment 
    }
  }
}
`

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

const DELETE_PROJECT = gql`
mutation deleteProject($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
      id
      timeStamp
      description
      name
      recycleBin
      deletedAT
    }
  }
}
`

const recentProject_mutation = gql`
${Project_Fragment}
mutation updateRecentProject($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
    ...ProjectFragment
    }
  }
}

`


const update_recentProject = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,) => {
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
    // refetchQueries(result) {
    //   return [GET_USER]
    // },
  })
}


const delete_Project = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
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
    // update: (cache, { data }) => {
    //   const existingProjects = cache.readQuery({
    //     query,
    //     variables: {
    //       emailId: "irfan123@gmail.com"
    //     }
    //   });
    //   console.log("existing projects", existingProjects);
    //   const existingUser = existingProjects.users.filter((values: any) => values.emailId === "irfan123@gmail.com");


    //   cache.writeQuery({
    //     query,
    //     variables: {
    //       emailId: "irfan123@gmail.com"
    //     },
    //     data: {
    //       users: [...existingUser, ...data.updateMains.mains]
    //     }

    //   })

    //   // console.log(data)



    // },
    refetchQueries(result) {
      return [query]
    },
  }).then((response) => {
    deleteData = response.data.updateMains
  })
}

const recycleProject = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
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
    refetchQueries: [{
      query, variables: {
        emailId: "irfan123@gmail.com"
      }
    }],
  })
}

//parmenant delete mutation
const PARMENANT_DELETE = gql`
mutation parmenantDelete($where: mainWhere) {
  deleteMains(where: $where) {
    nodesDeleted
  }
}
`

//parmenant delete project
const parmenantDelete = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      }
    },
    refetchQueries: (result) => {
      return [query]
    },
  })

}

//clear reCycle bin

const CLEAR_RECYCLE_BIN = gql`
mutation clearBin($where: mainWhere, $delete: mainDeleteInput) {
  deleteMains(where: $where, delete: $delete) {
    relationshipsDeleted
  }
}`

const clearRecycleBin = async (mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
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
    refetchQueries: [{ query }]

  })


}





const ADD_PROJECT = gql`
${Project_Fragment}
mutation createProject($input: [mainCreateInput!]!) {
  createMains(input: $input) {
    mains {
      ...ProjectFragment
    }
  }
}
`
const addProject_Backend = async (email: String, project: any, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, addProject: any, query: any) => {
  console.log(project)
  let data = []
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
    

    update: (cache, { data }) => {
      const existingProjects = cache.readQuery({
        query,
        variables: {
          emailId: email
        }
      });
      console.log("existing projects", existingProjects);
      // @ts-ignore
      const existingUser = existingProjects.users.filter((values: any) => values.emailId === email);
      const projects = existingUser[0].hasProjects
      const upatedProjects = [...data.createMains.mains, ...projects]
      const updaedUser = { ...existingUser[0], hasProjects: upatedProjects }

      console.log(updaedUser)




      cache.writeQuery({
        query,
        variables: {
          emailId: email
        },
        data: {
          user: [updaedUser]
        }

      })


      //   // console.log(data)



    },
  }).then((response) => {
    // addProject(response.data.createMains.mains[0])
  }
  )
    .catch((error) => console.log(error))
}
const EDIT_PROJECT = gql`
mutation Mutation($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
      name
      description
    }
  }
}
`
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


export { GET_PROJECTS, DELETE_PROJECT, delete_Project, ADD_PROJECT, GET_USER, get_user_method, edit_Project, EDIT_PROJECT, parmenantDelete, PARMENANT_DELETE, recycleProject, CLEAR_RECYCLE_BIN, clearRecycleBin, addProject_Backend, update_recentProject, recentProject_mutation, getUserByEmail, UserSheme, GET_PROJECTS_BY_ID }