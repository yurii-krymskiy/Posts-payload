import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import LoginForm from './components/LoginForm'
import PostForm from './components/PostForm'
import PostsList from './components/PostsList'
import { logout } from '../server/actions/authorizeUser'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>

        {!user ? (
          <>
            <h1>Welcome to the Post Manager</h1>
            <LoginForm />
          </>
        ) : (
          <>
            <div className="user-info">
              <h1 className="greeting">{user.email ? `Hello, ${user.email}` : 'Hello!'}</h1>
              <form className="logout-form" action={async () => { 'use server'; await logout() }}>
                <button className="btn outline" type="submit">Log out</button>
              </form>
            </div>
            <PostForm />
            <PostsList />
          </>
        )}
      </div>
    </div>
  )
}
