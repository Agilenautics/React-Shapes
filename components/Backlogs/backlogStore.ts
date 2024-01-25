import { create } from "zustand";
import { Backlog } from "../../lib/appInterfaces";

interface BacklogState {
  parents: any;
  updateRow: any;
  addRow: any;
  allStories: any;
  allStatus: any;
  backlogs: Array<Backlog>;
  updateBacklogsData: (backlogs: Array<Backlog>) => void;
}

const backlogStore = create<BacklogState>((set) => ({
  backlogs: [],
  allStories: [],
  parents: [],
  allStatus: [],
  updateBacklogsData: (backlogs: Array<Backlog>) =>
    set((state): any => {
      const parents: any[] = [{ name: "Select Epic", id: "" }];
      const allStories: any[] = [];
      const allStatus: any[] = ["To-Do", "In-Progress", "Completed"];
      let temproary = [];
      // console.log(backlogs);

      while (allStories.length) {
        allStories.pop();
      }
      while (parents.length != 1) {
        parents.pop();
      }

      if (!backlogs) {
        return [];
      }

      for (let i of backlogs) {
        if (i.type == "folder") {
          parents.push({ name: i.name, id: i.id });

          for (let j of i.hasFile) {
            allStories.push({ ...j, parent: { name: i.name, id: i.id } });
            if (!allStatus.includes(j.hasInfo.status)) {
              allStatus.push(j.hasInfo.status);
            }

            temproary.push({
              ...j,
              ...j.hasInfo,
              hasSprint: j.hasSprint,
              uid: j.uid,
              timeStamp: j.timeStamp,
              parent: { name: i.name, id: i.id },
            });
          }
        } else if (i.type == "file") {
          allStories.push({ ...i, parent: { name: "No epic", id: "" } });

          if (!allStatus.includes(i.hasInfo.status)) {
            allStatus.push(i.hasInfo.status);
          }

          temproary.push({
            ...i,
            ...i.hasInfo,
            hasSprint: i.hasSprint,
            uid: i.uid,
            timeStamp: i.timeStamp,
            parent: { name: "No epic", id: "" },
          });
        }
      }

      for (let i of allStories) {
        if (i.hasNodes) {
          for (let j of i.hasNodes) {
            if (!allStatus.includes(j.hasInfo.status)) {
              allStatus.push(j.hasInfo.status);
            }
            temproary.push({
              ...j.hasInfo,
              ...j.data,
              hasSprint: j.hasSprint,
              id: j.id,
              type: j.type,
              uid: j.uid,
              parent: i.parent,
              timeStamp: j.timeStamp,
              story: { name: i.name, id: i.id },
            });
          }
        }
      }
      return { backlogs: temproary, allStories, parents, allStatus };
    }),
  addRow: (newRow: any) =>
    set((state) => ({
      backlogs: [...state.backlogs, { ...newRow, id: newRow.id }],
    })),
  updateRow: (newRow: any) =>
    set((state) => ({
      backlogs: [
        ...state.backlogs.filter((element: any) => element.id !== newRow.id),
        { ...newRow },
      ],
    })),
}));

export default backlogStore;
