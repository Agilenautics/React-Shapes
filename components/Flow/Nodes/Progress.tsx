import React from 'react'
import { MdDoneAll } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
function Progress({ progress }: { progress: number }) {
  function evaluateSwitch() {
    switch (progress) {
      case 0:
        return (
          <div>
            <div className="h-2 w-2 rounded-xl bg-red-500 transition-all duration-200 group-hover:scale-[2.5] group-hover:rounded-sm"></div>
            <div className="absolute -left-1 -top-1 text-center align-middle text-[9px] font-bold opacity-0 transition-all group-hover:opacity-100">
              <IoMdCloseCircleOutline className="h-4 w-4" />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="h-2 w-2 rounded-xl bg-emerald-400 transition-all duration-200 group-hover:scale-[2.5] group-hover:rounded-sm"></div>
            <div className="absolute -left-[4px] -top-[3px] text-center align-middle text-[9px] font-bold opacity-0 transition-all group-hover:opacity-100">
              <MdDoneAll className="h-4 w-4" />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <div className="h-2 w-2 rounded-xl bg-amber-300 transition-all duration-200 group-hover:scale-[2.5] group-hover:rounded-sm"></div>
            <div className="absolute -left-[5px] -top-[1px] text-center align-middle text-[9px] font-bold opacity-0 transition-all group-hover:opacity-100">
              {progress}%
            </div>
          </div>
        );
    }
  }
  return (
    <div className="group absolute right-3 top-3 cursor-default">
      {evaluateSwitch()}
    </div>
  );
}

export default Progress;
