import { redirect } from 'next/navigation'
import React, { FC, ReactNode } from 'react'
import { getCustomer } from './actions/getCustomer'
import Navbar from './components/Navbar'

type TemplateProps = { children: ReactNode }

const Layout: FC<TemplateProps> = async ({ children }) => {
  const customer = await getCustomer()
  console.info(customer)
  if (!customer) {
    redirect('/login')
    return null
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout
