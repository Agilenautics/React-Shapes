import { useRouter } from "next/router";
import ProjectSprints from "../../components/AdminPage/Projects/ProjectSprints";

const Sprints = () => {
  const router = useRouter();
  return (
      <div>
       <ProjectSprints />
      </div>
  );
};

export default Sprints;
