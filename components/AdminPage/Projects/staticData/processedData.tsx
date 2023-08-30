

export function processedData(tasks:any) {
    let initData2 = [];
    let temproary = [];
  
    for (let i of tasks) {
      if (i.type == "folder") {
        //@ts-ignore
        for (let j of i.hasFiles) {
          initData2.push(j);
          if (j.status == "To-Do")
            temproary.push({
              ...j,status:"To-Do"
            });
          else if (j.status == "In-Progress")
            temproary.push({
        ...j,
              status: "In-Progress",
            });
          else
            temproary.push({
        ...j,
              status: "Completed",
            });
        }
      } else if (i.type == "file") {
        initData2.push(i);
        if (i.status == "To-Do")
          temproary.push({
        ...i,
            status: "To-Do",
          });
        else if (i.status == "In-Progress")
          temproary.push({
        ...i,
            status: "In-Progress",
          });
        else
          temproary.push({
        ...i,
            status: "Completed",
          });
      }
    }
  
    for (let i of initData2) {
      if (i.node) {
        for (let j of i.node) {
          if (j.status == "To-Do")
            temproary.push({
              ...j,
              status: "To-Do",
            });
          else if (j.status == "In-Progress")
            temproary.push({
              ...j,
              status: "In-Progress",
            });
          else
            temproary.push({
              ...j,
              status: "Completed",
            });
        }
      }
    }
    return temproary
}