import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '@/features/media/api'
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

export function useUploadSiteCover(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (files: File[]) => {
			const mediaIds = await mediaApi.uploadFiles(files)
			await sitesApi.patch(siteId, { coverId: mediaIds[0] })
			return mediaIds
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: siteKeys.detail(siteId) })
	})
}

export function useDeleteSiteCover(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => sitesApi.deleteCover(siteId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: siteKeys.detail(siteId) })
	})
}

export function useUploadSiteGallery(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({
			files,
			existingMediaIds
		}: {
			files: File[]
			existingMediaIds: string[]
		}) => {
			const mediaIds = await mediaApi.uploadFiles(files)
			await sitesApi.updateMediaIds(siteId, [
				...existingMediaIds,
				...mediaIds
			])
			return mediaIds
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: siteKeys.detail(siteId) })
	})
}

export function useRemoveSiteMedia(siteId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({
			mediaIdToRemove,
			currentMediaIds
		}: {
			mediaIdToRemove: string
			currentMediaIds: string[]
		}) => {
			const updated = currentMediaIds.filter(
				(id) => id !== mediaIdToRemove
			)
			await sitesApi.updateMediaIds(siteId, updated)
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: siteKeys.detail(siteId) })
	})
}
