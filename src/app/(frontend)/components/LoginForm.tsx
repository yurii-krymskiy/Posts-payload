'use client'

import { useActionState } from 'react'
import { authorizeUserAction } from '@/app/server/actions/authorizeUser'

type Props = {
  onLogin?: (result: any) => void
}

type ActionState = { success?: boolean; user?: any; error?: string | null } | null

export default function LoginForm({ onLogin }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    authorizeUserAction as any,
    null,
  )

  // Notify parent when login success
  if (state?.success && onLogin) {
    onLogin(state.user)
  }

  return (
    <form action={formAction} className="card">
      <h2>Sign in</h2>
      <label>
        Email
        <input name="email" type="email" placeholder="test@test.com" required />
      </label>
      <label>
        Password
        <input name="password" type="password" placeholder="test" required />
      </label>
      <button type="submit" disabled={pending} className="btn primary" aria-busy={pending}>
        {pending && <span className="spinner" aria-hidden="true" />} {pending ? 'Signing in…' : 'Sign in'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  )
}
