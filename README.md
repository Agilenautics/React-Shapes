# Project Overview

Welcome to our project, a comprehensive web application designed to revolutionize project management. With a focus on enhancing user experience and providing a platform for clean, beautiful UI/UX, we offer a unique alternative to industry leaders like Jira. This open-source endeavor is geared towards enterprise-level project management. While the exact licensing model is yet to be determined, we aim to offer a robust and efficient project management solution.

## Table of Contents( We have divided our project into following components)

- [Authentication](#C:\Users\Sourish\React JS\React flow19-10\ReactFlow-Agile\components\AdminPage)
- [Admin Page]
- [Flow](#flow)
- [Backlog](#backlog)
- [Sprints](#sprints)
- [Sidebar](#sidebar)
- [Treeview](#treeview)
- [GraphQL](#graphql)

## Authentication

**Description**: The Authentication component is the gateway to our project. It manages user authentication, ensuring secure access to the system.

- **Features**:
  - User Registration
  - User Login
  - Password Reset
  - User Profiles

## Admin Page

**Description**: The Admin Page provides administrative functionality, giving control over project settings and user management.

- **Features**:
  - User Management
  - Project Settings
  - Access Control
  - User Role Management

## Flow

**Description**: The Flow component is the heart of our project, offering a unique flowchart canvas for visualizing non-linear workflows.

- **Features**:
  - Visual Flowchart Canvas
  - Non-linear Workflow Visualization
  - Story and Epic Management
  - AI Integration (In Future)

## Backlog

**Description**: The Backlog component focuses on managing project tasks, stories, and epics efficiently.

- **Features**:
  - Work Item Creation
  - Work Item Updates
  - Filtering (Types, Status, Users)
  - Task ID Generation

## Sprints

**Description**: Sprints is where project planning and task assignments occur. Create, manage, and track project sprints and their progress.

- **Features**:
  - Sprint Creation
  - Task Assignment
  - Sprint Progress Tracking
  - Sprint Editing (In Progress)

## Sidebar

**Description**: The Sidebar component offers quick access to various project tools and options, enhancing user experience.

- **Features**:
  - Navigation Menu
  - Quick Access to Project Sections

## Treeview

**Description**: Treeview is the file-system-like manager for organizing project elements, ensuring seamless project organization.

- **Features**:
  - Organizing Project Elements
  - Tree-like Structure
  - User-Friendly Interface

## GraphQL

**Description**: GraphQL powers our data querying and manipulation, offering a robust foundation for the project's back end.

- **Features**:
  - Flexible Data Queries
  - Efficient Data Retrieval
  - Integration with Neo4j Database
  - Apollo Client for Seamless Data Fetching

## Getting Started

Explore our project by following these steps:

1. Clone the repository.
2. Install project dependencies using `yarn`.

   ```bash
   cd project-folder
   yarn install

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

# Project To-Do List on(26-10)

1. **UI/UX Design**: Enhance user interface and user experience.

2. **Access Level Implementation**: Implement user access control.

3. **Utilizing Apollo Client's Cache**: Optimize data management with Apollo Client's cache.

4. **Code Cleanup**: Address and clear warnings in the codebase.

5. **User Tagging via Email**: Implement user tagging by sending email notifications.

6. **Comprehensive Testing**: Thoroughly test all project components.
