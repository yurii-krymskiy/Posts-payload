'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
        sameSite: 'lax',
      })
    }
    // result: { user, token }
    return { success: true, user: result.user, token: result.token }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// Server action compatible with <form action={...}>
export async function authorizeUserAction(_prevState: any, formData: FormData) {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const res = await authorizeUser(email, password)
  if (res?.success) {
    // Ensure the page re-renders with fresh cookies immediately
    revalidatePath('/')
    redirect('/?login=success')
  }
  return res
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('payload-token', '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax' })
  revalidatePath('/')
  redirect('/')
}
