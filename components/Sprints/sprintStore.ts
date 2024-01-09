import { create } from "zustand";
import { Sprints } from "../../lib/appInterfaces";

interface SprintState {
  sprints: Array<Sprints>;
  loading: Boolean;
  error: any;
  updateSprints: (
    sprints: Array<Sprints>,
    loading: Boolean,
    error: any
  ) => void;
  addSprint: (newSprint: Sprints) => void;
  updateError: (error: any) => void;
  deleteSprint: (id: string) => void;
  hadleFilterSprint: (selectedSprint: string) => void;
  addTaskOrEpicOrStoryToSprint: (sprintId: string, newData: Sprints) => void;
}

const sprintStore = create<SprintState>((set) => ({
  sprints: [],
  loading: true,
  error: null,
  updateError: (error: any) =>
    set((state) => {
      return { error };
    }),
  updateSprints: (sprints: Array<Sprints>, loading: Boolean, error: any) =>
    set((state) => {
      return { sprints, loading, error };
    }),
  addSprint: (newSprint: Sprints) =>
    set((state) => {
      const newSprintData = {
        ...newSprint,
        folderHas: [],
        fileHas: [],
        flownodeHas: [],
      };
      const updatedSprint = [...state.sprints, newSprintData];
      return { sprints: updatedSprint };
    }),
  deleteSprint: (id: string) =>
    set((state) => {
      const deletedSprint = state.sprints.filter(
        (values: Sprints) => values.id !== id
      );
      return { sprints: deletedSprint };
    }),
  hadleFilterSprint: (selectedSprint: string) =>
    set((state) => {
      const filterSprints = state.sprints.filter(
        (sprint: Sprints) => sprint.name === selectedSprint
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
