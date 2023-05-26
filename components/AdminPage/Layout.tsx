import TopBar from "./TopBar";
import Sidebar from "./SideBar";

interface LayoutProps {
  children: React.ReactNode;
  activeLink: string;
  onLinkClick: (link: string) => void;
}

function Layout({ children, activeLink, onLinkClick }: LayoutProps) {
  return (
    <div>
      <TopBar />
      <div className="flex">
        <Sidebar activeLink={activeLink} onLinkClick={onLinkClick} />
        <div className="flex flex-grow flex-col bg-gray-50">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
