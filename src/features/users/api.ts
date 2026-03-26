import axios from '@/axios'
import type { User } from '@/features/auth/types'
import type { CreateUserInput } from './types'

export const usersApi = {
	getAll: async () => {
		const { data } = await axios.get<{ data: User[] }>('/v1/users', {
			params: { responseType: 'extended', limit: 100 }
		})
		return data.data
	},
	create: async (user: CreateUserInput) => {
		const { data } = await axios.post<User>('/v1/users', user, {
			params: { responseType: 'extended' }
		})
		return data
	},
	update: async (id: string, user: Partial<User>) => {
		const { data } = await axios.patch<User>(`/v1/users/${id}`, user, {
			params: { responseType: 'extended' }
		})
		return data
	},
	delete: async (id: string) => {
		await axios.delete(`/v1/users/${id}`)
	}
}
