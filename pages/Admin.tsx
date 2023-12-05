import React,{ useState } from "react";
import Projects from "../components/AdminPage/Projects/Projects";
import MembersPage from "../components/AdminPage/Users/MembersPage";
import Layout from "../components/AdminPage/Layout";
import { useRouter } from "next/router";



function  App() {
  const [activeLink, setActiveLink] = useState("Projects");
  const router = useRouter();
  const projectId = router.query.projectId as string;
 


  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    // if (link === "Projects") {
    //   router.push("/projects");
    // } else if (link === "Users") {
    //   router.push("/users");
    // }
    router.push("/" + link.toLowerCase());
  };

  const renderPage = () => {
    if (activeLink === "Projects") {
      return <Projects />;
    } else if (activeLink === "Users") {
      return <MembersPage />;
    }
    return null;
  };

  return (
    <Layout activeLink={activeLink} onLinkClick={handleLinkClick}>
      {renderPage()}
    </Layout>
  );
}

export default App;
