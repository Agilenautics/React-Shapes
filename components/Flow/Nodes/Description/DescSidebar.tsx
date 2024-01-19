import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Comments from "./Comments/Comments";
import userStore from "../../../AdminPage/Users/userStore";
import { getNameFromEmail } from "../../../AdminPage/Users/Users";

interface Comment {
  id: number;
  username: string;
  dateAdded: string;
  commentText: string;
  email: string;
}

interface SidebarProps {
  nodeName: string;
  descriptionText: string;
  onCloseSidebar: () => void;
  comments: Comment[];
}

const DescSidebar: React.FunctionComponent<SidebarProps> = ({
  nodeName,
  descriptionText,
  onCloseSidebar,
  comments,
}) => {
  const { userEmail } = userStore();
  const userName = getNameFromEmail(userEmail);

  const userDetails = {
    userName: userName,
    email: userEmail,
  };

  return (
    <div className="fixed right-0 top-[3.05rem] z-10 h-screen w-1/4 bg-white shadow duration-300 ease-in-out">
      <div className="flex h-full flex-col border-b border-[#C0D5E7]">
        <div className="flex items-center justify-between border-b p-3">
          <div>
            <h2 className="text-md font-semibold text-[#292D32]">{nodeName}</h2>
          </div>
          <div className="ml-10 flex gap-2">
            <a
              href="#"
              className="text-xs text-green-500 underline underline-offset-2"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              More Info
            </a>
            <button onClick={onCloseSidebar} className="h-4 w-4">
              <IoIosClose />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <h3 className="mb-2 border-b border-[#C0D5E7] p-3 pb-2 text-sm font-semibold text-[#292D32]">
            Description
          </h3>
          <p className="mx-3 mb-2 mt-1 text-xs">{descriptionText}</p>
          <Comments initialComments={comments} userDetails={userDetails} />
        </div>
      </div>{" "}
    </div>
  );
};

export default DescSidebar;
