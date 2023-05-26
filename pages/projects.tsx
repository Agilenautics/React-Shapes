import { useState } from "react";
import TopBar from "../components/AdminPage/TopBar";
import Sidebar from "../components/AdminPage/SideBar";
import Projects from "../components/AdminPage/Projects/Projects";

function ProjectPage() {
  const [activeLink, setActiveLink] = useState("Projects");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div>
      <TopBar />
      <div className="flex">
        <Sidebar activeLink={activeLink} onLinkClick={handleLinkClick} />
        <div className="flex flex-grow flex-col bg-gray-50">
          <Projects />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
