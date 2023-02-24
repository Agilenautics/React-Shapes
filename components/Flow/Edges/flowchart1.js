const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "d",
    targetHandle: "b",
    data: {
      label: "Analysis",
      pathCSS: "!stroke-node-green-200 bg-node-green-200 fill-node-green-200",
      boxCSS: "border-node-green-100 bg-node-green-50 text-node-green-200",
      bidirectional: true,
    },
    selected: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    data: {
      label: "Insights",
      pathCSS: "!stroke-node-green-200 bg-node-green-200 fill-node-green-200",
      boxCSS: "border-node-green-100 bg-node-green-50 text-node-green-200",
      bidirectional: false,
    },
    sourceHandle: "c",
    targetHandle: "a",
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    data: {
      label: "Uses",
      pathCSS: "!stroke-node-blue-200 bg-node-blue-200 fill-node-blue-200",
      boxCSS: "border-node-blue-100 bg-node-blue-50 text-node-blue-200",
      bidirectional: false,
    },
    sourceHandle: "c",
    targetHandle: "a",
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    sourceHandle: "d",
    targetHandle: "a",
    data: {
      label: "",
      pathCSS: "!stroke-node-blue-200 bg-node-blue-200 fill-node-blue-200",
      boxCSS: "border-node-green-100 bg-node-green-50 text-node-green-200",
      bidirectional: false,
    },
  },
  {
    id: "e3-6",
    source: "3",
    target: "6",
    sourceHandle: "d",
    targetHandle: "a",
    data: {
      label: "",
      pathCSS: "!stroke-node-blue-200 bg-node-blue-200 fill-node-blue-200",
      boxCSS: "border-node-green-100 bg-node-green-50 text-node-green-200",
      bidirectional: false,
    },
  },
];

export default edges;
