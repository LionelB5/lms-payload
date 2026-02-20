import { getPayload } from 'payload'
import { getCustomer } from '../../../actions/getCustomer'
import configPromise from '@payload-config'
import { Course, Participation } from '@/payload-types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi'
import CourseView from './components/CourseView'

const ParticipationPage: React.FC<{ params: Promise<{ participationId: string }> }> = async ({
  params,
}) => {
  const { participationId } = await params
  const payload = await getPayload({ config: configPromise })
  const customer = await getCustomer()
  let participation: Participation | null = null
  try {
    const res = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user: customer,
    })
    participation = res
  } catch (error) {
    console.error(error)
    notFound()
  }

  if (!participation) {
    return notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <HiArrowLeft className="text-lg" />
          Back to Dashboard
        </Link>
      </div>
      <h1 className="text-3xl font-bold">{(participation.course as Course).title}</h1>
      <CourseView participation={participation} />
    </div>
  )
}

export default ParticipationPage
