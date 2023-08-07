import Link from "next/link";
import { useState } from "react";

interface SummarySidebarProps {
  projectId: string;
}

function SummarySidebar({ projectId }: SummarySidebarProps) {
  const [activeLink, setActiveLink] = useState("overview");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div className="flex h-screen w-56 flex-col border-r border-gray-400 font-semibold">
      <div
        className={`ml-0 h-10 w-full ${
          activeLink === "overview"
            ? "border-r-2 border-blue-400 bg-blue-300 text-white"
            : ""
        }`}
      >
        <Link href={"/projects/" + projectId}>
          <a className={`flex items-center p-4 py-2`}>Overview</a>
        </Link>
      </div>
      <div
        className={`ml-0 h-10 w-full ${
          activeLink === "flowchart"
            ? "border-r-2 border-blue-400 bg-blue-300"
            : ""
        }`}
      >
        <Link href={"/flowchart/" + projectId}>
          <a className={`flex items-center p-4 py-2`}>Flowchart</a>
        </Link>
      </div>
      <div
        className={`ml-0 h-10 w-full ${
          activeLink === "backlogs"
            ? "border-r-2 border-blue-400 bg-blue-300"
            : ""
        }`}
      >
        <Link href={"/backlogs/" + projectId }>
          <a className={`flex items-center p-4 py-2`}>Backlogs</a>
        </Link>
      </div>
    </div>
  );
}

export default SummarySidebar;
