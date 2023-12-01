import React, { useEffect, useState } from 'react'
import AddBacklogs from '../../../../components/Backlogs/AddBacklogs'
import backlogStore from '../../../../components/Backlogs/backlogStore'
import { types } from '../../../../components/AdminPage/Projects/staticData/types'
import fileStore from '../../../../components/TreeView/fileStore'
import { useRouter } from 'next/router'
import LoadingIcon from '../../../../components/LoadingIcon'

export default function Edit() {
  const router = useRouter()
  const backend = fileStore(state => state.data);
  const data = backlogStore(state => state.backlogs);
  const allStatus = backlogStore(state => state.allStatus);
  const loading = fileStore((state) => state.loading);
  const [users, setUsers] = useState<any[]>([]);
  const elementId = router.query.id
  const [selectedElement,setSelectedElement] = useState<any>([])
  

  useEffect(()=>{
    const element = data.filter(e => e.id==elementId);
    const gg = backend.children?.filter((values)=>values.id===elementId)
    // console.log(element,"ele",gg);
    setSelectedElement(element)  
  },[data,elementId]) 

   
useEffect(()=>{
if(backend.userHas && backend.userHas.length){
setUsers([{ emailId: "Select User", value: "" }, ...backend.userHas])
}
},[backend.userHas])


if (loading || selectedElement.length==0) {
  return <>
    <div className="flex h-screen items-center justify-center">
      <LoadingIcon />
    </div>
  </>
}

  return (
          <div className="rounded-lg bg-white shadow-lg w-[100%]" >
            <AddBacklogs
              types={types}
              users={users}
              statuses={allStatus}
              selectedElement={selectedElement[0]}
              typeDropdown={false}
            />
          </div>
  )
}
