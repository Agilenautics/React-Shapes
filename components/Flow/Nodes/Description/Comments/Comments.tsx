// Comments.tsx
import React, { useState } from "react";
import CommentItem from "./CommentItem";
import { dummyComments } from "./DummyComments";
import AddComment from "./AddComment";
import moment from "moment";

interface Comment {
  id: number;
  username: string;
  dateAdded: string;
  email: string;
  commentText: string;
}

interface User {
  userName: string;
  email: string;
}

interface CommentsProps {
  initialComments: Comment[];
  userDetails: User;
}

const Comments: React.FunctionComponent<CommentsProps> = ({
  initialComments,
  userDetails,
}) => {
  const [comments, setComments] = useState(initialComments);

  // Function to add a new comment
  const addComment = (commentText: string) => {
    const newComment: Comment = {
      id: comments.length + 1,
      username: userDetails.userName,
      email: userDetails.email,
      dateAdded: moment().format("MMM DD, YYYY"),
      commentText,
    };

    setComments([...comments, newComment]);
  };

  return (
    <div>
      <h3 className="mb-2 border-b border-t border-[#C0D5E7] p-3 pb-2 pt-3 text-sm font-semibold text-[#292D32]">
        Comments
      </h3>
      <ul className="list-none p-3">
        {comments.map((comment) => (
          <CommentItem {...comment} key={comment.id} />
        ))}
      </ul>
      <div className="h-32">
        <AddComment onSubmit={addComment} />
      </div>
    </div>
  );
};

export default Comments;
