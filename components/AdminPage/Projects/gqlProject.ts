import { DocumentNode, OperationVariables, TypedDocumentNode, gql } from "@apollo/client";
import client from "../../../apollo-client";

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


const GET_USER = gql`
query getUser($where: userWhere) {
  users(where: $where) {
    active
    id
    userName
    userType
    hasProjects {
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


const delete_Project = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  
  const newdate = year + "/" + month + "/" + day;
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      },
      update: {
        recycleBin: true,
        deletedAT:newdate
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

    //   cache.writeQuery({
    //     query,
    //     variables:{
    //       emailId:"irfan123@gmail.com"

    //     },
    //     data: {
    //       users: [existingProjects?.users]
    //     }

    //   })

    //   // console.log(data)



    // },
    refetchQueries(result) {
      return [GET_USER]
    },
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
        deletedAT:""
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
    refetchQueries:(result)=>{
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
mutation addProject($where: userWhere, $update: userUpdateInput) {
  updateUsers(where: $where, update: $update) {
    users {
      emailId
      id
      userType
      hasProjects {
        id
        name
        description
        recycleBin
        deletedAT
      }
    }
  }
}
`
const addProject_Backend =async (email:String,project:any,mutation:DocumentNode | TypedDocumentNode<any, OperationVariables>,query: DocumentNode | TypedDocumentNode<any, OperationVariables>  ) => {
  await client.mutate({
    mutation,
    variables: {
      where:{
        emailId:email
      },
      update: {
        hasProjects: [
          {
            create: [
              {
                node: {
                  description: project.description,
                  name: project.name,
                  isOpen: true,
                  recycleBin: false,
                  deletedAT:"",
                  userName: "",
                },
              },
            ],
          },
        ],
      },
    },
    refetchQueries(result) {
      return [{query}]
    },
  })
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


export { GET_PROJECTS, DELETE_PROJECT, delete_Project, ADD_PROJECT, GET_USER, get_user_method, edit_Project, EDIT_PROJECT, parmenantDelete, PARMENANT_DELETE, recycleProject, CLEAR_RECYCLE_BIN, clearRecycleBin,addProject_Backend }