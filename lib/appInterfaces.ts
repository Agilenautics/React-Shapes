import { Edge, Node } from "reactflow";
//user type Interface
interface User {
  id: string;
  // name:string
  userId: string;
  userName: string;
  userType: string;
  emailId: string;
  timeStamp: string;
  active: boolean;
  hasProjects: Array<Project>;
}

interface  NodeData {
  label:string;
  description:string;
  isLinked:Array<Node>;
  nodeColor:string;
  uid:number;
  shape:string;
}

//project type interface
interface Project {
  __typename: string;
  id: string;
  name: string;
  description: string;
  timeStamp: string;
  recycleBin: boolean;
  recentProject: string;
  deletedAT: string;
  isOpen: boolean;
  createdBy:User;
 hasContainsFolder: Folder[]|any;
  hasContainsFile: File[] | any;
  children?: (Folder | File)[] | any;
  usersInProjects: Array<User>;
}

// info type interface
interface Info {
  __typename: string;
  status: string;
  description: string;
    dueDate: string;
  assignedTo: string;
}

// comments interface
interface Comment {
  id: string;
  message: string;
  createdBy:User;
  timeStamp: string;
  __typename: string;
}

//File interface or story interface type
interface File {
  __typename: string;
  id: string;
  name: string;
  type: "file";
  isOpen: string;
  uid: number;
  timeStamp: string;
  hasInfo: Info;
  createdBy:User;
  projectHas: Project;
  comments: Array<Comment>;
  hasNodes: Array<Node>;
  hasEdges: Array<Edge>;
  folderHas: Folder;
  hasSprint: Array<Sprints>;
}

// folder or epic interface
interface Folder {
  __typename: string;
  id: string;
  name: string;
  type: "folder";
  timeStamp: string;
  uid: number;
  hasInfo: Info;
  createdBy:User;
  hasFile: Array<File>;
  hasFolder: Array<Folder>;
  hasSprint: Array<Sprints>;
  projectHas: Project;
  children: Array<Folder | File>;
}

// flowchart interface
// interface Flowchart {
//   __typename: string;
//   id: string;
//   name: string;
//   nodes: Array<Node>;
//   edges: Array<Edge>;
// }

// sprints interface
interface Sprints {
  __typename: string;
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdBy:User;
  timeStamp: string;
  description: string;
  folderHas: Array<Folder>;
  fileHas: Array<File>;
  flownodeHas: Array<Node>;
  hasProjects: Project;
}

interface Parent {
  id: string;
  name: string;
}

// backlogs interface
interface Backlog {
  id: string;
  timeStamp: string;
  uid: number;
  type: string;
  name: string;
  description: string;
  assignedTo: string;
  sprint: string;
  status: string;
  dueDate: string;
  hasInfo: Info;
  hasNodes:Array<Node>;
  hasEdges:Array<Edge>;
  hasSprint: Array<Sprints>;
  comments: Array<Comment>;
  folderHas: Array<Folder>;
  hasFile: Array<File>;
  parent: Parent;
  projectHas: Project;
}
interface EditingProps{
  flag:boolean;
  type:string
}

interface Data {
  projects: Array<Project>;
}

interface RootObject {
  data: Data;
}

export type {
  Backlog,
  Project,
  File,
  Folder,
  Info,
  Comment,
  Parent,
  Sprints,
  User,
  Data,
  RootObject,
  NodeData,
  EditingProps
};
