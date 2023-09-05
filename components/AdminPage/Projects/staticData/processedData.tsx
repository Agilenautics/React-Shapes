export function processedData(tasks: any) {
  let initData2 = [];
  let temproary = [];

  if (!tasks) {
    return [];
  }
  
  for (let i of tasks) {
    if (i.type == "folder") {
      
      //@ts-ignore
      for (let j of i.hasFile) {
        initData2.push({ ...j, parent: i.name });
        if (j.hasInfo.status == "Completed")
          temproary.push({
            ...j,
            status: "Completed",
            parent: i.name,
          });
        else if (j.hasInfo.status == "In-Progress")
          temproary.push({
            ...j,
            status: "In-Progress",
            parent: i.name,
          });
        else
          temproary.push({
            ...j,
            status: "To-Do",
            parent: i.name,
          });
      }
    } else if (i.type == "file") {
      initData2.push({ ...i, parent: "No epic" });
      if (i.status == "Completed")
        temproary.push({
          ...i,
          status: "Completed",
          parent: "No epic",
        });
      else if (i.status == "In-Progress")
        temproary.push({
          ...i,
          status: "In-Progress",
          parent: "No epic",
        });
      else
        temproary.push({
          ...i,
          status: "To-Do",
          parent: "No epic",
        });
    }
  }

  for (let i of initData2) {
    if (i.hasflowchart.nodes) {
      for (let j of i.hasflowchart.nodes) {        
        if (j.hasInfo.status == "Completed")
          temproary.push({
            ...j.hasInfo,
            ...j.hasdataNodedata,
            id: j.id,
            status: "Completed",
            type: j.type,
            parent: i.parent,
          });
        else if (j.hasInfo.status == "In-Progress")
          temproary.push({
            ...j.hasInfo,
            ...j.hasdataNodedata,
            id: j.id,
            status: "In-Progress",
            type: j.type,
            parent: i.parent,
          });
        else
          temproary.push({
            ...j.hasInfo,
            ...j.hasdataNodedata,
            id: j.id,
            status: "To-Do",
            type: j.type,
            parent: i.parent,
          });
      }
    }
  }  
  return temproary;
}
