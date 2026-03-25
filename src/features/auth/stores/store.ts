import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth store state interface - defines the shape of authentication data
interface AuthStoreState {
	accessToken?: string
	refreshToken?: string
}

// Auth store actions interface - defines available methods
interface AuthStoreActions {
	reset: () => void
}

// Create Zustand store with persist middleware for automatic localStorage synchronization
export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
	persist(
		(set) => ({
			// Initial state - tokens start as undefined
			accessToken: undefined,
			refreshToken: undefined,
			// Reset action clears both tokens from store and localStorage
			reset: () =>
				set({ accessToken: undefined, refreshToken: undefined })
		}),
		{
			// localStorage key for persisted data
			name: 'auth-storage',
			// Only persist specific fields to localStorage (eg. Exclude user object, if there will be any)
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken
			})
		}
	)
)
