import React, { useState, useRef, useEffect } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import userStore from "../../../../AdminPage/Users/userStore";
import {
  getInitials,
  getNameFromEmail,
} from "../../../../AdminPage/Users/Users";
import { useRouter } from "next/router";
import { getTreeNodeByUser, GET_PROJECT_BY_ID } from "../../../../../gql";
import fileStore from "../../../../TreeView/fileStore";
import MentionList from "./MentionsList";
import { Resend } from "resend";
import { EmailTemplate } from "./EmailTemplate";

interface User {
  email: string;
  userType: string;
}

interface AddCommentProps {
  onSubmit: (commentText: string) => void;
}

const AddComment: React.FunctionComponent<AddCommentProps> = ({ onSubmit }) => {
  const resend = new Resend("re_MNvsgsxv_JzHXwBZyDBqK9zoS9GBuKxVx");
  const { userEmail } = userStore();

  const [details, setDetails] = useState<User[]>([]);
  const [commentText, setCommentText] = useState("");
  const [mentionData, setMentionData] = useState<
    { id: string; display: string }[]
  >([]);
  const [showMentions, setShowMentions] = useState(false);

  const router = useRouter();
  const projectId = router.query.projectId as string;
  const setLoading = fileStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState(true);
  const [mentionedEmail, setMentionedEmail] = useState("");

  const handleSubmit = async () => {
    const comment = commentText.trim();

    if (comment) {
      onSubmit(comment);
      setCommentText("");

      if (mentionedEmail) {
        try {
          const res = await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              comment,
              mentionedEmail,
              projectId,
            }),
          });

          if (res.ok) {
            console.log(`Email request sent successfully`);
          } else {
            console.error(`Error sending email request: ${res.statusText}`);
          }
        } catch (error) {
          console.error(`Error sending email request: ${error.message}`);
        }
      }
    }
  };

  async function fetchData() {
    if (projectId) {
      const initData = await getTreeNodeByUser(
        GET_PROJECT_BY_ID,
        projectId.toString(),
        setLoading
      );
      const usersInProjects = initData[0].usersInProjects;
      const userDetails = usersInProjects.map((user: any) => ({
        email: user.emailId,
        userType: user.userType,
      }));
      setDetails(userDetails);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [router.query.projectId]);

  useEffect(() => {
    const mentionList = details.map((user, index) => ({
      id: (index + 1).toString(),
      display: user.email,
    }));
    setMentionData(mentionList);
  }, [details]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);

    if (e.target.value.includes("@")) {
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionClick = (mention: string) => {
    setCommentText(getNameFromEmail(mention));
    setShowMentions(false);
    setMentionedEmail(mention);
  };

  return (
    <div className="relative">
      {showMentions && (
        <MentionList mentionData={mentionData} onClick={handleMentionClick} />
      )}
      <div className="flex items-center border-t border-[#C0D5E7] px-3">
        <div className="mb-2 flex items-center justify-start">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
            {getInitials(userEmail)}
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          <div className="flex items-center">
            <textarea
              ref={textareaRef}
              placeholder="Add a comment..."
              className="w-full resize-none border-none p-2 text-sm outline-none"
              value={commentText}
              onChange={handleInputChange}
              onInput={handleTextareaResize}
            />
            <button className="ml-3 text-[#3B9D55]" onClick={handleSubmit}>
              <FaArrowCircleUp className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComment;
