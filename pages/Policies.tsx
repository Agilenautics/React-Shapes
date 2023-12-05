// pages/Policies.js

import React from "react";
import Link from "next/link";

const Policies = () => {
  return (
    <div className="container mx-auto py-10 pl-8">
      <h1 className="mb-4 text-3xl font-bold">Access Level Policies</h1>
      <div className="mb-8">
        <h2 className="mb-2 text-xl font-bold">Admin</h2>
        <ul className="ml-6 list-inside list-disc">
          <li>Can create, edit, and delete projects.</li>
          <li>Can add, modify, and delete users.</li>
          <li>Can add, edit, and delete folders, files, and nodes.</li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 text-xl font-bold">SuperUsers</h2>
        <ul className="ml-6 list-inside list-disc">
          <li>Can edit and delete projects assigned to them.</li>
          <li>Can add, edit, and delete folders, files, and nodes.</li>
          <li>
            Cannot perform administrative actions such as managing users or
            creating new projects.
          </li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 text-xl font-bold">Users</h2>
        <ul className="ml-6 list-inside list-disc">
          <li>Can create, delete, and edit nodes.</li>
          <li>
            Do not have access to project-level operations or the ability to
            modify project structure.
          </li>
        </ul>
      </div>
      <h1 className="mb-4 text-3xl font-bold">Policy Enforcement</h1>
      <ul className="mb-8 list-inside list-disc">
        <li>
          Implement role-based access control (RBAC) mechanisms within the
          application.
        </li>
        <li>Assign user roles and permissions based on their access levels.</li>
        <li>
          Use authentication and authorization mechanisms to enforce access
          policies.
        </li>
        <li>
          Restrict access to specific endpoints, actions, or UI components based
          on the users assigned role.
        </li>
        <li>
          Ensure proper validation and authorization checks are performed before
          allowing actions related to projects, users, folders, files, and
          nodes.
        </li>
      </ul>
      <Link href="/projects">Back to Home</Link>
    </div>
  );
};

export default Policies;
