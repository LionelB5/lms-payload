'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { logout } from '../actions/logout'
import { AiOutlineLogout } from 'react-icons/ai'

const LogoutButton: React.FC = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogout() {
    setIsPending(true)
    setError(null)

    const result = await logout()

    setIsPending(false)

    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Logout failed')
    }
  }

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleLogout} disabled={isPending} className="text-white rounded">
        {isPending ? 'Logging out...' : <AiOutlineLogout size={24} />}
      </button>
    </>
  )
}

export default LogoutButton
