import { File, Project } from "../../../lib/appInterfaces";
import { findById } from "../../TreeView/backend";

const getUpdatedCacheData = (projects: Array<Project>, id: string) => {
  const { hasContainsFolder, hasContainsFile } = projects[0];
  let fileData: File = hasContainsFile.find((file: File) => file.id === id);
  if (fileData === undefined) {
    const { hasNodes } = fileData;
    return;
  } else {
    // here if file inside the folder
    return null;
  }
};

export default getUpdatedCacheData;
