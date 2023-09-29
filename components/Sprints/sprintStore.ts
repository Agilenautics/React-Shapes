import { create } from "zustand"
import { GET_SPRINTS, getSprintByProjectId } from "./gqlSprints";

interface Info {
    status: string;
    description: string;
    assignedTo: string;
    dueDate: string;
}

interface Story {
    id: string;
    name: string;
    type: string;
    hasInfo: Info;
}

interface NodeData {
    label: string;
    description: string
}

interface Epic {
    id: string;
    name: string;
    type: string;
    hasInfo: Info;
}
interface Task {
    id: string,
    type: string
    hasInfo: Info
    hasdataNodedata: NodeData
}

export interface Sprint {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    timestamp: string;
    fileHas: Array<Story>;
    flownodeHas: Array<Task>;
    folderHas: Array<Epic>

}


interface SprintState {
    sprints: Array<Sprint>;
    loading: Boolean;
    error: any;
    updateSprints: (sprints: Array<Sprint>, loading: Boolean, error: any) => void;
    addSprint: (newSprint: Sprint) => void;
    updateError: (error: any) => void;
    deleteSprint: (id: string) => void;
    hadleFilterSprint: (selectedSprint: string) => void;
    addTaskOrEpicOrStoryToSprint: (sprintId: string, newData: Sprint) => void;
}


const sprintStore = create<SprintState>((set) => ({
    sprints: [],
    loading: true,
    error: null,
    updateError: (error: any) => (
        set((state) => {
            return { error }
        })
    ),
    updateSprints: (sprints: Array<Sprint>, loading: Boolean, error: any) => (
        set((state) => {
            // getSprintByProjectId(projectId,GET_SPRINTS,state.updateSprints)
            return { sprints, loading, error }
        })
    ),
    addSprint: (newSprint: Sprint) => (
        set((state) => {
            const updatedSprint = [...state.sprints, newSprint]
            return { sprints: updatedSprint }
        })
    ),
    deleteSprint: (id: string) => (
        set((state) => {
            const deletedSprint = state.sprints.filter((values: Sprint) => values.id !== id);
            return { sprints: deletedSprint };
        })
    ),
    hadleFilterSprint: (selectedSprint: string) => (
        set((state) => {
            const filterSprints = state.sprints.filter((sprint: Sprint) => sprint.name === selectedSprint);
            return { sprints: filterSprints }
        })
    ),
    addTaskOrEpicOrStoryToSprint: (sprintId: string, newData: any) => (
        set((state) => {
            const { id, type } = newData[0]
            const { hasSprint, ...hasFlownode } = newData[0]
            const sprint = state.sprints.filter((values) => values.id === sprintId)[0];

            if (type !== 'file' && sprintId) {
                const existanceTask = sprint.flownodeHas.some((value) => value.id === id);
                if (!existanceTask) {
                    const updatedFlownode = [...sprint.flownodeHas, hasFlownode];
                    const updateSprint = { ...sprint, flownodeHas: updatedFlownode };
                    const updated_sprints = state.sprints.map((values) => values.id === sprintId ? updateSprint : values);
                    state.sprints = updated_sprints
                }
            } else {
                console.log('file')
            }
            console.log(state.sprints)
            return {sprints:state.sprints}


        })
    )
}));


export default sprintStore