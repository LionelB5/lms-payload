import { ReactElement } from 'react'
import LoginForm from './components/LoginForm'

const Page = async (): Promise<ReactElement> => {
  return (
    <div className="h-[calc(100vh-3rem)]">
      <LoginForm />
    </div>
  )
}

export default Page
