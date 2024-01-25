import React, { useEffect, useState } from "react";
import AddBacklogs from "../../../../components/Backlogs/AddBacklogs";
import backlogStore from "../../../../components/Backlogs/backlogStore";
import { types } from "../../../../components/AdminPage/Projects/staticData/types";
import fileStore from "../../../../components/TreeView/fileStore";
import LoadingIcon from "../../../../components/LoadingIcon";

export default function Add() {
  const backend = fileStore((state) => state.data);
  const allStatus = backlogStore((state) => state.allStatus);
  const loading = fileStore((state) => state.loading);
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    if (backend.usersInProjects && backend.usersInProjects.length) {
      setUsers([{ emailId: "Select User", value: "" }, ...backend.usersInProjects]);
    }
  }, [backend.usersInProjects]);


  return loading ? (
    <div className="flex h-screen items-center justify-center">
      <LoadingIcon />
    </div>
  ) : (
    <div className="w-[100%] rounded-lg bg-white shadow-lg">
      <AddBacklogs
        types={types}
        users={users}
        statuses={allStatus}
        selectedElement={null}
        typeDropdown={true}
      />
    </div>
  );
}
