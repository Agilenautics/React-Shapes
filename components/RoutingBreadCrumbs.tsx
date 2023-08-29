import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import projectStore from './AdminPage/Projects/projectStore';
import Link from 'next/link';

const RoutingBreadCrumbs = () => {
  const [breadCrumbs, setBreadCrumbs] = useState<string[]>([]);
  const projects = projectStore((state) => state.projects)
  const router = useRouter();

  const getBreadCrumbs = (data: string, projectId: string) => {
    let pathArray = data.split('/').filter((path) => path !== '');
    let name = projects.filter((project) => project.id === projectId)[0] || ""
    if (name["name"]) {
      pathArray[1] = name["name"]
    }
    setBreadCrumbs(pathArray)
  };

  useEffect(() => {
    // @ts-ignore
    getBreadCrumbs(router.asPath, router.query.projectId);
  }, [router.asPath, projects]);








  return (
    <>
      {
        <div className='px-6 py-3 flex  bg-gray-50 text-slate-500 sticky top-12 z-10 '>
          {breadCrumbs.map((value, index) => {
            return (
              <div key={index}>
                {value}
                {value && breadCrumbs.length - index > 1 && " / "}
              </div>
            )
          }
          )}
        </div>}
    </>
  );
};

export default RoutingBreadCrumbs;
