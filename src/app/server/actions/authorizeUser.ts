'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

export async function authorizeUser(email: string, password: string) {
  const payload = await getPayload({ config: await configPromise })
  try {
    const result = await payload.login({ collection: 'users', data: { email, password } })
    // Set the auth cookie so subsequent requests are authenticated in Next.js
    const cookieStore = await cookies()
    if (result.token) {
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        path: '/',
      })
    }
    // result: { user, token }
    return { success: true, user: result.user, token: result.token }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
