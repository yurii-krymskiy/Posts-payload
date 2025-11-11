import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async () => {
  const payload = await getPayload({ config: await configPromise })
  const email = 'test@test.com'
  const password = 'test'

  try {
    // check if exists
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'users', data: { email, password } })
    }

    return Response.json({ ok: true, email, password })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 })
  }
}
