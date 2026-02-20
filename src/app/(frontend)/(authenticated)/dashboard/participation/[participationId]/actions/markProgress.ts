'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getCustomer } from '@/app/(frontend)/(authenticated)/actions/getCustomer'

export async function markProgress(participationId: string) {
  const payload = await getPayload({ config: configPromise })

  const currentParticipation = await payload.findByID({
    collection: 'participation',
    id: participationId,
    overrideAccess: false,
    user: await getCustomer(),
  })

  if (!currentParticipation || typeof currentParticipation.progress !== 'number') {
    console.error('Participation not found or progress is not set')
    return null
  }

  const updatedParticipation = await payload.update({
    collection: 'participation',
    id: currentParticipation.id,
    data: { progress: currentParticipation.progress + 1 },
    user: await getCustomer(),
    overrideAccess: false,
  })

  return updatedParticipation
}
