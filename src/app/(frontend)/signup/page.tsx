import { ReactElement } from 'react'
import SignupForm from './components/SignupForm'

const Page = async (): Promise<ReactElement> => {
  return (
    <div className="h-[calc(100vh-3rem)]">
      <SignupForm />
    </div>
  )
}

export default Page
