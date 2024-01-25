import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import projectStore from "./AdminPage/Projects/projectStore";

const RoutingBreadCrumbs = ({ loading }: any) => {
  const [breadCrumbs, setBreadCrumbs] = useState<string[]>([]);
  const projects = projectStore((state) => state.projects);

  const router = useRouter();
  const projectId = router.query.projectId as string;

  const getBreadCrumbs = (data: string, projectId: string) => {
    let pathArray = data.split("/").filter((path) => path !== "");
    let name = projects.filter((project) => project.id === projectId)[0] || "";
    if (name["name"]) {
      pathArray[1] = name["name"];
    }
    setBreadCrumbs(pathArray);
  };

  useEffect(() => {
    getBreadCrumbs(router.asPath, projectId);
  }, [router.asPath, projects]);

  if (loading) {
    return "";
  }

  return (
    <>
      {
        <div className="sticky top-12 z-10  flex bg-gray-50 px-6 py-3 text-slate-500 ">
          {breadCrumbs.map((value, index) => {
            return (
              <div key={index}>
                {value}
                {value && breadCrumbs.length - index > 1 && " / "}
              </div>
            );
          })}
        </div>
      }
    </>
  );
};

export default RoutingBreadCrumbs;
