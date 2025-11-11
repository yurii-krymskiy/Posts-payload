'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

type CreatePostInput = {
  title: string
  content?: any
  categoryIds?: string[]
}

export async function createPost(input: CreatePostInput, authToken?: string) {
  const payload = await getPayload({ config: await configPromise })

  try {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get('payload-token')?.value
    const token = authToken || cookieToken
    // Build a proper Headers instance for Payload auth (previous object caused headers.get error)
    let user: any = undefined
    let headers: Headers | undefined
    if (token) {
      try {
        headers = new Headers()
        headers.set('cookie', `payload-token=${token}`)
        headers.set('accept-language', 'en')
        const authRes = await (payload as any).auth({ headers })
        user = authRes?.user
      } catch (e) {
        // fall through; will return auth error below
      }
    }

    if (!user) {
      return { success: false, error: 'Вы не авторизованы. Пожалуйста, войдите в систему.' }
    }

    // Create the post with explicit user so access and hooks pass
    const result = await (payload as any).create({
      collection: 'posts' as any,
      data: {
        title: input.title,
        content: input.content ?? null,
        categories: input.categoryIds ?? [],
      },
      overrideAccess: false,
      user,
      req: headers ? ({ headers } as any) : undefined,
    })

    return { success: true, post: result }
  } catch (e: any) {
    let details = ''
    if (e?.data) {
      try { details = JSON.stringify(e.data) } catch {}
    } else if (e?.errors) {
      try { details = JSON.stringify(e.errors) } catch {}
    }
    return { success: false, error: details || e.message }
  }
}

// Server action compatible with <form action={...}>
export async function createPostAction(_prevState: any, formData: FormData) {
  const title = String(formData.get('title') || '')
  const content = formData.get('content')
  const categoriesRaw = formData.getAll('categories')
  // Coerce IDs to correct types (Postgres may use numeric IDs). Filter empties.
  const categoryIds = categoriesRaw
    .map((v) => {
      const s = String(v)
      if (!s) return null
      return /^\d+$/.test(s) ? Number(s) : s
    })
    .filter((v) => v !== null)
  return createPost({ title, content, categoryIds: categoryIds as any[] })
}
