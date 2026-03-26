import { useMutation } from '@tanstack/react-query'
import { poiApi } from '@/features/poi/api'
import { sitesApi } from '@/features/sites/api'
import { statuesApi } from '@/features/statues/api'
import { mediaApi } from './api'

/** Upload files and attach to a site (as cover or gallery media) */
export function useUploadSiteMedia() {
	return useMutation({
		mutationFn: async ({
			files,
			siteId,
			asCover,
			existingMediaIds
		}: {
			files: File[]
			siteId: string
			asCover?: boolean
			existingMediaIds?: string[]
		}) => {
			const mediaIds = await mediaApi.uploadFiles(files)
			if (asCover) {
				await sitesApi.patch(siteId, { coverId: mediaIds[0] })
			} else if (existingMediaIds) {
				await sitesApi.updateMediaIds(siteId, [
					...mediaIds,
					...existingMediaIds
				])
			} else {
				await sitesApi.patch(siteId, { coverId: mediaIds[0] })
			}
			return mediaIds
		}
	})
}

/** Upload files and attach as POI cover */
export function useUploadPoiCover() {
	return useMutation({
		mutationFn: async ({
			files,
			siteId,
			poiId
		}: {
			files: File[]
			siteId: string
			poiId: string
		}) => {
			const mediaIds = await mediaApi.uploadFiles(files)
			await poiApi.updateCover(siteId, poiId, mediaIds[0])
			return mediaIds
		}
	})
}

/** Upload files and attach to a statue */
export function useUploadStatueMedia() {
	return useMutation({
		mutationFn: async ({
			files,
			statueId,
			asCover,
			existingMediaIds
		}: {
			files: File[]
			statueId: string
			asCover?: boolean
			existingMediaIds?: string[]
		}) => {
			const mediaIds = await mediaApi.uploadFiles(files)
			if (asCover) {
				await statuesApi.updateStatueCover(statueId, {
					coverId: mediaIds[0]
				})
			} else if (existingMediaIds) {
				await statuesApi.updateStatueCover(statueId, {
					mediaIds: [...mediaIds, ...existingMediaIds]
				})
			}
			return mediaIds
		}
	})
}
