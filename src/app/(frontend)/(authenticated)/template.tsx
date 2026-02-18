import { redirect } from 'next/navigation'
import React, { FC, ReactNode } from 'react'
import { getCustomer } from './actions/getCustomer'

type TemplateProps = { children: ReactNode }

const Layout: FC<TemplateProps> = async ({ children }) => {
  const customer = await getCustomer()
  console.info(customer)
  if (!customer) {
    redirect('/foo')
    return null
  }
  return <>{children}</>
}

export default Layout
