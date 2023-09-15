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
    backlogs: Array<Backlog>;
    updateBacklogsData: (backlogs: Array<Backlog>) => void;
    
}


const backlogStore = create<BacklogState>((set) => ({
    backlogs: [],
    updateBacklogsData: (backlogs: Array<Backlog>) => (
        // @ts-ignore
        set((state) => {
            const parents: any[] = [{ name: "Select Epic", id: "" }];
            const initData2: any[] = [];
            const allStatus: any[] = ["To-Do", "In-Progress", "Completed"];
            let temproary = [];
            // console.log(backlogs);

            while (initData2.length) {
                initData2.pop()
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

                        initData2.push({ ...j, parent: i.name });
                        if (!allStatus.includes(j.hasInfo.status)) {
                            allStatus.push(j.hasInfo.status)
                        }

                        temproary.push({
                            ...j,
                            ...j.hasInfo,
                            parent: i.name,
                        });
                    }
                } else if (i.type == "file") {
                    initData2.push({ ...i, parent: "No epic" });

                    if (!allStatus.includes(i.hasInfo.status)) {
                        allStatus.push(i.hasInfo.status)
                    }

                    temproary.push({
                        ...i,
                        ...i.hasInfo,
                        parent: "No epic",
                    });
                }
            }

            for (let i of initData2) {
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
                        });
                    }
                }
            }
            return { backlogs:temproary }
        })
    )

}))


export default backlogStore