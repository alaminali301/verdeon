import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  name: string
  email: string
  password: string
}

interface AuthStore {
  hasHydrated: boolean
  users: AuthUser[]
  currentUser: Omit<AuthUser, 'password'> | null
  setHasHydrated: (value: boolean) => void
  signUp: (user: AuthUser) => { ok: boolean; error?: string }
  signIn: (email: string, password: string) => { ok: boolean; error?: string }
  signOut: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      users: [],
      currentUser: null,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      signUp: (user) => {
        const email = user.email.trim().toLowerCase()
        const existing = get().users.find((entry) => entry.email.toLowerCase() === email)

        if (existing) {
          return { ok: false, error: 'An account with that email already exists.' }
        }

        const normalized = {
          ...user,
          email,
          name: user.name.trim(),
        }

        set((state) => ({
          users: [...state.users, normalized],
          currentUser: {
            name: normalized.name,
            email: normalized.email,
          },
        }))

        return { ok: true }
      },
      signIn: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const user = get().users.find((entry) => entry.email.toLowerCase() === normalizedEmail)

        if (!user || user.password !== password) {
          return { ok: false, error: 'Incorrect email or password.' }
        }

        set({
          currentUser: {
            name: user.name,
            email: user.email,
          },
        })

        return { ok: true }
      },
      signOut: () => set({ currentUser: null }),
    }),
    {
      name: 'verdeon-auth',
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
