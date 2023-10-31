import { gql } from "@apollo/client";

const typeDefs = gql`
  # ! Interfaces only work on relationships!
  type User {
    id: ID! @id
    timeStamp: DateTime! @timestamp
    emailId: String!
    active: Boolean!
    userName: String
    userType: String
    hasComments: [Comment!]! @relationship(type: "hasUser", direction: IN)
    hasProjects: [Project!]! @relationship(type: "hasProject", direction: OUT)
  }

  #project scheme
  type Project {
    id: ID! @id
    timeStamp: DateTime! @timestamp
    name: String!
    isOpen: Boolean!
    recycleBin: Boolean!
    recentProject: Boolean!
    deletedAT: String!
    description: String
    userHas: [User!]! @relationship(type: "hasProject", direction: IN)
    hasContainsFolder: [Folder!]!
      @relationship(type: "hasFolder", direction: OUT)
    hasContainsFile: [File!]! @relationship(type: "hasFile", direction: OUT)
    hasSprint: [Sprint!]! @relationship(type: "hasSprint", direction: IN)
  }

  #epic scheme
  type Folder {
    id: ID! @id
    type: String!
    isOpen: Boolean!
    timeStamp: DateTime @timestamp
    name: String!
    uid: Int!
    hasComments: [Comment!]! @relationship(type: "folderHas", direction: IN)
    hasSprint: [Sprint!]! @relationship(type: "hasSprint", direction: IN)
    hasInfo: Info @relationship(type: "hasInfo", direction: IN)
    projectHas: Project @relationship(type: "hasFolder", direction: IN)
    hasFolder: [Folder!]! @relationship(type: "hasFolder", direction: OUT)
    hasFile: [File!]! @relationship(type: "hasFile", direction: OUT)
  }

  # story scheme
  type File {
    id: ID! @id
    #parentId: ID! @id
    timeStamp: DateTime! @timestamp
    type: String!
    name: String!
    uid: Int!
    hasSprint: [Sprint!]! @relationship(type: "hasSprint", direction: IN)
    hasComments: [Comment!]! @relationship(type: "hasFile", direction: IN)
    hasInfo: Info! @relationship(type: "hasInfo", direction: IN)
    hasflowchart: Flowchart @relationship(type: "hasFlowchart", direction: OUT)
    folderHas: Folder @relationship(type: "hasFile", direction: IN)
    projectHas: Project @relationship(type: "hasFile", direction: IN)
  }

  type Flowchart {
    name: String!
    hasFile: File @relationship(type: "hasFlowchart", direction: IN)
    hasNodes: [FlowNode!]! @relationship(type: "hasFlownodes", direction: OUT)
    hasEdges: [FlowEdge!]! @relationship(type: "hasFlowedges", direction: OUT)
  }

  #task scheme
  type FlowNode {
    id: ID! @id
    timeStamp: DateTime! @timestamp
    draggable: Boolean!
    flowchart: String!
    type: String!
    uid: Int!
    status: String
    assignedTo: String
    hasSprint: [Sprint!]! @relationship(type: "hasSprint", direction: IN)
    hasInfo: Info @relationship(type: "hasInfo", direction: IN)
    hasComments: [Comment!]!
      @relationship(type: "hasFlownodes", direction: OUT)
    hasdataNodedata: NodeData @relationship(type: "hasData", direction: OUT)
    haspositionPosition: Position
      @relationship(type: "hasPosition", direction: OUT)
    connectedbyFlowedge: [FlowEdge!]!
      @relationship(type: "connectedBy", direction: OUT)
    flowNodeHas: File @relationship(type: "hasFile", direction: IN)
    hasTasks: Tasks @relationship(type: "hasTasks", direction: OUT)
    flowedgeConnectedto: [FlowEdge!]!
      @relationship(type: "connectedTo", direction: IN)
  }

  type NodeData {
    label: String!
    shape: String!
    description: String
    hasLinkedTo: LinkedTo @relationship(type: "hasLinkedTo", direction: OUT)
    hasLinkedBy: LinkedBy @relationship(type: "hasLinkedBy", direction: OUT)
    flownodeHasdata: FlowNode @relationship(type: "hasData", direction: IN)
  }

  type LinkedTo {
    label: String
    id: ID
    flag: Boolean!
    fileId: String
    hasLinkedTo: NodeData @relationship(type: "hasLinkedTo", direction: IN)
  }
  type LinkedBy {
    label: String
    id: ID
    flag: Boolean!
    fileId: String
    hasLinkedBy: NodeData @relationship(type: "hasLinkedBy", direction: IN)
  }

  type Position {
    name: String!
    x: Float!
    y: Float!
    flownodeHasposition: FlowNode
      @relationship(type: "hasPosition", direction: IN)
  }

  type EdgeData {
    id: ID! @id
    label: String
    pathCSS: String!
    boxCSS: String!
    bidirectional: Boolean!
    flowedgeHasedgedata: FlowEdge
      @relationship(type: "hasEdgeData", direction: IN)
  }

  type FlowEdge {
    id: ID! @id
    name: String!
    timeStamp: DateTime! @timestamp
    source: String!
    target: String!
    sourceHandle: String!
    targetHandle: String!
    selected: Boolean!
    # * Connections below
    flownodeConnectedby: FlowNode
      @relationship(type: "connectedBy", direction: IN)
    connectedtoFlownode: FlowNode
      @relationship(type: "connectedTo", direction: OUT)
    hasedgedataEdgedata: EdgeData
      @relationship(type: "hasEdgeData", direction: OUT)
  }

  type Info {
    description: String
    assignedTo: String
    status: String!
    dueDate: String
    sprint: String
  }

  type Sprint {
    id: ID! @id
    timeStamp: DateTime! @timestamp
    name: String!
    startDate: String!
    endDate: String!
    description: String
    #Epics
    folderHas: [Folder!]! @relationship(type: "hasSprint", direction: OUT)
    #stories
    fileHas: [File!]! @relationship(type: "hasSprint", direction: OUT)
    #Task
    flownodeHas: [FlowNode!]! @relationship(type: "hasSprint", direction: OUT)
    #projects
    hasProjects: Project @relationship(type: "hasProjects", direction: OUT)
  }

  type Comment {
    id: ID! @id
    message: String
    timeStamp: DateTime! @timestamp
    userHas: User @relationship(type: "hasUser", direction: OUT)
    taskHas: FlowNode @relationship(type: "hasFlownodes", direction: OUT)
    storyHas: File @relationship(type: "hasFile", direction: OUT)
    epicHas: Folder @relationship(type: "hasFolder", direction: OUT)
    sprintHas: Sprint @relationship(type: "hasSprint", direction: OUT)
   # createdAt:DateTime! @timestamp(operations: CREATE)
    #updatedAt:DateTime! @timestamp(operations: UPDATE)
  }

  type Uid {
    id: ID! @id
    uid: Int!
    flownodeHas: FlowNode @relationship(type: "hasId", direction: OUT)
  }

  type Tasks {
    id: ID! @id
    timeStamp: DateTime! @timestamp
    flownodeHastask: FlowNode @relationship(type: "hasTasks", direction: IN)
  }
`;

export default typeDefs;
