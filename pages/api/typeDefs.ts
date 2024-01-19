import { gql } from "@apollo/client";
// created by needs to be clarify in future
//No of users in the project in the front end
const typeDefs = gql`
  # ! Interfaces only work on relationships!
  type User {
    id: ID! @id
    timeStamp: DateTime! @timestamp
    emailId: String! @unique
    # @authorization(
    #   validate: [
    #     {
    #       when: [BEFORE]
    #       operations: [UPDATE, DELETE]
    #       where: { node: { emailId: "$jwt.email" } }
    #     }
    #   ]
    # )
    active: Boolean!
    userName: String
    userType: String
    hasComments: [Comment!]! @relationship(type: "HAS_COMMENT", direction: IN)
    hasProjects: [Project!]! @relationship(type: "HAS_PROJECT", direction: OUT)
  }

  #project scheme
  type Project {
    # @authorization(
    #   validate: [
    #     {
    #       when: [AFTER]
    #       operations: [UPDATE, DELETE]
    #       where: { node: { createdBy: { emailId: "$jwt.email" } } }
    #     }
    #   ]
    # )
    id: ID! @id
    timeStamp: DateTime! @timestamp
    name: String!
    isOpen: Boolean!
    recycleBin: Boolean!
    recentProject: Boolean!
    deletedAT: String!
    description: String
    createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
    usersInProjects: [User!]! @relationship(type: "HAS_PROJECT", direction: IN)
    hasContainsFolder: [Folder!]!
      @relationship(type: "HAS_FOLDER", direction: OUT)
    hasContainsFile: [File!]! @relationship(type: "HAS_FILE", direction: OUT)
    hasSprint: [Sprint!]! @relationship(type: "HAS_SPRINT", direction: IN)
  }

  #epic scheme
  type Folder {
    # @authorization(
    #   validate: [
    #     {
    #       when: [AFTER]
    #       operations: [UPDATE, DELETE]
    #       where: { node: { createdBy: { emailId: "$jwt.email" } } }
    #     }
    #   ]
    # )
    id: ID! @id
    type: String!
    isOpen: Boolean!
    timeStamp: DateTime @timestamp
    name: String!
    uid: Int!
    createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
    hasComments: [Comment!]! @relationship(type: "HAS_COMMENT", direction: IN)
    hasSprint: [Sprint!]! @relationship(type: "HAS_SPRINT", direction: IN)
    hasInfo: Info @relationship(type: "HAS_INFO", direction: OUT)
    projectHas: Project @relationship(type: "HAS_FOLDER", direction: IN)
    hasFolder: [Folder!]! @relationship(type: "HAS_FOLDER", direction: OUT)
    hasFile: [File!]! @relationship(type: "HAS_FILE", direction: OUT)
  }

  # story scheme
  type File {
    # @authorization(
    #   validate: [
    #     {
    #       when: [AFTER]
    #       operations: [UPDATE, DELETE]
    #       where: { node: { createdBy: { emailId: "$jwt.email" } } }
    #     }
    #   ]
    # )
    id: ID! @id
    #parentId: ID! @id
    timeStamp: DateTime! @timestamp
    type: String!
    name: String!
    uid: Int!
    createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
    hasSprint: [Sprint!]! @relationship(type: "HAS_SPRINT", direction: IN)
    hasComments: [Comment!]! @relationship(type: "HAS_FILE", direction: IN)
    hasInfo: Info @relationship(type: "HAS_INFO", direction: OUT)
    folderHas: Folder @relationship(type: "HAS_FILE", direction: IN)
    projectHas: Project @relationship(type: "HAS_FILE", direction: IN)
    hasNodes: [FlowNode!]! @relationship(type: "HAS_FLOWNODES", direction: IN)
  }

  #task scheme
  type FlowNode {
    # @authorization(
    #   validate: [
    #     {
    #       when: [AFTER]
    #       operations: [UPDATE, DELETE]
    #       where: { node: { createdBy: { emailId: "$jwt.email" } } }
    #     }
    #   ]
    # )
    id: ID! @id
    timeStamp: DateTime! @timestamp
    draggable: Boolean!
    flowchart: String!
    #type: String!
    nodeColor:String!
    uid: Int!
    label: String!
    shape: String!
    x: Float!
    y: Float!
    hasSprint: [Sprint!]! @relationship(type: "HAS_SPRINT", direction: IN)
    hasInfo: Info @relationship(type: "HAS_INFO", direction: OUT)
    hasComments: [Comment!]!
      @relationship(type: "HAS_FLOWNODES", direction: OUT)
    flowEdge: [FlowEdge!]!
      @relationship(
        type: "NODE_CONNECTED"
        properties: "NODE_CONNECTED"
        direction: OUT
      )
    createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
    # uidHas: Uid @relationship(type: "HAS_UID", direction: OUT)
    hasFile: File @relationship(type: "HAS_FLOWNODES", direction: OUT)

    isLinked: [FlowNode!]!
      @relationship(
        type: "HAS_LINKED"
        properties: "LINKED"
        direction: OUT
        queryDirection: DEFAULT_UNDIRECTED
      )
  }

  interface LINKED @relationshipProperties {
    from: String!
  }

  type FlowEdge {
    # @authorization(
    #   validate: [
    #     {
    #       when: [AFTER]
    #       operations: [UPDATE, DELETE]
    #       where: { node: { createdBy: { emailId: "$jwt.email" } } }
    #     }
    #   ]
    # )
    id: ID! @id
    timeStamp: DateTime! @timestamp
    selected: Boolean
    label: String
    pathCSS: String
    boxCSS: String
    bidirectional: Boolean
    # * Connections below
    createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
    flowNode: [FlowNode!]!
      @relationship(
        type: "NODE_CONNECTED"
        properties: "NODE_CONNECTED"
        direction: IN
      )
    # surafel suggested to remove has file connection
  }
  interface NODE_CONNECTED @relationshipProperties {
    handle: String
  }

  type Info {
    description: String
    assignedTo: String
    status: String!
    dueDate: String
  }

  type Sprint {
    id: ID! @id
    timeStamp: DateTime! @timestamp
    name: String!
    startDate: String!
    endDate: String!
    description: String
    #Epics
    folderHas: [Folder!]! @relationship(type: "HAS_SPRINT", direction: OUT)
    #stories
    fileHas: [File!]! @relationship(type: "HAS_SPRINT", direction: OUT)
    #Task
    flownodeHas: [FlowNode!]! @relationship(type: "HAS_SPRINT", direction: OUT)
    #projects
    hasProjects: Project @relationship(type: "HAS_SPRINT", direction: OUT)
  }

  type Comment {
    # @authorization(
    #   validate: [
    #     {
    #       when: [AFTER]
    #       operations: [UPDATE, DELETE]
    #       where: { node: { createdBy: { emailId: "$jwt.email" } } }
    #     }
    #   ]
    # )
    id: ID! @id
    message: String
    timeStamp: DateTime! @timestamp
    createdBy: User @relationship(type: "CREATED_BY", direction: OUT)
    # taskHas: FlowNode @relationship(type: "HAS_COMMENT", direction: OUT)
    storyHas: File @relationship(type: "HAS_COMMENT", direction: OUT)
    epicHas: Folder @relationship(type: "HAS_COMMENT", direction: OUT)
    sprintHas: Sprint @relationship(type: "HAS_COMMENT", direction: OUT)
    # createdAt:DateTime! @timestamp(operations: CREATE)
    #updatedAt:DateTime! @timestamp(operations: UPDATE)
  }

  type Uid {
    id: ID! @id
    uid: Int!
    uidHas: FlowNode @relationship(type: "HAS_UID", direction: IN)
  }

  # type Tasks {
  #   id: ID! @id
  #   timeStamp: DateTime! @timestamp
  #   flownodeHastask: FlowNode @relationship(type: "HAS_TASKS", direction: IN)
  # }
`;

export default typeDefs;
