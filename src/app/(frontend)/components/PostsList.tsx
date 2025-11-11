'use client'

import { useEffect, useState } from 'react'

export type Post = {
  id: string
  title: string
  createdAt: string
  owner?: { email?: string } | string
  categories?: Array<{ id: string; title: string } | string>
  content?: any
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts?depth=1&sort=-createdAt')
  const json = await res.json()
  return json?.docs || []
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  async function load() {
    const data = await fetchPosts()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
      ; (window as any).refreshPosts = load
    return () => {
      delete (window as any).refreshPosts
    }
  }, [])

  return (
    <div className="card">
      <h2>Posts</h2>
      {loading && (
        <ul className="posts" style={{ margin: '12px 0' }}>
          {[0, 1, 2].map((i) => (
            <li key={i} className="post">
              <div className="post-header" style={{ marginBottom: "10px" }}>
                <div className="skeleton-line" style={{ width: '50%' }} />
                <div className="meta" style={{ width: '35%' }}>
                  <div className="skeleton-line" style={{ width: '60%', height: 14 }} />
                </div>
              </div>
              <div className="skeleton-line" style={{ width: '100%', marginBottom: "10px" }} />
              <div className="skeleton-line" style={{ width: '85%' }} />
              <div className="tags" style={{ marginTop: 10 }}>
                <span className="skeleton-tag" />
                <span className="skeleton-tag" />
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}
      <ul className="posts">
        {posts.map((p) => {
          const ownerEmail = typeof p.owner === 'string' ? p.owner : p.owner?.email
          const categories = (p.categories || []).map((c) => (typeof c === 'string' ? c : c.title))
          const created = new Date(p.createdAt)
          const plainContent = typeof p.content === 'string' ? p.content : extractPlainText(p.content)
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
              {plainContent && (
                <div className="post-content">
                  {plainContent.length > 260 ? plainContent.slice(0, 260) + '…' : plainContent}
                </div>
              )}
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

// Convert Payload Lexical richText JSON into plain text for simple preview
function extractPlainText(rich: any): string {
  if (!rich) return ''
  if (typeof rich === 'string') return rich
  // Lexical root typically: { root: { children: [...] } }
  const root = rich.root || rich
  const out: string[] = []
  const walk = (node: any) => {
    if (!node) return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    const children = node.children
    if (node.type === 'text' && typeof node.text === 'string') {
      out.push(node.text)
    }
    if (children) walk(children)
  }
  walk(root.children || root)
  return out.join(' ').replace(/\s+/g, ' ').trim()
}
