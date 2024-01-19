import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import userStore from "../../../../AdminPage/Users/userStore";
import { getNameFromEmail } from "../../../../AdminPage/Users/Users";

interface Comment {
  id: number;
  username: string;
  dateAdded: string;
  commentText: string;
  email: string;
}

const CommentItem: React.FunctionComponent<Comment> = ({
  id,
  username,
  email,
  dateAdded,
  commentText,
}) => {
  const initials = username
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
  const [showOptions, setShowOptions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommentText, setEditedCommentText] = useState(commentText);
  const { userEmail } = userStore();

  const handleOptionsClick = () => {
    // Only show options if the userEmail matches the email of the comment
    if (userEmail === email) {
      setShowOptions(!showOptions);
      setEditMode(false);
    }
  };

  const handleEditClick = () => {
    setShowOptions(false);
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
  };

  const handleCancelClick = () => {
    setEditedCommentText(commentText);
    setEditMode(false);
  };

  return (
    <li key={id} className="mb-3 text-xs">
      <div className="flex items-start">
        <div className="mr-3 h-8 w-8 flex-shrink-0">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-white">
            {initials}
          </div>
        </div>
        <div className="flex flex-grow flex-col">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#292D32]">
              {username}{" "}
              <span className="font-normal text-[#849BAA]">{dateAdded}</span>
            </div>
            <div className="text-xs text-gray-500">
              {userEmail === email && (
                <button onClick={handleOptionsClick}>
                  <BsThreeDots />
                </button>
              )}
              {showOptions && !editMode && (
                <div
                  className="absolute right-0 mr-2 w-20 rounded-sm border border-[#C0D5E7] bg-white p-2 text-sm shadow"
                  style={{ zIndex: 1000 }}
                >
                  <button
                    onClick={handleEditClick}
                    className="mb-1 block   hover:text-green-400"
                  >
                    Edit
                  </button>
                  <button className="block  hover:text-red-500">Delete</button>
                </div>
              )}
            </div>
          </div>
          {editMode ? (
            <>
              <textarea
                value={editedCommentText}
                onChange={(e) => setEditedCommentText(e.target.value)}
                className="mb-2 resize-none rounded-md border p-2"
              />
              <div className="flex gap-2">
                <div className="rounded-md bg-[#3B9D55] px-5 py-2 text-white">
                  <button onClick={handleSaveClick} className="">
                    Save
                  </button>
                </div>
                <div className=" rounded-md border-[1px] border-[#C0D5E7] px-5 py-2">
                  <button onClick={handleCancelClick} className="">
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>{commentText}</div>
          )}
        </div>
      </div>
    </li>
  );
};

export default CommentItem;
