export interface Project {
    id: string;
    name: string;
    desc: string;
  }
  
  export const updateProjectName = (
    projectId: string,
    updatedName: string,
    projectsList: Project[]
  ): Project[] => {
    return projectsList.map((project) => {
      if (project.id === projectId) {
        return { ...project, name: updatedName };
      }
      return project;
    });
  };
  
  export const deleteProject = (
    projectId: string,
    projectsList: Project[]
  ): Project[] => {
    return projectsList.filter((project) => project.id !== projectId);
  };
  