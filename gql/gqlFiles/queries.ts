import { gql } from "@apollo/client";

//Get root using unique userName(UID)
export const getProjectById = gql`
  query getprojectById($where: ProjectWhere) {
    projects(where: $where) {
      name
      description
      isOpen
      id
      hasContainsFile {
        type
        id
        name
        uid
        hasSprint {
          id
          name
        }
        projectHas {
          id
          name
        }
        hasComments {
          id
          message
          timeStamp
          createdBy {
            emailId
          }
        }
        folderHas {
          id
          name
        }
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasNodes {
          id
          draggable
          flowchart
          type
          timeStamp
          uid
          label
          shape
          x
          y
          flowEdge {
            id
            label
            bidirectional
            boxCSS
            pathCSS
            selected
            createdBy {
              id
              emailId
            }

            flowNodeConnection {
              edges {
                handle
                node {
                  id
                }
              }
            }
          }
          isLinked {
            id
            label
            isLinkedConnection {
              edges {
                from
              }
            }
            hasFile {
              id
            }
          }
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          hasComments {
            message
            createdBy {
              emailId
            }
          }
          hasSprint {
            id
            name
          }
          hasFile {
            id
            name
            folderHas {
              id
              name
            }
          }
        }
      }
      hasContainsFolder {
        id
        type
        isOpen
        name
        uid
        hasSprint {
          id
          name
        }
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasFile {
          type
          id
          name
          uid
          hasSprint {
            id
            name
          }
          projectHas {
            id
            name
          }
          hasComments {
            id
            message
            timeStamp
            createdBy {
              emailId
            }
          }
          folderHas {
            id
            name
          }
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          hasNodes {
            id
            draggable
            flowchart
            type
            timeStamp
            uid
            label
            shape
            x
            y
            flowEdge {
              id
              label
              bidirectional
              boxCSS
              pathCSS
              selected
              createdBy {
                id
                emailId
              }

              flowNodeConnection {
                edges {
                  handle
                  node {
                    id
                  }
                }
              }
            }
            isLinked {
              id
              label
              isLinkedConnection {
                edges {
                  from
                }
              }
              hasFile {
                id
              }
            }
            hasInfo {
              description
              assignedTo
              status
              dueDate
            }
            hasComments {
              message
              createdBy {
                emailId
              }
            }
            hasSprint {
              id
              name
            }
            hasFile {
              id
              name
              folderHas {
                id
                name
              }
            }
          }
        }
      }
      usersInProjects {
        emailId
        userType
      }
    }
  }
`;
export const getFile = gql`
  query Query($where: FileWhere) {
    files(where: $where) {
      name
      id
      type
      hasNodes {
        id
        draggable
        flowchart
        type
        timeStamp
        uid
        label
        shape
        x
        y
        flowEdge {
          id
          label
          bidirectional
          boxCSS
          pathCSS
          selected
          createdBy {
            id
            emailId
          }

          flowNodeConnection {
            edges {
              handle
              node {
                id
              }
            }
          }
        }
        isLinked {
          id
          label
          isLinkedConnection {
            edges {
              from
            }
          }
          hasFile {
            id
          }
        }
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasComments {
          message
          createdBy {
            emailId
          }
        }
        hasSprint {
          id
          name
        }
        hasFile {
          id
          name
          folderHas {
            id
            name
          }
        }
      }
    }
  }
`;
//getting uid
export const getUidQuery = gql`
  query Uids {
    uids {
      id
      uid
    }
  }
`;
