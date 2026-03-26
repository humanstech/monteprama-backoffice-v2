import axios from '@/axios'
import type { AuthLogin } from './types'

export const authApi = {
	login: async (email: string, password: string) => {
		const { data } = await axios.post<AuthLogin>('/v1/auth/login', {
			email,
			password
		})
		return data
	},
	logout: async () => {
		await axios.post('/v1/auth/logout')
	},
	refresh: async (token: string) => {
		const { data } = await axios.post<AuthLogin>('/v1/auth/refresh', {
			token
		})
		return data
	},
	changePassword: async (email: string) => {
		await axios.post('/v1/auth/change-password', { email })
	}
}
