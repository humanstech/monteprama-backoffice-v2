import { useQuery } from '@tanstack/react-query'
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
