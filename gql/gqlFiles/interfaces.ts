export interface File {
    name: string;
    id: string;
    hasflowchart: any;
    flowchart: any;
    type: "file";
    __typename: "file";
  }
  
  export interface Folder {
    id: string;
    type: "folder";
    isOpen: boolean;
    name: string;
    uid: number
    hasFolder: Folder[];
    hasFile: File[];
    children: (Folder | File)[];
    __typename: "folder";
  }
  
  export interface Main {
    name: string;
    isOpen: boolean;
    id: string;
    hasContainsFile: File[];
    hasContainsFolder: Folder[];
    children: (Folder | File)[];
    __typename: "main";
    userHas: File[];
    description: string;
  }
  
  interface Data {
    mains: Main[];
  }
  
  interface RootObject {
    data: Data;
  }
  
 export function transformObject(root: RootObject): RootObject {
    const transformMain = (main: Main): Main => ({
      ...main,
      children: [
        ...(Array.isArray(main.hasContainsFolder)
          ? main.hasContainsFolder.map(transformFolder)
          : []),
        ...(main.hasContainsFile || []),
      ].map((item) => {
        if (item.type === "file") {
          return item;
        }
        return transformFolder(item);
      }),
      hasContainsFolder: main.hasContainsFolder.map((folder) =>
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
            flowchart: item.hasflowchart,
          };
        }
        return transformFolder(item);
      }),
    });
  
    const transformData = (data: Data): Data => ({
      ...data,
      mains: data.mains.map((main) => transformMain(main)),
    });
  
    return {
      ...root,
      data: transformData(root.data),
    };
  }
  
  
  
  
  