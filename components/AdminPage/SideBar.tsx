import { useState } from "react";
import { GrProjects } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarProps {
  activeLink: string;
  onLinkClick: (link: string) => void;
}

function Sidebar({ activeLink, onLinkClick }: SidebarProps) {
  const router = useRouter();

  const handleLinkClick = (link: string) => {
    onLinkClick(link);
    if (link === "Projects") {
      router.push("/projects");
    } else if (link === "Users") {
      router.push("/users");
    }
  };

  return (
    <div className="flex h-screen w-56 flex-col border-r border-gray-400 font-semibold">
      <div className="mt-4 flex flex-col items-start justify-center space-y-2">
        <div
          className={`ml-0 h-10 w-full ${
            activeLink === "Projects"
              ? "border-r-2 border-blue-400 bg-blue-300"
              : ""
          }`}
        >
          <Link href="/projects">
            <a
              className={`flex items-center p-4 py-2 ${
                activeLink === "Projects" ? "text-white" : ""
              }`}
              onClick={() => handleLinkClick("Projects")}
            >
              <GrProjects className="mr-2" />
              Projects
            </a>
          </Link>
        </div>
        <div
          className={`h-10 w-full ${
            activeLink === "Users"
              ? "border-r-2 border-blue-400 bg-blue-300"
              : ""
          }`}
        >
          <Link href="/users">
            <a
              className={`flex items-center p-4 py-2 ${
                activeLink === "Users" ? "text-white" : ""
              }`}
              onClick={() => handleLinkClick("Users")}
            >
              <FiUsers className="mr-2" />
              Users
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
