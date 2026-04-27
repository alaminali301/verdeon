'use client'

import { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/lib/store/useAuthStore'

type Mode = 'signin' | 'signup'
type AuthRedirectPath =
  | '/dashboard'
  | '/explorer'
  | '/facilities'
  | '/states'
  | '/recommendations'
  | '/upload'

const ALLOWED_REDIRECTS: AuthRedirectPath[] = [
  '/dashboard',
  '/explorer',
  '/facilities',
  '/states',
  '/recommendations',
  '/upload',
]

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const signUp = useAuthStore((state) => state.signUp)
  const signIn = useAuthStore((state) => state.signIn)
  const currentUser = useAuthStore((state) => state.currentUser)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const nextParam = searchParams.get('next')
  const nextPath: AuthRedirectPath =
    nextParam && ALLOWED_REDIRECTS.includes(nextParam as AuthRedirectPath)
      ? (nextParam as AuthRedirectPath)
      : '/dashboard'
  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const heading = useMemo(
    () =>
      mode === 'signup'
        ? 'Create your Verdeon account'
        : 'Sign in to Verdeon',
    [mode],
  )

  function handleSubmit() {
    setError(null)

    if (!email.trim() || !password.trim() || (mode === 'signup' && !name.trim())) {
      setError('Please complete all required fields.')
      return
    }

    if (mode === 'signup') {
      const result = signUp({
        name,
        email,
        password,
      })

      if (!result.ok) {
        setError(result.error ?? 'Unable to create account.')
        return
      }
    } else {
      const result = signIn(email, password)
      if (!result.ok) {
        setError(result.error ?? 'Unable to sign in.')
        return
      }
    }

    router.push(nextPath)
  }

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[520px]">
        <Card className="rounded-[24px] p-8 shadow-lift">
          <div className="mb-6 flex rounded-full border border-green-100 bg-green-50 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={[
                'flex-1 rounded-full px-4 py-2 text-sm transition-colors',
                mode === 'signin' ? 'bg-green-900 text-white' : 'text-green-900',
              ].join(' ')}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={[
                'flex-1 rounded-full px-4 py-2 text-sm transition-colors',
                mode === 'signup' ? 'bg-green-900 text-white' : 'text-green-900',
              ].join(' ')}
            >
              Sign up
            </button>
          </div>

          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Account</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] tracking-[-0.03em] text-green-950">
            {heading}
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            This is a front-end demo auth flow for previewing the product experience.
          </p>

          {hasHydrated && currentUser ? (
            <div className="mt-5 rounded-[16px] border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-900">
              Signed in as <span className="font-semibold">{currentUser.name}</span> ({currentUser.email})
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {mode === 'signup' ? (
              <label className="block">
                <span className="mb-2 block text-sm text-green-900">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-[14px] border border-green-200 px-4 py-3 outline-none focus:border-green-600"
                  placeholder="Your name"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm text-green-900">Email</span>
              <input
                value={email}
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[14px] border border-green-200 px-4 py-3 outline-none focus:border-green-600"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-green-900">Password</span>
              <input
                value={password}
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[14px] border border-green-200 px-4 py-3 outline-none focus:border-green-600"
                placeholder="Password"
              />
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

          <div className="mt-6">
            <Button className="w-full justify-center" onClick={handleSubmit}>
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
          </div>
        </Card>
      </PageWrapper>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="px-6 py-12 pt-28" />}>
      <AuthForm />
    </Suspense>
  )
}
