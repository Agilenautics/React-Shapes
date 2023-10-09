import React, { useEffect, useState } from 'react'

export default function SprintBoard(data: any) {
    const [statusArray, setStatusArray] = useState<any[]>([]);
    const [statusObject, setStatusObject] = useState<any>({});

    useEffect(()=>{
      data.data.folderHas.map((e:any)=>{
        const status = e.hasInfo.status
        if(!statusObject[status]){
            setStatusArray([...statusArray,status])
            setStatusObject({...statusObject, status : [e]})
        }else{
            setStatusObject({...statusObject,status:[...statusObject[status],e]})
        }
      })
      data.data.fileHas.map((e:any)=>{
        const status = e.hasInfo.status
        if(!statusObject[status]){
            setStatusArray([...statusArray,status])
            setStatusObject({...statusObject, status : [e.name]})
        }else{
            setStatusObject({...statusObject,status:[...statusObject[status],e.name]})
        }
      })
      data.data.flownodeHas.map((e:any)=>{
        const status = e.hasInfo.status
        if(!statusObject[status]){
            setStatusArray([...statusArray,status])
            setStatusObject({...statusObject, status : [e.label]})
        }else{
            setStatusObject({...statusObject,status:[...statusObject[status],e.label]})
        }
      })
    },[data])

    console.log(statusArray,"sa");
    console.log(statusObject,"so");
    
    

  return (
    <div>{JSON.stringify(data)}</div>
  )
}
