This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses TailwindCSS for styling and React Flow as the core canvas library.

## Getting Started

First, clone the repo and then install all the dependencies using `yarn`.

```bash
cd flowchart
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project is divided into three parts, the Sidebar, the TreeView (the file system like manager) and the Flow (the main graph view).

- Flow is divided into two subparts: the Edges and Nodes
- The Sidebar primarily consists of the TreeView component

## Technologies/Libraries Used

Front end:

- [React.js](https://reactjs.org)
- [Next.js](https://nextjs.org)
- [TailwindCSS](https://tailwindcss.com)
- [react-arborist](https://github.com/brimdata/react-arborist)
- [React Flow](https://reactflow.dev)
- [zustand](https://zustand-demo.pmnd.rs)

Back end:

- [GraphQL](https://graphql.org)
- [Neo4j](https://neo4j.com)
- [Apollo](https://www.apollographql.com)

## To-do List

- [ ] Adjust the alignment and overlap of the boxes in edit mode for the nodes
- [ ] Update the look of the edges and their labels to match the mockup [Code reference](https://github.com/wbkd/react-flow/blob/main/src/components/Edges/SmoothStepEdge.tsx)
- [ ] Make the add node button add a node at a better location
- [ ] Get rid of prop drilling where possible
- [ ] Fix the duplication in [treeNode.tsx](components/TreeView/treeNode.tsx)
- [ ] Implement EtherPad
- [ ] Tags using react-select with Material UI chips