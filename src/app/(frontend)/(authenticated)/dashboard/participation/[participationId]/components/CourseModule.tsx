'use client'

import { Course, Participation } from '@/payload-types'
import VideoModule from './VideoModule'

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
      return 'quiz module'
    default:
      return <div>Unknown module type</div>
  }
}
