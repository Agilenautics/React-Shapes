export interface Statuses{
    label: string;
    value: string
}


export const statuses: Statuses[] = [
    { label: "All", value: "" },
    { label: "Todo", value: "To-Do" },
    { label: "In-Progress", value: "In-Progress" },
    { label: "Completed", value: "Completed" },
  ];