import React from 'react'
import { useRouter } from 'next/router'
import ProjectBoards from '../../../components/AdminPage/Projects/ProjectBoards'

const boards = () => {
  return (
    <div className="h-screen">
      <ProjectBoards />
    </div>
  )
}

export default boards