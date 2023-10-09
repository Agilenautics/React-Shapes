import React, { useEffect, useState } from 'react'
import AddBacklogs from '../../../../components/Backlogs/AddBacklogs'
import backlogStore from '../../../../components/Backlogs/backlogStore'
import { types } from '../../../../components/AdminPage/Projects/staticData/types'
import fileStore from '../../../../components/TreeView/fileStore'

export default function Add() {
  const backend = fileStore(state => state.data);
  const allStatus = backlogStore(state => state.allStatus);
  const loading = fileStore((state) => state.loading);
    const [users, setUsers] = useState<any[]>([])
useEffect(()=>{
if(backend.userHas && backend.userHas.length){
setUsers([{ emailId: "Select User", value: "" }, ...backend.userHas])
}
},[backend.userHas])

console.log(users);

if (loading) {
  return <>
    Loading
  </>
}

  return (
          <div className="rounded-lg bg-white shadow-lg w-[100%] overflow-y-scroll overflow-x-hidden" >
            <AddBacklogs
              types={types}
              users={users}
              statuses={allStatus}
              selectedElement={null}
              typeDropdown={true}
            />
          </div>
  )
}
