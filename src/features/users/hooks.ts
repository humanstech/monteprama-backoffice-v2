import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from '@/features/auth/types'
import { usersApi } from './api'
import type { CreateUserInput } from './types'

export const userKeys = {
	all: ['users'] as const
}

export function useUsers() {
	return useQuery({
		queryKey: userKeys.all,
		queryFn: usersApi.getAll
	})
}

export function useCreateUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (user: CreateUserInput) => usersApi.create(user),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: userKeys.all })
	})
}

export function useUpdateUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, ...data }: Partial<User> & { id: string }) =>
			usersApi.update(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: userKeys.all })
	})
}

export function useDeleteUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => usersApi.delete(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: userKeys.all })
	})
}
