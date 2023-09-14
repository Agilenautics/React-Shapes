import { create } from "zustand"

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

interface NodeData{
    label:string;
    description:string
}

interface Epic {
    id: string;
    name: string;
    type: string;
    hasInfo: Info;
}
interface Task{
    id:string,
    type:string
    hasInfo:Info
    hasdataNodedata:NodeData
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
    folderHas:Array<Epic>
}


interface SprintState {
    sprints: Array<Sprint>;
    loading: Boolean;
    error: any;
    updateSprints: (sprints: Array<Sprint>, loading: Boolean, error: any) => void;
}

const sprintStore = create<SprintState>((set) => ({
    sprints: [],
    loading: true,
    error: null,
    updateSprints: (sprints: Array<Sprint>, loading: Boolean, error: any) => (
        set((state) => {
            return { sprints, loading, error }
        })
    )
}));


export default sprintStore