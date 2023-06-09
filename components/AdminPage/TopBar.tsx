import Signout from "../Authentication/Signout/Signout";
import { auth } from "../../auth";
import { AiOutlineMail } from 'react-icons/ai';
import Link from 'next/link';

const userEmail = auth.currentUser?.email || "";
console.log(userEmail,"userEmail");
function TopBar() {
  return (
    <div className="h-14 border-b border-gray-300 flex items-center text-xl">
      <a className="font-bold text-gray-400 ml-6">FLOWCHART</a>
      <div className="flex items-center justify-center flex-grow space-x-8 text-lg">
        <a className="hover:text-sky-700">Projects</a>
        {/* <a className="hover:text-sky-700">Organizations</a> */}
        {/* <a className="text-sky-700">{userEmail}</a> */}
        <Link href="/Policies">Policies</Link>



      </div>
      <div>
      <a className="text-sky-700">{userEmail}</a>
    </div>
      <div className="mr-8">
        <Signout />
      </div>
    </div>
  );
}

export default TopBar;
