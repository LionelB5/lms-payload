'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getCustomer } from './getCustomer'
import { Participation } from '@/payload-types'

export async function participate({ courseId }: { courseId: string }): Promise<Participation> {
  const payload = await getPayload({ config: configPromise })
  const customer = await getCustomer()
  if (!customer) {
    throw new Error('customer not found')
  }
  try {
    return await payload.create({
      collection: 'participation',
      data: {
        course: courseId,
        customer: customer.id,
        progress: 0,
      },
      overrideAccess: false,
      user: customer,
    })
  } catch (error) {
    console.error(error)
    throw new Error('error creating participation')
  }
}
