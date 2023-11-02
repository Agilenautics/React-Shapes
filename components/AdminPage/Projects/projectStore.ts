import { create } from "zustand";
import { Project } from "../../../lib/appInterfaces";
import { ApolloError } from "apollo-server-core";

export interface ProjectState {
  projects: Array<Project>;
  updateProjectData: (
    projects: Array<Project>,
    loading: boolean | undefined,error:any
  ) => void;
  addProject: (data: Project) => void;
  MovetoRecycleBin: (projectId: string) => void;
  updateProject: (id: string, project: object) => void;
  sortOrder: string;
  updateSortOrder: (sortValue: string) => void;
  handleSorting: () => void;
  loading: Boolean;
  error: any; // TODO : define type for the errors;
  recycleBin: Array<Project>;
  updateRecycleBinProject: (projects:Array<Project>) => void;
  clearRecyleBin: () => void;
  removeFromRecycleBin: (projectId: string) => void;
  search: string;
  updateSearchItem: (search: string) => void;
}

const projectStore = create<ProjectState>((set) => ({
  projects: [],
  search: "",
  error: null,
  sortOrder: "asc",
  searchProduct: "",
  updateSearchItem: (searchQuery: string) =>
    set((state) => {
      return { search: searchQuery };
    }),
  recycleBin: [],
  addProject: (newProject: Project) =>
    set((state) => {
      const isDuplicateName = state.projects.some(
        (project) => project.name === newProject.name
      );
      if (isDuplicateName) {
        // If a project with the same name exists, update the error message
        return { error: "A project with the same name already exists" };
      }
      const updatedProjects = [...state.projects, newProject];

      return { projects: updatedProjects, error: null };
    }),
  updateProjectData: (projects: Array<Project>, loading: boolean | undefined,error:any) =>
    set((state) => {
      const updatedProjects = projects.filter(
        (values) => values.recycleBin !== true
      );
      return { projects: updatedProjects, loading,error };
    }),
  updateRecycleBinProject: (projects:Array<Project>) =>
    set((state) => {
      const recycleBinProjects = projects.filter(
        (values: Project) => values.recycleBin === true
      );
      return { recycleBin: recycleBinProjects };
    }),
  clearRecyleBin: () =>
    set((state) => {
      return { recycleBin: [] };
    }),
  MovetoRecycleBin: (id: string) =>
    set((state) => {
      const newProjects = state.projects?.filter(
        (project) => project.id !== id
      );
      const to_be_deleted = state.projects.filter(
        (project) => project.id === id
      )[0];
      const to_be_updated = { ...to_be_deleted, recycleBin: true };
      const updated_Bin = [...state.recycleBin, to_be_updated];
      return { projects: newProjects, recycleBin: updated_Bin };
    }),
  updateProject: (id: string, data: any) =>
    set((state) => {
      const { projectName, projectDesc } = data;

      // Check if the new project name is already used by another project
      // const isDuplicateName = state.projects.some(
      //     (project) => project.name === projectName && project.id !== id
      // );

      // if (isDuplicateName) {
      //     // If a duplicate name is found, update the error message
      //     return { error: "Project name already exists with a different ID" };
      // }

      // If no duplicate name found, proceed with updating the project
      const updatedProjects = state.projects.map((project) => {
        if (project.id === id) {
          // Update the project with the specified id
          return {
            ...project,
            name: projectName,
            description: projectDesc,
          };
        }
        return project; // For other projects, return as it is
      });

      return { projects: updatedProjects, error: null };
    }),
  loading: true,
  updateSortOrder: (sortValue: string) =>
    set((state) => {
      return { sortOrder: sortValue };
    }),
  handleSorting: () =>
    set((state) => {
      const sortedProjects = [...state.projects].sort((a, b) =>
        state.sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
      const sortedRecycleBin = [...state.recycleBin].sort((a, b) =>
        state.sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
      return { projects: sortedProjects, recycleBin: sortedRecycleBin };
    }),
  removeFromRecycleBin: (projectId: String) =>
    set((state) => {
      const to_be_delete = state.recycleBin.filter(
        (projects) => projects.id !== projectId
      );
      return { recycleBin: to_be_delete };
    }),
}));

export default projectStore;
