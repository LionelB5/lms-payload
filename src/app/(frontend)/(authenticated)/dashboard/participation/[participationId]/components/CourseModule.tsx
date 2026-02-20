'use client'

import { Course, Participation } from '@/payload-types'

interface ModuleProps {
  module: NonNullable<Course['curriculum']>[number]
  participation: Participation
  onCompleted: (nextIndex: number) => void
}

export default function CourseModule({ module }: ModuleProps) {
  switch (module.blockType) {
    case 'video':
      return 'video module'
    case 'quiz':
      return 'quiz module'
    default:
      return <div>Unknown module type</div>
  }
}
