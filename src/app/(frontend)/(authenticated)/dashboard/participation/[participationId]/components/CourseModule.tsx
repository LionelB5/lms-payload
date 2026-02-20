'use client'

import { Course, Participation } from '@/payload-types'
import VideoModule from './VideoModule'
import QuizModule from './QuizModule'
import FinishModule from './FinishModule'

type ModuleProps = {
  module: NonNullable<Course['curriculum']>[number]
  participation: Participation
  onCompleted: (nextIndex: number) => void
}

export default function CourseModule({ module, participation, onCompleted }: ModuleProps) {
  const participationId = participation.id
  const courseTitle = (participation.course as Course).title
  switch (module.blockType) {
    case 'video':
      return (
        <VideoModule module={module} participationId={participationId} onCompleted={onCompleted} />
      )
    case 'quiz':
      return (
        <QuizModule module={module} participationId={participationId} onCompleted={onCompleted} />
      )
    case 'finish':
      return <FinishModule participationId={participationId} courseTitle={courseTitle} />
    default:
      return <div>Unknown module type</div>
  }
}
