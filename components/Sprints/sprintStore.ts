import { create } from "zustand"

export interface Sprint {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    timestamp: string
    fileHas: Array<File>
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