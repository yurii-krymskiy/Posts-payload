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
    // If an auth token is provided (from authorizeUser), use it. Otherwise, rely on implicit user from cookies/headers if any
    const result = await (payload as any).create({
      collection: 'posts' as any,
      data: {
        title: input.title,
        content: input.content ?? null,
        categories: input.categoryIds ?? [],
      },
      overrideAccess: false,
      user: undefined,
      req: token
        ? ({ headers: {
              Authorization: `JWT ${token}`,
              cookie: `payload-token=${token}`,
            } } as any)
        : undefined,
    })

    return { success: true, post: result }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
