import axios from 'axios'
import NextButton from './NextButton'
import { useState } from 'react'

export default function FinishModule({
  participationId,
  courseTitle,
}: {
  participationId: string
  courseTitle: string
}) {
  const [loading, setLoading] = useState(false)

  async function handlePrint() {
    setLoading(true)
    try {
      const resp = await axios.get(`/printCertificate/${participationId}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(resp.data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Certificate_${courseTitle.replace(' ', '_')}.html`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Error printing certificate:', error)
    }
    setLoading(false)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Congratulations!</h1>
      <p>You have completed the course.</p>
      <NextButton text="Download Certificate" onClick={handlePrint} loading={loading} />
    </div>
  )
}
