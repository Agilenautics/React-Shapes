function TopBar() {
  return (
    <div className="h-14 border-b border-gray-300 flex items-center text-xl">
      <a className="font-bold text-gray-400 ml-6">FLOWCHART</a>
      <div className="flex items-center justify-center flex-grow space-x-8 text-lg">
        <a className="hover:text-sky-700">Projects</a>
        <a className="hover:text-sky-700">Organizations</a>
        <a className="hover:text-sky-700">Policies</a>
      </div>
    </div>
  );
}

export default TopBar;
