import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getCustomer } from '../../../actions/getCustomer'
import { Course, Media } from '@/payload-types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { HiArrowLeft, HiPencilAlt, HiVideoCamera } from 'react-icons/hi'
import Image from 'next/image'

const CoursePage: React.FC<{ params: Promise<{ courseId: string }> }> = async ({ params }) => {
  const { courseId } = await params
  const payload = await getPayload({ config: configPromise })
  const customer = await getCustomer()
  let course: Course | null = null
  try {
    const res = await payload.findByID({
      collection: 'courses',
      id: courseId,
      overrideAccess: false,
      user: customer,
    })
    course = res
  } catch (error) {
    console.error(error)
    notFound()
  }

  if (!course) {
    return notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition duration-300"
      >
        <HiArrowLeft className="text-lg" />
        Back to Dashboard
      </Link>
      <div className="relative w-full aspect-video overflow-hidden border border-gray-700">
        <Image
          src={(course.image as Media).url ?? ''}
          alt={`${course.title} thumbnail`}
          fill={true}
          className="object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-300">{course.description}</p>
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Curriculum</h2>
        <div className="flex flex-col gap-4">
          {course.curriculum?.map((block, id) => {
            if (block.blockType === 'video') {
              return (
                <div key={id} className="p-4 border border-gray-700 rounded bg-gray-900">
                  <div className="text-teal-400 font-semibold flex items-center gap-2">
                    <HiVideoCamera className="text-xl" />
                    {block.title}
                  </div>
                  <div className="text-sm text-gray-400">{block.duration} min</div>
                </div>
              )
            } else {
              return (
                <div key={id} className="p-4 border border-gray-700 rounded bg-gray-900">
                  <div className="text-yellow-400 font-semibold flex items-center gap-2">
                    <HiPencilAlt className="text-xl" />
                    {block.title}
                  </div>
                  <div className="text-sm text-gray-400">{block.questions?.length || 0}</div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default CoursePage
