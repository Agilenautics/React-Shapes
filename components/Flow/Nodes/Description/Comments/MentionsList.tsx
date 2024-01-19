// MentionList.tsx
import React from "react";
import {
  getNameFromEmail,
  getInitials,
} from "../../../../AdminPage/Users/Users";

interface MentionListProps {
  mentionData: { id: string; display: string }[];
  onClick: (mention: string) => void;
}

const MentionList: React.FC<MentionListProps> = ({ mentionData, onClick }) => (
  <div
    className="absolute bottom-12 left-10 right-0 w-48 rounded-md border border-[#C0D5E7] bg-white text-xs"
    style={{ boxShadow: "0px 10px 40px 0px #232A2F1A" }}
  >
    <ul>
      {mentionData.map((mention) => (
        <li key={mention.id} onClick={() => onClick(mention.display)}>
          <div className="flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-100">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
              {getInitials(mention.display)}
            </div>
            <div>
              <div className="font-semibold">
                {getNameFromEmail(mention.display)}
              </div>
              <div className="text-gray-500">{mention.display}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default MentionList;
