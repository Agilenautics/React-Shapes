import React, { useState } from "react";
import { getInitials, getNameFromEmail } from "../AdminPage/Users/Users";
import { VscReactions } from "react-icons/vsc";
import { CiEdit } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { Comment } from "../../lib/appInterfaces";

const getTime = (time: string) => {
  return new Date(time).getTime();
};

const Discussion = ({ comments }: any) => {
  const [editId, setEditId] = useState<string>("");
  const [moreOptions, setMoreOptions] = useState<any>({
    id: "",
    flag: false,
  });
  const [commentvalue, setCommentValue] = useState<string>("");
  const handleEdit = (id: string, values: string) => {
    setEditId(id);
    setCommentValue(values);
    setMoreOptions("");
  };
  const handleCancelEdit = () => {
    setEditId("");
  };

  return (
    comments &&
    comments.length && (
      <>
        {comments.map((values: Comment, index: string) => {
          const { id, message, user, timeStamp } = values;
          return (
            message && (
              <div className="flex gap-4">
                <div
                  key={index}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white"
                >
                  {getInitials(user.emailId)}
                </div>
                {editId === id ? (
                  <div className="w-full rounded border border-sky-500 p-2">
                    <div>
                      <textarea
                        className="w-full outline-none"
                        value={commentvalue}
                        onChange={(e) => setCommentValue(e.target.value)}
                        rows={1}
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={handleCancelEdit}
                        className="rounded bg-slate-200 px-3 py-1 text-sm text-slate-700 duration-300 hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                      <button className="rounded bg-sky-500 px-3 py-1 text-sm text-white duration-300 hover:bg-sky-400">
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex w-full flex-col gap-4 rounded border p-2">
                    <div className="grid grid-cols-2">
                      <div className="text-xs">
                        <span className="font-semibold">
                          {" "}
                          {getNameFromEmail(user.emailId)}{" "}
                        </span>
                        <span>Commented : {timeStamp} </span>
                      </div>
                      <div className="flex items-center justify-end gap-4">
                        <button type="button">
                          <VscReactions />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(id, message)}
                        >
                          <CiEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMoreOptions(id)}
                        >
                          <BsThreeDots />
                        </button>
                      </div>
                    </div>
                    <div>{message}</div>
                    {moreOptions === id && (
                      <div className="absolute right-10 top-7 w-[20%] rounded bg-white py-2 shadow-md ">
                        <button className="flex w-full items-center gap-3 px-4 duration-200 hover:bg-slate-100">
                          {" "}
                          <AiOutlineDelete /> <span>Delete</span>{" "}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          );
        })}
      </>
    )
  );
};

export default Discussion;
