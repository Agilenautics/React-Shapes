 let initData  : any[] = []

export default  initData =  [
  {
    type: "folder",
    name: "epic 1",
    hasFiles: [
      {
        type: "file",
        name: "story 1",
        description:
          "This is one of the stories. This is one of the stories. This is one of the stories. This is one of the",
        status: "Completed",
        sprint: "Sprint 1",
        user: "User 1",
        node: [],
      },
      {
        type: "file",
        name: "story 2",
        description: "story 2 description",
        status: "To-Do",
        user: "User 2",
        sprint: "Sprint 2",
        node: [
          {
            type: "BrightBlueNode",
            label: "node title 1",
            description: "node 1 description",
            user: "User 2",
            sprint: "Sprint 2",
            status: "To-Do",
          },
          {
            type: "GreenNode",
            label: "node title 2",
            description: "node 2 description",
            user: "User 2",
            sprint: "Sprint 2",
            status: "In-Progress",
          },
          {
            type: "RedNode",
            label: "node title 3",
            description: "node 3 description",
            user: "User 3",
            sprint: "Sprint 2",
            status: "Completed",
          },
        ],
      },
      {
        type: "file",
        name: "story 3",
        description: "story 3 description",
        user: "User 1",
        status: "To-Do",
        sprint: "Sprint 2",
        node: [],
      },
      {
        type: "file",
        name: "story 4",
        description: "story 4 description",
        user: "User 4",
        status: "In-Progress",
        sprint: "Sprint 1",
        node: [
          {
            type: "OrangeNode",
            label: "node title 4",
            description: "node 4 description",
            user: "User 4",
            sprint: "Sprint 1",
            status: "To-Do",
          },
          {
            type: "BrightBlueNode",
            label: "node title 5",
            description: "node 5 description",
            user: "User 5",
            sprint: "Sprint 1",
            status: "In-Progress",
          },
        ],
      },
    ],
  },
  {
    type: "folder",
    name: "epic 2",
    hasFiles: [
      {
        type: "file",
        name: "story 5",
        description: "story 5 description",
        user: "User 2",
        status: "To-Do",
        sprint: "Sprint 1",
        node: [],
      },
      {
        type: "file",
        name: "story 6",
        description: "story 6 description",
        user: "User 5",
        status: "Completed",
        node: [
          {
            type: "BrightBlueNode",
            label: "node title 6",
            description: "node 6 description",
            user: "User 3",
            sprint: "Sprint 1",
            status: "In-Progress",
          },
        ],
      },
      {
        type: "file",
        name: "story 7",
        description: "story 7 description",
        user: "User 4",
        status: "Completed",
        sprint: "Sprint 1",
        node: [],
      },
    ],
  },
  {
    type: "file",
    name: "story 8",
    description: "story 8 description",
    user: "User 1",
    sprint: "Sprint 1",
    status: "In-Progress",
    node: [
      {
        type: "RedNode",
        label: "node title 7",
        description: "node 7 description",
        user: "User 1",
        status: "To-Do",
      },
    ],
  },
];
