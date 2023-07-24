import { create } from "zustand";

interface Project {
    id?: string;
    name: string;
    recycleBin: Boolean;
    createdAt: Date | null;
    timeStamp: string;
    description: string;
}

export interface ProjectState {
    projects: Array<Project>;
    updateProjectData: (projects: Array<Project>) => void;
    deleteProject: (projectId: string) => void;
    updateProject: (id: string, project: Project) => void;
    sortOrder: string;
    updateSortOrder: (sortValue: string) => void;
    handleSorting: () => void;
    loading: Boolean;
    // error: any|null ; // TODO : define type for the errors;
    searchProduct: string
    setSearchProduct: (searchTerm: string) => void;

}

const projectStore = create<ProjectState>((set) => ({
    projects: [],
    sortOrder: "asc",
    searchProduct: "",
    updateProjectData: (projects: Array<Project>) =>
        set((state) => {

            return { projects }
        }),
    deleteProject: (id: string) =>
        set((state) => {
            const newProjects = state.projects?.filter(project => project.id !== id);
            return { projects: newProjects }
        }),
    updateProject: (id: string, data: object) =>
        set((state) => {
            const project = state.projects.filter((value) => value.id === id)[0];
            const to_be_updated = state.projects.filter((value) => value.id !== id)
            return { projects: [...to_be_updated, project] }
        }),
    loading: true,
    updateSortOrder: (sortValue: string) =>
        set((state) => {
            return { sortOrder: sortValue }
        })
    ,
    handleSorting: () =>
        set((state) => {
            const sortedProjects = [...state.projects].sort((a, b) => state.sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
            return { projects: sortedProjects }
        }),
    setSearchProduct: (searchTerm: string) =>
        set((state) => {
            const filteredProject = state.projects.filter((value) => value.name.toLocaleLowerCase().includes(state.searchProduct.toLocaleLowerCase()));
            return {projects: filteredProject, searchProduct: searchTerm }
        })
}))

export default projectStore