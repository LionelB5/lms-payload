'use client'

import { Course, Participation } from '@/payload-types'
import { useState } from 'react'
import CurriculumView from './CurriculumView'
import CourseModule from './CourseModule'

const CourseView: React.FC<{ participation: Participation }> = ({ participation }) => {
  const [currentProgress, setCurrentProgress] = useState(participation?.progress || 0)

  const course = participation.course as Course
  const curriculum = course.curriculum ?? []

  async function handleCompleted(nextIndex: number) {
    setCurrentProgress(nextIndex)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <CourseModule
        participation={participation}
        module={curriculum[currentProgress]}
        onCompleted={handleCompleted}
      />
      <CurriculumView course={course} currentProgress={currentProgress} />
    </div>
  )
}

export default CourseView
