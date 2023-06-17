import { gql } from "@apollo/client";

const typeDefs = gql`# ! Interfaces only work on relationships!
type user{
  id:ID! @id
  timeStamp:DateTime! @timestamp
  userName: String
  emailId: String!
  userType:String
  hasProjects:[main!]! @relationship (type: "hasMain",direction: OUT)
  active: Boolean!
}
type main {
  id: ID! @id
  timeStamp: DateTime! @timestamp
  userName: String
  description:String
  name: String!
  isOpen: Boolean!
  userHas: user @relationship (type: "hasMain", direction:IN)
  hasContainsFolder: [folder!]! @relationship(type: "hasFolder", direction: OUT)
  hasContainsFile: [file!]! @relationship(type: "hasFile", direction: OUT)
}

type Query{
projects:[main!]!
getUsers:[user!]!
}

type Mutation{
 createProject(newProject:projectInput!):main
 updateProject(projectData:projectInput!):updateData
 addUser(newUser:userInput!):user
}

input userEmail{
email:String!
}

input projectInput{
 name:String!
 description:String
 userName:String!
 isOpen: Boolean!
}

input userInput{
userName:String!
emailId:String!
userType:String
active:Boolean!
}

type updateData{
id: ID!
name:String!
description:String!
userName:String!
isOpen:Boolean!
}

type folder {
  id: ID! @id
  #parentId: ID! @id
  type: String!
  isOpen: Boolean!
  timeStamp: DateTime @timestamp
  name: String!
  mainHas: main @relationship(type: "hasFolder", direction: IN)
  hasFolder: [folder!]! @relationship(type: "hasFolder", direction: OUT)
  hasFile: [file!]! @relationship(type: "hasFile", direction: OUT)
}

type file {
  id: ID! @id
  #parentId: ID! @id
  timeStamp: DateTime! @timestamp
  type: String!
  name: String!
  hasflowchart: flowchart @relationship(type: "hasFlowchart", direction: OUT)
  folderHas: folder @relationship(type: "hasFolder", direction: IN)
  #hasFlownodes: [flowNode!]! @relationship (type:"hasFlownodes", direction:OUT)
  mainHas: main @relationship(type: "hasFile", direction: IN)
}

type flowchart {
  name: String!
  hasFile: file @relationship(type: "hasFlowchart", direction: IN)
  nodes: [flowNode!]! @relationship(type: "hasFlownodes", direction: OUT)
  edges: [flowEdge!]! @relationship(type: "hasFlowedges", direction: OUT)
}

type flowNode {
  id: ID! @id
  timeStamp: DateTime! @timestamp
  draggable: Boolean!
  flowchart: String!
  type: String!
  hasdataNodedata: nodeData @relationship(type: "hasData", direction: OUT)
  haspositionPosition: position
    @relationship(type: "hasPosition", direction: OUT)
  connectedbyFlowedge: [flowEdge!]!
    @relationship(type: "connectedBy", direction: OUT)
  flowNodeHas: file @relationship(type: "hasFile", direction: IN)
  hasTasks: tasks @relationship(type: "hasTasks", direction: OUT)
  flowedgeConnectedto: [flowEdge!]!
    @relationship(type: "connectedTo", direction: IN)
}

type nodeData {
  label: String!
  shape: String!
  description: String
  links: link @relationship(type:"hasLink",direction:OUT)
  linkedBy:linked @relationship(type:"hasLinkedBy",direction:OUT)
  flownodeHasdata: flowNode @relationship(type: "hasData", direction: IN)
}

type link{
label:String
id:ID
flag:Boolean!
fileId:String
hasLink:nodeData @relationship(type: "hasLink", direction:IN)
}
type linked{
label:String
id:ID
flag:Boolean!
fileId:String
hasLinked:nodeData @relationship(type: "hasLinkedBy", direction:IN)
}

type position {
  name: String!
  x: Float!
  y: Float!
  flownodeHasposition: flowNode
    @relationship(type: "hasPosition", direction: IN)
}

type edgeData {
  id: ID! @id
  label: String
  pathCSS: String!
  boxCSS: String!
  bidirectional: Boolean!
  flowedgeHasedgedata: flowEdge
    @relationship(type: "hasEdgeData", direction: IN)
}

type flowEdge {
  id: ID! @id
  name: String!
  timeStamp: DateTime! @timestamp
  source: String!
  target: String!
  sourceHandle: String!
  targetHandle: String!
  selected: Boolean!
  # * Connections below
  flownodeConnectedby: flowNode
    @relationship(type: "connectedBy", direction: IN)
  connectedtoFlownode: flowNode
    @relationship(type: "connectedTo", direction: OUT)
  hasedgedataEdgedata: edgeData
    @relationship(type: "hasEdgeData", direction: OUT)
}

type tasks {
  id: ID! @id
  timeStamp: DateTime! @timestamp
  flownodeHastask: flowNode @relationship(type: "hasTasks", direction: IN)
}
`;

export default typeDefs;