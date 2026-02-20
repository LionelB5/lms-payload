import { getPayload } from 'payload'
import { getCustomer } from '../../../actions/getCustomer'
import configPromise from '@payload-config'
import { Course, Participation } from '@/payload-types'
import { notFound } from 'next/navigation'

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

  return <div>{(participation.course as Course).title}</div>
}

export default ParticipationPage
