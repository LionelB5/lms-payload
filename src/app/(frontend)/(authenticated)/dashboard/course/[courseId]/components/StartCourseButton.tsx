'use client'

import { participate } from '@/app/(frontend)/(authenticated)/actions/participate'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { HiExclamation, HiExclamationCircle, HiPlay } from 'react-icons/hi'

const StartCourseButton: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleStartCourse(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setStatus('loading')
    setError(null)
    try {
      const participation = await participate({ courseId })
      router.push(`/dashboard/participation/${participation.id}`)
    } catch (error) {
      console.error(error)
      setStatus('error')
      setError('Failed to start course. Please try again.')
    }
  }

  return (
    <div className="mt-6">
      <button
        disabled={status === 'loading'}
        onClick={handleStartCourse}
        className={`relative
          inline-flex
          items-center
          gap-2
          px-6
          py-3
          font-semibold
          rounded
          transition
          duration-300
          ease-in-out
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${
            status === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
      >
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {status === 'loading' ? (
            <AiOutlineLoading className="animate-spin text-xl" />
          ) : status === 'error' ? (
            <HiExclamationCircle className="text-xl" />
          ) : (
            <HiPlay className="text-xl" />
          )}
        </div>
        <span className="pl-6">Start Course</span>
      </button>
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
          <HiExclamation className="text-lg" />
          {error}
        </p>
      )}
    </div>
  )
}

export default StartCourseButton
