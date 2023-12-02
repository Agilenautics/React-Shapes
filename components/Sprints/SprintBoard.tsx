import React, { useEffect, useState } from 'react';
import { getTypeLabel } from '../AdminPage/Projects/staticData/basicFunctions';

export default function SprintBoard(data: any) {
    const [statusArray, setStatusArray] = useState<any>([]);
    const [statusObject, setStatusObject] = useState<any>({});

    useEffect(()=>{
        const newStatusObject: any = { "To-Do": [], "In-Progress": [], "Completed": [] };
        const newStatusArray: any = ["To-Do", "In-Progress", "Completed"];

        data.data.folderHas.forEach((e: any) => {
            if (newStatusArray.includes(e.hasInfo.status)) {
                newStatusObject[e.hasInfo.status].push(e);
            } else {
                newStatusObject[e.hasInfo.status] = [e];
                newStatusArray.push(e.hasInfo.status);
            }
        });

        data.data.fileHas.forEach((e: any) => {
            if (newStatusArray.includes(e.hasInfo.status)) {
                newStatusObject[e.hasInfo.status].push(e);
            } else {
                newStatusObject[e.hasInfo.status] = [e];
                newStatusArray.push(e.hasInfo.status);
            }
        });

        data.data.flownodeHas.forEach((e: any) => {
            if (newStatusArray.includes(e.hasInfo.status)) {
                newStatusObject[e.hasInfo.status].push(e);
            } else {
                newStatusObject[e.hasInfo.status] = [e];
                newStatusArray.push(e.hasInfo.status);
            }
        });

        setStatusObject(newStatusObject);
        setStatusArray(newStatusArray);
    },[data])
    

    return (
         <div className='flex'>
            {statusArray.map((e: string) => (
                <div key={e} className="p-4 w-80">
                    <div className="mb-2 justify-between">
                        <h1 className="text-lg font-semibold mb-2">{e}</h1>
                        {statusObject[e] && statusObject[e].length ? (
                            <div className='w-full h-80 space-y-2 overflow-y overflow-x-hidden'>
                                {statusObject[e].map((item: any) => (
                                <div
                      key={item.id}
                      className="bg-slate-100 border-box hover:shadow-lg p-2 rounded cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                      draggable="true"
                    >
                      <div className="font-bold"> {item.name || item.data.label}</div>
                      {/* @ts-ignore */}
                      <div>{getTypeLabel(item.type).type}</div>

                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No items in this category</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
