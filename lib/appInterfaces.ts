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
  hasContainsFile: File[];
  hasContainsFolder: Folder[];
  children: (Folder | File)[];
  userHas: Array<User>;
}

// info type interface
interface Info {
  __typename: string;
  status: string;
  description: string;
  sprint: string;
  dueDate: string;
  assignedTo: string;
}

// comments interface
interface Comment {
  id: string;
  message: string;
  user: User;
  timeStamp: string;
  __typename: string;
}

// folder or epic interface
interface Folder {
  __typename: string;
  id: string;
  name: string;
  type: string;
  timeStamp: string;
  uid: number;
  hasInfo: Info;
  hasFile: Array<File>;
  hasSprint: Array<Sprints>;
  children: (Folder | File)[];
}

// flowchart interface
interface Flowchart {
  __typename: string;
  id: string;
  name: string;
  nodes: Array<Node>;
  edges: Array<Edge>;
}

//File interface or story interface type
interface File {
  __typename: string;
  id: string;
  name: string;
  type: string;
  isOpen: string;
  uid: number;
  timeStamp: string;
  hasInfo: Info;
  projectHas: Project;
  comments: Array<Comment>;
  hasflowchart: Flowchart;
  folderHas: Folder;
  hasSprint: Array<Sprints>;
}

// sprints interface
interface Sprints {
  __typename: "sprint";
  id: string;
  name: string;
  startDate: string;
  endDate: string;
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
  hasflowchart: Flowchart;
  hasSprint: Array<Sprints>;
  comments: Array<Comment>;
  folderHas: Array<Folder>;
  hasFile: Array<File>;
  parent: Parent;
  projectHas: Project;
}

interface Main {
  __typename: string;
  id: string;
  name: string;
  description: string;
  timeStamp: string;
  recycleBin: boolean;
  recentProject: string;
  deletedAT: string;
  isOpen: boolean;
  hasContainsFile: File[];
  hasContainsFolder: Folder[];
  children: (Folder | File)[];
  userHas: Array<User>;
}

interface Data {
  mains: Main[];
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
  Flowchart,
  User,
  Data,
  RootObject,
  Main
};
