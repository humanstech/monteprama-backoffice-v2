import axios from '@/axios'
import type { Site } from './types'

export const sitesApi = {
	getAll: async () => {
		const { data } = await axios.get<{ data: Site[] }>('/v2/sites', {
			params: { responseType: 'extended' }
		})
		return data.data
	},
	getById: async (id: string) => {
		const { data } = await axios.get<Site>(`/v2/sites/${id}`, {
			params: { responseType: 'extended', language: 'it-IT' }
		})
		return data
	},
	patch: async (id: string, body: Record<string, unknown>) => {
		const { data } = await axios.patch(`/v2/sites/${id}`, body)
		return data
	},
	updatePoiCoordinates: async (
		siteId: string,
		poiId: string,
		posX: number,
		posY: number
	) => {
		const { data } = await axios.patch(`/v2/sites/${siteId}/poi/${poiId}`, {
			posX,
			posY
		})
		return data
	},
	updatePoiSteps: async (
		pois: Array<{ siteId: string; id: string; step: number }>
	) => {
		await Promise.all(
			pois.map(({ siteId, id, step }) =>
				axios.patch(`/v2/sites/${siteId}/poi/${id}`, { step })
			)
		)
	},
	deleteCover: async (siteId: string) => {
		await axios.patch(`/v2/sites/${siteId}`, { coverId: null })
	},
	updateMediaIds: async (siteId: string, mediaIds: string[]) => {
		await axios.patch(`/v2/sites/${siteId}`, { mediaIds })
	}
}
