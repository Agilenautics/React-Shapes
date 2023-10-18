import React, { useEffect, useState } from 'react';

export default function SprintBoard(data: any) {
    const [statusArray, setStatusArray] = useState<any>(["To-Do", "In-Progress", "Completed"]);
    const [statusObject, setStatusObject] = useState<any>({"To-Do":[], "In-Progress":[], "Completed":[]});

    useEffect(()=>{
         data.data.folderHas.map((e: any)=>{
            if(statusArray.includes(e.hasInfo.status)){
                const newObj = {...statusObject}
                newObj[e.hasInfo.status].push(e)
                setStatusObject(newObj)
            }else{
                const newObj = {...statusObject}
                const newArr = [...statusArray]
                newObj[e.hasInfo.status] = [e]
                setStatusObject(newObj)
                newArr.push(e.hasInfo.status)
                setStatusArray(newArr)
            }
         });
         data.data.fileHas.map((e: any)=>{
            if(statusArray.includes(e.hasInfo.status)){
                const newObj = {...statusObject}
                newObj[e.hasInfo.status].push(e)
                setStatusObject(newObj)
            }else{
                const newObj = {...statusObject}
                const newArr = [...statusArray]
                newObj[e.hasInfo.status] = [e]
                setStatusObject(newObj)
                newArr.push(e.hasInfo.status)
                setStatusArray(newArr)
            }
         });
         data.data.flownodeHas.map((e: any)=>{
            if(statusArray.includes(e.hasInfo.status)){
                const newObj = {...statusObject}
                newObj[e.hasInfo.status].push(e)
                setStatusObject(newObj)
            }else{
                const newObj = {...statusObject}
                const newArr = [...statusArray]
                newObj[e.hasInfo.status] = [e]
                setStatusObject(newObj)
                newArr.push(e.hasInfo.status)
                setStatusArray(newArr)
            }
         })
    },[])

    console.log(statusObject,"outside");
    

    return (
         <div className='flex'>
            {statusArray.map((e: string) => (
                <div key={e} className="w-1/3 p-4">
                    <div className="bg-gray-200 p-3 rounded-lg">
                        <h1 className="text-lg font-semibold mb-2">{e}</h1>
                        {statusObject[e] && statusObject[e].length ? (
                            <ul>
                                {statusObject[e].map((item: any) => (
                                    <li key={item.id} className="text-sm">
                                        {item.name || item.hasdataNodedata.label}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No items in this category</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
