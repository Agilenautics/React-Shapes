import { useState } from "react";
import TopBar from "../components/AdminPage/TopBar";
import Sidebar from "../components/AdminPage/SideBar";
import MembersPage from "../components/AdminPage/Users/MembersPage";

function ProjectPage() {
  const [activeLink, setActiveLink] = useState("Users");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div>
      <TopBar />
      <div className="flex">
        <Sidebar activeLink={activeLink} onLinkClick={handleLinkClick} />
        <div className="flex flex-grow flex-col bg-gray-50">
          <MembersPage />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
