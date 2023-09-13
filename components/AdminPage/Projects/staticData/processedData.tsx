

export const parents: any[] = [{name:"Select Epic",id:""}];
export const initData2: any[] = [];
export const allStatus: any[] = ["To-Do", "In-Progress", "Completed"];

export function processedData(tasks: any) {
  let temproary = [];
  // console.log(tasks);
  
 while(initData2.length){
  initData2.pop()
 }
 while(parents.length!=1){
  parents.pop()
 }

  if (!tasks) {
    return [];
  }
  
  for (let i of tasks) {
    if (i.type == "folder") {

 parents.push({name:i.name,id:i.id})
      
      
      //@ts-ignore
      for (let j of i.hasFile) {        

        initData2.push({ ...j, parent: i.name });
        if(!allStatus.includes(j.hasInfo.status)){
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
      
      if(!allStatus.includes(i.hasInfo.status)){
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
        
        if(!allStatus.includes(j.hasInfo.status)){
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
  // console.log("p",temproary);  
  // console.log(allStatus);
  
  
  return temproary;
}