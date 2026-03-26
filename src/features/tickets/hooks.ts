import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from './api'

export const ticketKeys = {
	bySiteId: (siteId: string) => ['tickets', siteId] as const
}

export function useTickets(siteId: string) {
	return useQuery({
		queryKey: ticketKeys.bySiteId(siteId),
		queryFn: () => ticketsApi.getBySiteId(siteId),
		enabled: !!siteId
	})
}

export function useCreateTicketCategory(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (body: {
			name: string
			description: string
			language: string
		}) => ticketsApi.createCategory(siteId, body),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ticketKeys.bySiteId(siteId)
			})
	})
}

export function useDeleteTicketCategory(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (categoryId: string) =>
			ticketsApi.deleteCategory(siteId, categoryId),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ticketKeys.bySiteId(siteId)
			})
	})
}

export function useUpdateTicketOption(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			categoryId,
			optionId,
			title,
			price
		}: {
			categoryId: string
			optionId?: string
			title: string
			price: number
		}) => {
			if (optionId) {
				return ticketsApi.updateOption(categoryId, optionId, {
					title,
					price,
					categoryId
				})
			}
			return ticketsApi.createOption(categoryId, {
				title,
				price,
				categoryId
			})
		},
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ticketKeys.bySiteId(siteId)
			})
	})
}

export function useDeleteTicketOption(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			categoryId,
			optionId
		}: {
			categoryId: string
			optionId: string
		}) => ticketsApi.deleteOption(categoryId, optionId),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ticketKeys.bySiteId(siteId)
			})
	})
}
