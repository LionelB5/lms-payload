'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'

type SignupParams = {
  email: string
  password: string
}

type SignupResponse = {
  success: boolean
  error?: string
}

export async function signup({ email, password }: SignupParams): Promise<SignupResponse> {
  const payload = await getPayload({ config: await configPromise })
  try {
    await payload.create({ collection: 'customers', data: { email, password } })
  } catch (error) {
    console.error('signup error', error)
    return { success: false, error: 'an error occured' }
  }

  const result = await payload.login({ collection: 'customers', data: { email, password } })
  if (result.token) {
    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
    return { success: true }
  } else {
    return { success: false, error: 'login failed' }
  }
}
