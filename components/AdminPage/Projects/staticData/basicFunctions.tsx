interface TypeLabels {
  type: string;
  color: string;
}

export const getTypeLabel = (type: string): TypeLabels => {
  switch (type) {
    case "file":
      return { type: "Story", color: "bg-purple-200" };
    case "folder":
      return { type: "Epic", color: "bg-blue-400" };
    case "BrightblueNode":
      return { type: "Task", color: "bg-blue-200" };
    case "BrightgreenNode":
      return { type: "Sub-Task", color: "bg-green-200" };
    case "blueNode":
      return { type: "Issue", color: "bg-orange-200" };
    case "BrightorangeNode":
      return { type: "Bug", color: "bg-red-200" };
    case "BrightredNode":
      return { type: "Bug", color: "bg-red-200" };
    default:
      return { type: "", color: "" };
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-200";
    case "In-Progress":
      return "bg-blue-200";
    case "To-Do":
      return "bg-red-200";
    default:
      return "";
  }
};
