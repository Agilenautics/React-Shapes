import React from "react";
import { AiFillFolderOpen, AiFillFolder, AiOutlineFile } from "react-icons/ai";
const Icon = ({ isFolder, isSelected, isOpen }: any) => {
  const cname = "rounded text-blue-500 w-5 h-5 pb-[1px]";
  if (isFolder) {
    if (isOpen) {
      return <AiFillFolderOpen className={cname} size={18} />;
    } else {
      return <AiFillFolder className={cname} size={18} />;
    }
  } else {
    return <AiOutlineFile className={cname} size={18} />;
  }
};

export default Icon;
