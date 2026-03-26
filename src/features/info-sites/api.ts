import axios from '@/axios'
import type { InfoSite, InfoSiteCategory } from './types'

export const infoSitesApi = {
	getCategories: async (siteId: string) => {
		const { data } = await axios.get<InfoSiteCategory[]>(
			'/v2/info-sites-categories',
			{
				params: { responseType: 'extended', language: 'it-IT', siteId }
			}
		)
		return data
	},
	getInfoSites: async (siteId: string) => {
		const { data } = await axios.get<InfoSite[]>(
			`/v2/sites/${siteId}/info-sites`,
			{
				params: { responseType: 'extended', language: 'all', siteId }
			}
		)
		// Group by language
		const grouped: Record<string, InfoSite[]> = {}
		for (const item of data) {
			const lang = item.language ?? 'unknown'
			if (!grouped[lang]) {
				grouped[lang] = []
			}
			grouped[lang].push(item)
		}
		return grouped
	},
	updateInfoSite: async (
		categoryId: string,
		infoSiteId: string,
		body: { title?: string; description?: string }
	) => {
		const { data } = await axios.patch<InfoSite>(
			`/v2/info-sites-categories/${categoryId}/info-sites/${infoSiteId}`,
			body,
			{
				params: { responseType: 'extended', language: 'it-IT' }
			}
		)
		return data
	},
	deleteInfoSite: async (categoryId: string, infoSiteId: string) => {
		await axios.delete(
			`/v2/info-sites-categories/${categoryId}/info-sites/${infoSiteId}`
		)
	},
	createInfoSite: async (
		categoryId: string,
		body: {
			title: string
			description: string
			siteId: string
			language: string
			header: string
			categoryId: string
			position: number
		}
	) => {
		const { data } = await axios.post(
			`/v2/info-sites-categories/${categoryId}/info-sites`,
			body
		)
		return data
	},
	updatePositions: async (
		categoryId: string,
		infoSites: Array<{ id: string; position: number }>
	) => {
		await Promise.all(
			infoSites.map(({ id, position }) =>
				axios.patch(
					`/v2/info-sites-categories/${categoryId}/info-sites/${id}`,
					{ position },
					{
						params: { responseType: 'extended' }
					}
				)
			)
		)
	},
	translate: async (
		siteId: string,
		body: { quoteMode: boolean; languages: string[] }
	) => {
		const { data } = await axios.post(
			`/v2/sites/${siteId}/info-sites/translate`,
			body
		)
		return data
	}
}
