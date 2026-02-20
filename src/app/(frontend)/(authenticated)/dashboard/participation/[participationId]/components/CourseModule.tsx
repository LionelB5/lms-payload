'use client'

import { Course, Participation } from '@/payload-types'
import VideoModule from './VideoModule'
import QuizModule from './QuizModule'

type ModuleProps = {
  module: NonNullable<Course['curriculum']>[number]
  participation: Participation
  onCompleted: (nextIndex: number) => void
}

export default function CourseModule({ module, participation, onCompleted }: ModuleProps) {
  switch (module.blockType) {
    case 'video':
      return <VideoModule module={module} participation={participation} onCompleted={onCompleted} />
    case 'quiz':
      return <QuizModule module={module} participation={participation} onCompleted={onCompleted} />
    default:
      return <div>Unknown module type</div>
  }
}
