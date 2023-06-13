interface ProjectOverviewProps {
  projectName: string;
  projectDesc: string;
  total: number;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  projectName,
  projectDesc,
  total,
}) => {
  return (
    <>
      <div className="mt-8 flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-xl font-semibold text-white">
          {getInitials(projectName)}
        </div>
        <h1 className="ml-4 text-2xl font-bold">{projectName}</h1>
      </div>
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="mt-2">{projectDesc}</p>
      </div>
      <h2 className="mt-10 text-lg font-semibold">Project Members</h2>
      <div className="mt-2 flex items-center">
        <h4 className="">Total</h4>
        <p className="ml-4 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs">
          {total}
        </p>
      </div>
    </>
  );
};

function getInitials(name: string) {
  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0)).join("");
  return initials;
}

export default ProjectOverview;
