import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthProvider = 'email' | 'google'

export interface AuthUser {
  name: string
  email: string
  passwordHash?: string
  passwordSalt?: string
  providers: AuthProvider[]
}

interface AuthStore {
  hasHydrated: boolean
  users: AuthUser[]
  currentUser: Pick<AuthUser, 'name' | 'email'> & { provider: AuthProvider } | null
  setHasHydrated: (value: boolean) => void
  signUp: (user: { name: string; email: string; password: string }) => Promise<{ ok: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signInWithGoogle: (profile: { email: string; name?: string }) => Promise<{ ok: boolean; error?: string }>
  signOut: () => void
}

const encoder = new TextEncoder()

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function createSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return toHex(bytes.buffer)
}

async function hashPassword(password: string, salt: string) {
  const payload = encoder.encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', payload)
  return toHex(digest)
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      users: [],
      currentUser: null,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      signUp: async (user) => {
        const email = user.email.trim().toLowerCase()
        const existing = get().users.find((entry) => entry.email.toLowerCase() === email)

        if (existing) {
          return { ok: false, error: 'An account with that email already exists.' }
        }

        const passwordSalt = createSalt()
        const passwordHash = await hashPassword(user.password, passwordSalt)
        const normalized = {
          email,
          name: user.name.trim(),
          passwordHash,
          passwordSalt,
          providers: ['email'] as AuthProvider[],
        }

        set((state) => ({
          users: [...state.users, normalized],
          currentUser: {
            name: normalized.name,
            email: normalized.email,
            provider: 'email',
          },
        }))

        return { ok: true }
      },
      signIn: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const user = get().users.find((entry) => entry.email.toLowerCase() === normalizedEmail)

        if (!user || !user.passwordHash || !user.passwordSalt) {
          return { ok: false, error: 'Incorrect email or password.' }
        }

        const incomingHash = await hashPassword(password, user.passwordSalt)

        if (incomingHash !== user.passwordHash) {
          return { ok: false, error: 'Incorrect email or password.' }
        }

        set({
          currentUser: {
            name: user.name,
            email: user.email,
            provider: 'email',
          },
        })

        return { ok: true }
      },
      signInWithGoogle: async ({ email, name }) => {
        const normalizedEmail = email.trim().toLowerCase()
        const fallbackName = normalizedEmail.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Google user'
        const displayName = (name?.trim() || fallbackName)
          .replace(/\s+/g, ' ')
          .replace(/^./, (character) => character.toUpperCase())
        const users = get().users
        const existingIndex = users.findIndex((entry) => entry.email.toLowerCase() === normalizedEmail)

        if (existingIndex >= 0) {
          const existing = users[existingIndex]
          const providers = Array.from(new Set<AuthProvider>([...existing.providers, 'google']))
          const updatedUser: AuthUser = {
            ...existing,
            name: existing.name || displayName,
            providers,
          }

          set((state) => ({
            users: state.users.map((entry) => (entry.email.toLowerCase() === normalizedEmail ? updatedUser : entry)),
            currentUser: {
              name: updatedUser.name,
              email: updatedUser.email,
              provider: 'google',
            },
          }))

          return { ok: true }
        }

        const newUser: AuthUser = {
          name: displayName,
          email: normalizedEmail,
          providers: ['google'],
        }

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: {
            name: newUser.name,
            email: newUser.email,
            provider: 'google',
          },
        }))

        return { ok: true }
      },
      signOut: () => set({ currentUser: null }),
    }),
    {
      name: 'verdeon-auth-v2',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
