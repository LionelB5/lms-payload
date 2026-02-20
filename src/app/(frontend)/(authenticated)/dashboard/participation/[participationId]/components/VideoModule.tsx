'use client'

import { Course } from '@/payload-types'
import { useState } from 'react'
import { markProgress } from '../actions/markProgress'
import NextButton from './NextButton'

export default function VideoModule({
  module,
  participationId,
  onCompleted,
}: {
  module: Extract<NonNullable<Course['curriculum']>[number], { blockType: 'video' }>
  participationId: string
  onCompleted: (nextIndex: number) => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleNextModule() {
    setLoading(true)
    try {
      const updatedParticipation = await markProgress(participationId)
      if (updatedParticipation && updatedParticipation.progress) {
        onCompleted(updatedParticipation.progress)
      } else {
        console.error('Failed to update participation progress')
      }
    } catch (error) {
      console.error('Error marking progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{module.title}</h2>

      <div className="relative w-full aspect-video border border-white overflow-hidden">
        <iframe
          src={module.playerUrl}
          style={{ border: 'none', position: 'absolute', top: 0, height: '100%', width: '100%' }}
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
          allowFullScreen
          data-card-controls="1" // helps override Embedly defaults
        />
      </div>

      <NextButton loading={loading} text="Next" onClick={handleNextModule} />
    </div>
  )
}
