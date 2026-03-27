import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sitesApi } from './api'

export const siteKeys = {
	all: ['sites'] as const,
	detail: (id: string) => ['sites', id] as const
}

export function useSites() {
	return useQuery({
		queryKey: siteKeys.all,
		queryFn: sitesApi.getAll
	})
}

export function useSite(id: string) {
	return useQuery({
		queryKey: siteKeys.detail(id),
		queryFn: () => sitesApi.getById(id),
		enabled: !!id
	})
}

export function useReorderPois(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (
			pois: Array<{ siteId: string; id: string; step: number }>
		) => sitesApi.updatePoiSteps(pois),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: siteKeys.detail(siteId) })
	})
}
