import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthStoreState {
	accessToken?: string
	refreshToken?: string
	user?: User
}

interface AuthStoreActions {
	setAuth: (auth: {
		accessToken: string
		refreshToken: string
		user?: User | null
	}) => void
	reset: () => void
}

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
	persist(
		(set) => ({
			accessToken: undefined,
			refreshToken: undefined,
			user: undefined,
			setAuth: ({ accessToken, refreshToken, user }) =>
				set({ accessToken, refreshToken, user: user ?? undefined }),
			reset: () =>
				set({
					accessToken: undefined,
					refreshToken: undefined,
					user: undefined
				})
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				user: state.user
			})
		}
	)
)
