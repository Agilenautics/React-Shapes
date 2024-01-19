import React, { useEffect, useState } from "react";
import AddBacklogs from "../../../../components/Backlogs/AddBacklogs";
import backlogStore from "../../../../components/Backlogs/backlogStore";
import { types } from "../../../../components/AdminPage/Projects/staticData/types";
import fileStore from "../../../../components/TreeView/fileStore";
import { useRouter } from "next/router";
import LoadingIcon from "../../../../components/LoadingIcon";

export default function Edit() {
  const router = useRouter();
  const { data: backend, loading } = fileStore();

  const data = backlogStore((state) => state.backlogs);
  const allStatus = backlogStore((state) => state.allStatus);
  const { backlogs, updateBacklogsData, parents } = backlogStore();
  const [users, setUsers] = useState<any[]>([]);
  const elementId = router.query.id;
  const [selectedElement, setSelectedElement] = useState<any>([]);

  useEffect(() => {
    const element = backlogs.filter((e) => e.id == elementId);
    if (element && element.length) {
      setSelectedElement(element);
    } else {
      let selectedData = backend.children?.filter(
        (value) => value.id === elementId
      );
      const updatedData = selectedData?.map((value) => {
        if (value.id === elementId) {
          return {
            ...value,
            parent: "",
          };
        }
      });
      setSelectedElement(updatedData);
    }
  }, [elementId, data]);

  useEffect(() => {
    if (backend.userHas && backend.userHas.length) {
      setUsers([{ emailId: "Select User", value: "" }, ...backend.userHas]);
    }
    updateBacklogsData(backend.children as any);
  }, [backend.userHas]);

  if (loading) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <LoadingIcon />
        </div>
      </>
    );
  }

  return (
    <div className="w-[100%] rounded-lg bg-white shadow-lg">
      {selectedElement && selectedElement.length && (
        <AddBacklogs
          types={types}
          users={users}
          statuses={allStatus}
          selectedElement={selectedElement[0]}
          typeDropdown={false}
        />
      )}
    </div>
  );
}
