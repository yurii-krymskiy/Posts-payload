'use client'

import { useEffect, useMemo, useState, useActionState } from 'react'
import { createPostAction } from '@/app/server/actions/createPost'

export type Category = {
  id: string
  title: string
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories?depth=0&limit=100')
  const json = await res.json()
  return (json?.docs || []).map((c: any) => ({ id: c.id, title: c.title }))
}

export default function PostForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [state, action, pending] = useActionState<any, FormData>(createPostAction as any, null)

  useEffect(() => {
    const load = async () => {
      try {
        let cats = await fetchCategories()
        console.log(cats);
        
        if (!cats.length) {
          // attempt to seed defaults (Fun, Education, Tech)
          await fetch('/api/seed').catch(() => { })
          cats = await fetchCategories()
        }
        setCategories(cats)
      } catch {
        setCategories([])
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (state?.success) {
      // Notify global listener to refresh posts
      ; (window as any).refreshPosts?.()
      setSelected([])
    }
  }, [state?.success])

  const selectedSet = useMemo(() => new Set(selected), [selected])
  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <form action={action} className="card">
      <h2>Create Post</h2>
      <label>
        Title
        <input name="title" type="text" placeholder="My first post" required />
      </label>
      <label>
        Content
        <textarea name="content" rows={5} placeholder="Post content"></textarea>
      </label>
      <div>
        <div style={{ marginBottom: 6 }}>Categories</div>
        <div className="tag-picker">
          {categories.map((c) => {
            const active = selectedSet.has(c.id)
            return (
              <button
                type="button"
                key={c.id}
                className={`chip ${active ? 'active' : ''}`}
                onClick={() => toggle(c.id)}
              >
                {c.title}
              </button>
            )
          })}
        </div>
        {selected.map((id) => (
          <input key={id} type="hidden" name="categories" value={id} />
        ))}
      </div>
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? 'Creating…' : 'Create'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  )
}
