import { create } from "zustand";

interface Info {
    status: string;
    description: string;
    sprint: string;
    dueDate: string;
    assignedTo: string

}

interface Flowchart {
    name: string;
    nodes: Array<Node>
}

interface Backlog {
    id: string;
    type: string;
    name: string;
    parent: string;
    description: string;
    assignedTo: string;
    sprint: string;
    status: string;
    dueDate: string;
    hasInfo: Info
    hasflowchart: Flowchart
}

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
    updateBacklogsData: (backlogs: Array<Backlog>) => (
        // @ts-ignore
        set((state) => {
            const parents: any[] = [{ name: "Select Epic", id: "" }];
            const allStories: any[] = [];
            const allStatus: any[] = ["To-Do", "In-Progress", "Completed"];
            let temproary = [];
            // console.log(backlogs);

            while (allStories.length) {
                allStories.pop()
            }
            while (parents.length != 1) {
                parents.pop()
            }

            if (!backlogs) {
                return [];
            }

            for (let i of backlogs) {
                if (i.type == "folder") {

                    parents.push({ name: i.name, id: i.id })


                    //@ts-ignore
                    for (let j of i.hasFile) {

                        allStories.push({ ...j, parent: {name:i.name, id: i.id}});
                        if (!allStatus.includes(j.hasInfo.status)) {
                            allStatus.push(j.hasInfo.status)
                        }

                        temproary.push({
                            ...j,
                            ...j.hasInfo,
                            parent: {name:i.name, id: i.id},
                        });
                    }
                } else if (i.type == "file") {
                    allStories.push({ ...i, parent:  {name:"No epic", id: ""}});

                    if (!allStatus.includes(i.hasInfo.status)) {
                        allStatus.push(i.hasInfo.status)
                    }

                    temproary.push({
                        ...i,
                        ...i.hasInfo,
                        parent:  {name:"No epic", id: ""} ,
                    });
                }
            }

            for (let i of allStories) {
                if (i.hasflowchart.nodes) {
                    for (let j of i.hasflowchart.nodes) {

                        if (!allStatus.includes(j.hasInfo.status)) {
                            allStatus.push(j.hasInfo.status)
                        }                        

                        temproary.push({
                            ...j.hasInfo,
                            ...j.hasdataNodedata,
                            id: j.id,
                            type: j.type,
                            parent: i.parent,
                            story:{name:i.name,id: i.id}
                        });
                    }
                }
            }
            
            return { backlogs:temproary, allStories, parents, allStatus }
        })
    ),
    addRow: (newRow: any) =>   
    set((state) => ({         
      backlogs: [...state.backlogs, { ...newRow, id: newRow.id }],
    })),
    updateRow: (newRow: any) =>
    set((state) => ({
      backlogs: [...(state.backlogs.filter((element:any)=> element.id !== newRow.id)),{ ...newRow, id: newRow.id }]
    })),

}))


export default backlogStore