'use client'

import { useEffect, useState } from 'react'

export type Post = {
  id: string
  title: string
  createdAt: string
  owner?: { email?: string } | string
  categories?: Array<{ id: string; title: string } | string>
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts?depth=1&sort=-createdAt')
  const json = await res.json()
  return json?.docs || []
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([])

  async function load() {
    const data = await fetchPosts()
    setPosts(data)
  }

  useEffect(() => {
    load()
    ;(window as any).refreshPosts = load
    return () => {
      delete (window as any).refreshPosts
    }
  }, [])

  return (
    <div className="card">
      <h2>Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul className="posts">
        {posts.map((p) => {
          const ownerEmail = typeof p.owner === 'string' ? p.owner : p.owner?.email
          const categories = (p.categories || []).map((c) => (typeof c === 'string' ? c : c.title))
          const created = new Date(p.createdAt)
          return (
            <li key={p.id} className="post">
              <div className="post-header">
                <h3>{p.title}</h3>
                <div className="meta">
                  <span>by {ownerEmail || 'Unknown'}</span>
                  <span>
                    {created.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    {created.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {categories.length > 0 && (
                <div className="tags">
                  {categories.map((c) => (
                    <span key={c} className="tag">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
