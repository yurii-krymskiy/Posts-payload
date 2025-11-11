'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export type Toast = { id: number; message: string; type?: 'info' | 'success' | 'error' }

let idCounter = 1

export default function Toasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const searchParams = useSearchParams()
  const add = (message: string, type: Toast['type'] = 'info') => {
    const id = idCounter++
    setToasts((prev) => [...prev, { id, message, type }])
    // Auto remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // Expose global helper
  useEffect(() => {
    ; (window as any).showToast = add
    return () => { delete (window as any).showToast }
  }, [])

  // React to login param changes so toast appears after soft navigations too
  useEffect(() => {
    if (typeof window === 'undefined') return
    const login = searchParams.get('login')
    if (login === 'success') {
      add('Signed in successfully', 'success')
      const url = new URL(window.location.href)
      url.searchParams.delete('login')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
      ))}
    </div>
  )
}
