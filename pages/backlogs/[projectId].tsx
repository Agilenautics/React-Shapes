import { useRouter } from "next/router";
import ProjectBacklogs from "../../components/Backlogs/ProjectBacklogs";


const Backlogs = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
    <div>
      <ProjectBacklogs />
    </div>
  );
};

export default Backlogs;
