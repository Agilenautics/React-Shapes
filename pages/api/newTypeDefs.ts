// import { gql } from "@apollo/client";

// const typeDefs = gql`
//   type User {
//     id: ID! @id
//     timeStamp: DateTime! @timestamp
//     emailId: String! @unique
//     active: Boolean!
//     userName: String
//     userType: String
//     #settings
//     organization: [Organization!]! @relationship(type: "CREATED/IS_MEMBER_OF", direction: OUT)
//   }

//   type Organization {
//     id: ID! @id
//     timeStamp: DateTime! @timestamp
//     name: String! 
//     description: String
//     #settings
//     #projectLimit
//     createdBy: User! @relationship(type: "CREATED_BY", direction: IN)
//     user: [User!]! @relationship(type: "CREATED/IS_MEMBER_OF", direction: IN)
//     folder: [Folder!]!
//       @relationship(type: "IS_FOLDER_OF", direction: IN)
//      }

//   type Folder {
//     id: ID! @id
//     type: String!
//     timeStamp: DateTime @timestamp
//     name: String!
//     description: String
//     createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
//     organization: Organization @relationship(type: "IS_FOLDER_OF", direction: OUT)
//     folder: [Folder!]! @relationship(type: "IS_SUB_FOLDER_OF", direction: IN)
//     file: [File!]! @relationship(type: "IS_INSIDE", direction:IN)
//     comment: [Comment!]! @relationship(type: "IS_COMMENTED_ON", direction: IN)
//    # workItem : [WorkItem!]! @ relationship (type: "IS_CHILD_OF", direction :IN)
//     attachment: [ExternalFile!]! @relationship(type: "IS_ATTACHED_TO", direction:IN)
//   }

//   type File {
//     id: ID! @id
//     timeStamp: DateTime! @timestamp
//     type: String!
//     name: String!
//     uid: Int!
//     description: String
//     createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
//     folder: Folder @relationship(type: "IS_INSIDE", direction: OUT)
//     flowNode: [FlowNode!]! @relationship(type: "IS_INSIDE", direction: IN)
//   }
//   type ExternalFile {
//     id: ID! @id
//     timeStamp: DateTime! @timestamp
//     mimetype: String!
//     encoding: String!
//     url: String!
//     createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
//     folder: Folder @relationship(type: "IS_ATTACHED_TO", direction: OUT)
//     flowNode: [FlowNode!]! @relationship(type: "IS_ATTACHED_TO", direction: OUT)
//   }

//   type WorkItem {
//     id: ID! @id
//     timeStamp: DateTime! @timestamp
//     type: String!
//     name: String!
//     uid: Int!
//     #cost
//     #time
//     #riskLevel
//     #approvals
//     createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
//     comment: [Comment!]! @relationship(type: "IS_COMMENTED_ON", direction: IN)
//     info: Info @relationship(type: "HAS_INFO", direction: OUT)
//     folder: Folder @relationship(type: "IS_INSIDE", direction: IN)
//     flowNode: [FlowNode!]! @relationship(type: "IS_CHILD_OF", direction: IN)
//     attachment: [ExternalFile!]! @relationship(type: "IS_ATTACHED_TO", direction:IN)
//   }
 
//   type FlowNode {
//     id: ID! @id
//     timeStamp: DateTime! @timestamp
//     draggable: Boolean!
//     flowchart: String!
//     type: String!
//     uid: Int!
//     label: String!
//     shape: String!
//     x: Float!
//     y: Float!
//     createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
//     file: File @relationship(type: "IS_INSIDE", direction: OUT)
//     comment: [Comment!]! @relationship(type: "IS_COMMENTED_ON", direction: IN)
//     #workItem : [WorkItem!]! @ relationship (type: "IS_CHILD_OF", direction :IN)
//     flowEdge: [FlowEdge!]!
//       @relationship(
//         type: "NODE_CONNECTED"
//         properties: "NODE_CONNECTED"
//         direction: OUT
//       )

//     flowNode: [FlowNode!]!
//       @relationship(
//         type: "IS_LINKED-TO"
//         properties: "IS_LINKED_TO"
//         direction: OUT
//         queryDirection: DEFAULT_UNDIRECTED
//       )
//     info: Info @relationship(type: "HAS_INFO", direction: OUT)

//   }

//   interface IS_LINKED_TO @relationshipProperties {
//     from: String!
//   }
 
//   type FlowEdge {
//     id: ID! @id
//     timeStamp: DateTime! @timestamp
//     selected: Boolean
//     label: String
//     pathCSS: String
//     boxCSS: String
//     bidirectional: Boolean
//     createdBy: User! @relationship(type: "CREATED_BY", direction: OUT)
//     flowNode: [FlowNode!]!
//       @relationship(
//         type: "NODE_CONNECTED"
//         properties: "NODE_CONNECTED"
//         direction: IN
//       )
   
//   }
//   interface NODE_CONNECTED @relationshipProperties {
//     handle: String
//   }

//   type Info {
//     description: String
//     assignedTo: String
//     status: String!
//     dueDate: String
//   }

//   type Comment {
//     id: ID! @id
//     message: String
//     timeStamp: DateTime! @timestamp
//     createdBy: User @relationship(type: "CREATED_BY", direction: OUT)
//     folder: Folder @relationship(type: "IS_COMMENTED_ON", direction: OUT)
//     flowNode: FlowNode @relationship(type: "IS_COMMENTED_ON", direction: OUT)
//      #workItem : WorkItem @ relationship (type: "IS_COMMENTED_ON", direction : OUT)
//     #createdAt: DateTime! @timestamp(operations: CREATE)
//     #updatedAt: DateTime! @timestamp(operations: UPDATE)
//   }

//   type Uid {
//     id: ID! @id
//     uid: Int!
//   }
// `;

// export default typeDefs;
