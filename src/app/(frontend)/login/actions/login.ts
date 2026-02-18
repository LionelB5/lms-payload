'use server'

import { AuthenticationError, getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { Customer } from '@/payload-types'

type LoginParams = {
  email: string
  password: string
}

type LoginResponse = {
  success: boolean
  error?: string
}

type Result = {
  exp?: number
  token?: string
  customer?: Customer
}

export async function login({ email, password }: LoginParams): Promise<LoginResponse> {
  const payload = await getPayload({ config: await configPromise })
  try {
    const result: Result = await payload.login({
      collection: 'customers',
      data: { email, password },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      })

      return { success: true }
    } else {
      return { success: false, error: 'something went wrong' }
    }
  } catch (error) {
    console.error('login error', error)
    if (error instanceof AuthenticationError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'an error occured' }
  }
}
