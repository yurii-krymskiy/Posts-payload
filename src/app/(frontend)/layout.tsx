import React, { Suspense } from 'react'
import './styles.css'
import Toasts from './components/Toasts'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Suspense fallback={null}>
          <Toasts />
        </Suspense>
      </body>
    </html>
  )
}
