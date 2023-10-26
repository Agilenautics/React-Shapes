import { create } from "zustand";
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
  description: string;
}

interface Epic {
  id: string;
  name: string;
  type: string;
  hasInfo: Info;
}
interface Task {
  id: string;
  type: string;
  hasInfo: Info;
  hasdataNodedata: NodeData;
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
  folderHas: Array<Epic>;
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
  updateError: (error: any) =>
    set((state) => {
      return { error };
    }),
  updateSprints: (sprints: Array<Sprint>, loading: Boolean, error: any) =>
    set((state) => {
      // getSprintByProjectId(projectId,GET_SPRINTS,state.updateSprints)
      return { sprints, loading, error };
    }),
  addSprint: (newSprint: Sprint) =>
    set((state) => {
      const updatedSprint = [...state.sprints, newSprint];
      return { sprints: updatedSprint };
    }),
  deleteSprint: (id: string) =>
    set((state) => {
      const deletedSprint = state.sprints.filter(
        (values: Sprint) => values.id !== id
      );
      return { sprints: deletedSprint };
    }),
  hadleFilterSprint: (selectedSprint: string) =>
    set((state) => {
      const filterSprints = state.sprints.filter(
        (sprint: Sprint) => sprint.name === selectedSprint
      );
      return { sprints: filterSprints };
    }),
  addTaskOrEpicOrStoryToSprint: (sprintId: string, newData: any) => {
    set((state) => {
      const { id, type, hasInfo } = newData;
      const { hasSprint, ...hasFlownode } = newData[0];

      // Find the sprint to update
      const sprintIndex = state.sprints.findIndex((s) => s.id === sprintId);

      if (
        sprintIndex !== -1 &&
        type !== "file" &&
        !state.sprints[sprintIndex].flownodeHas.some((item) => item.id === id)
      ) {
        const updatedSprint = {
          ...state.sprints[sprintIndex],
          flownodeHas: [...state.sprints[sprintIndex].flownodeHas, hasFlownode],
        };

        const updatedSprints = [...state.sprints];
        updatedSprints[sprintIndex] = updatedSprint;

        state.sprints = updatedSprints;

        //   return { sprints: updatedSprints };
      }

      console.log(state.sprints, "sprints");

      return { sprints: state.sprints };
    });
  },
}));

export default sprintStore;
