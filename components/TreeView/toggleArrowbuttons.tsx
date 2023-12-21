import React from "react";
import { ChevronDown, ChevronRight } from "react-feather";
const MaybeToggleButton = ({ toggle, isOpen, isFolder, isSelected }: any) => {
  if (isFolder) {
    const Icon = isOpen ? ChevronDown : ChevronRight;
    return (
      <button tabIndex={-1} onClick={toggle} className="mx-1">
        <Icon size={20} className=" stroke-2 text-gray-700 dark:text-white" />
      </button>
    );
  } else {
    return <div className="spacer" />;
  }
};

export default MaybeToggleButton;
