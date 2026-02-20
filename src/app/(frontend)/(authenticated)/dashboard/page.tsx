'use server'

import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import configPromise from '@payload-config'
import Image from 'next/image'
import { Course, Media, Participation } from '@/payload-types'
import Link from 'next/link'
import { getCustomer } from '../actions/getCustomer'
import ResumeCourseButton from './course/[courseId]/components/ResumeCourseButton'

const Page: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })
  const customer = await getCustomer()

  let courses: Course[] = []
  try {
    const coursesRes = await payload.find({
      collection: 'courses',
      limit: 10,
      overrideAccess: false,
      user: customer,
    })
    courses = coursesRes.docs
  } catch (e) {
    console.log(e)
  }

  let participations: Participation[] = []
  try {
    participations =
      (
        await payload.find({
          collection: 'participation',
          where: { customer: { equals: customer?.id } },
          overrideAccess: false,
          user: customer,
        })
      )?.docs ?? []
  } catch (error) {
    console.log(error)
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-4xl p-4 gap-4">
      <div className="text-xl">
        Welcome <span className="text-gray-400">{customer?.email}</span>
      </div>
      {participations && participations.length > 0 && (
        <div className="text-sm text-teal-400">Your Courses</div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          {participations.map((participation) => (
            <ResumeCourseButton key={participation.id} participation={participation} />
          ))}
        </Suspense>
      </div>
      <div className="text-sm text-teal-400">All Courses</div>
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          {courses.map((course) => {
            return (
              <Link
                href={`/dashboard/course/${course.id}`}
                key={course.id}
                className="flex flex-col cursor-pointer relative border border-gray-700 hover:border-white transition ease-in-out duration-100 overflow-hidden"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    alt={`${course.title} thumbnail`}
                    src={(course.image as Media).url || ''}
                    fill={true}
                  />
                </div>
              </Link>
            )
          })}
        </Suspense>
      </div>
    </div>
  )
}

export default Page
