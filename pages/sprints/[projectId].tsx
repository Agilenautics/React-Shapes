import { useRouter } from "next/router";
import ProjectSprints from "../../components/Sprints/ProjectSprints";

const Sprints = () => {
  const router = useRouter();
  return (
      <div>
       <ProjectSprints />
      </div>
  );
};

export default Sprints;
