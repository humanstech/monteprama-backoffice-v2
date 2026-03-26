import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { infoSitesApi } from './api'

export const infoSiteKeys = {
	categories: (siteId: string) => ['info-sites-categories', siteId] as const,
	sites: (siteId: string) => ['info-sites', siteId] as const
}

export function useInfoSiteCategories(siteId: string) {
	return useQuery({
		queryKey: infoSiteKeys.categories(siteId),
		queryFn: () => infoSitesApi.getCategories(siteId),
		enabled: !!siteId
	})
}

export function useInfoSites(siteId: string) {
	return useQuery({
		queryKey: infoSiteKeys.sites(siteId),
		queryFn: () => infoSitesApi.getInfoSites(siteId),
		enabled: !!siteId
	})
}

export function useUpdateInfoSite(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			categoryId,
			infoSiteId,
			title,
			description
		}: {
			categoryId: string
			infoSiteId: string
			title?: string
			description?: string
		}) =>
			infoSitesApi.updateInfoSite(categoryId, infoSiteId, {
				title,
				description
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: infoSiteKeys.sites(siteId)
			})
	})
}

export function useDeleteInfoSite(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			categoryId,
			infoSiteId
		}: {
			categoryId: string
			infoSiteId: string
		}) => infoSitesApi.deleteInfoSite(categoryId, infoSiteId),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: infoSiteKeys.sites(siteId)
			})
	})
}

export function useCreateInfoSite(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (body: {
			title: string
			description: string
			categoryId: string
		}) =>
			infoSitesApi.createInfoSite(body.categoryId, {
				...body,
				siteId,
				language: 'it-IT',
				header: 'categoryName',
				position: 0
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: infoSiteKeys.sites(siteId)
			})
	})
}
