'use server'

import { Participation } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getCustomer } from '@/app/(frontend)/(authenticated)/actions/getCustomer'

export async function markProgress(participation: Participation) {
  const payload = await getPayload({ config: configPromise })

  if (!participation || typeof participation.progress !== 'number') {
    console.error('Participation not found or progress is not set')
    return null
  }

  const updatedParticipation = await payload.update({
    collection: 'participation',
    id: participation.id,
    data: { progress: participation.progress + 1 },
    user: await getCustomer(),
    overrideAccess: false,
  })

  return updatedParticipation
}
