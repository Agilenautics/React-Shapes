export interface File {
  name: string;
  id: string;
  hasNodes: any;
  hasEdges:any;
  flowchart: any;
  type: "file";
  __typename: "file";
}

export interface Folder {
  id: string;
  type: "folder";
  isOpen: boolean;
  name: string;
  uid: number;
  hasFolder: Folder[];
  hasFile: File[];
  children: (Folder | File)[];
  __typename: "folder";
}

export interface Project {
  usersInProjects: any;
  name: string;
  isOpen: boolean;
  id: string;
  hasContainsFile: File[];
  hasContainsFolder: Folder[];
  children: (Folder | File)[];
  __typename: "project";
 // usersInProjects: File[];
  description: string;
}

interface Data {
  projects: Project[];
}

interface RootObject {
  data: Data;
}

export function transformObject(root: RootObject): RootObject {
  const transformMain = (project: Project): Project => ({
    ...project,
    children: [
      ...(Array.isArray(project.hasContainsFolder)
        ? project.hasContainsFolder.map(transformFolder)
        : []),
      ...(project.hasContainsFile || []),
    ].map((item) => {
      if (item.type === "file") {
        return item;
      }
      return transformFolder(item);
    }),
    hasContainsFolder: project.hasContainsFolder.map((folder) =>
      transformFolder(folder)
    ),
  });

  const transformFolder = (folder: Folder): Folder => ({
    ...folder,
    hasFolder: folder.hasFolder
      ? folder.hasFolder.map((f) => transformFolder(f))
      : [],
    children: [
      ...(Array.isArray(folder.hasFolder) ? folder.hasFolder : []),
      ...(folder.hasFile || []),
    ].map((item) => {
      if (item.type === "file") {
        return {
          ...item,
          nodes: item.hasNodes,
          edges:item.hasEdges
        };
      }
      return transformFolder(item);
    }),
  });

  const transformData = (data: Data): Data => ({
    ...data,
    projects: data.projects.map((project) => transformMain(project)),
  });

  return {
    ...root,
    data: transformData(root.data),
  };
}
