'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SubmitButton from '../../components/SubmitButton'
import { login } from '../actions/login'

const LoginForm: React.FC = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const result = await login({ email, password })
    setIsPending(false)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error ?? 'An error occurred')
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center items-center">
      <div className="text-3xl">Login</div>
      <div className="w-full mx-auto sm:max-w-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input className="w-full textInput" type="email" id="email" name="email" />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="password">Password</label>
            <input className="w-full textInput" type="password" id="password" name="password" />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <SubmitButton loading={isPending} text="Login" />
        </form>
        <p className="mt-10 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-500">
            Signup
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
