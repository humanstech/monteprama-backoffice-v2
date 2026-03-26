import axios from '@/axios'
import type { PoiContent, Voice } from './types'

export const poiApi = {
	getAllContents: async (poiId: string) => {
		const { data } = await axios.get<{ data: PoiContent[] }>(
			'/v1/site-poi-contents',
			{
				params: {
					sitePoiIds: poiId,
					responseType: 'extended',
					limit: 100
				}
			}
		)
		return data
	},
	updateContent: async (contentId: string, content: string) => {
		const { data } = await axios.patch(
			`/v1/site-poi-contents/${contentId}`,
			{ content },
			{
				params: { responseType: 'extended', language: 'it-IT' }
			}
		)
		return data
	},
	updateCover: async (siteId: string, poiId: string, coverId: string) => {
		await axios.patch(`/v2/sites/${siteId}/poi/${poiId}`, { coverId })
	},
	generate: async (
		siteId: string,
		poiId: string,
		body: { quoteMode: boolean; sitePoiContentIds: string[] }
	) => {
		const { data } = await axios.post(
			`/v2/sites/${siteId}/poi/${poiId}/generate`,
			body
		)
		return data
	},
	translate: async (
		siteId: string,
		poiId: string,
		body: {
			quoteMode: boolean
			sitePoiContentIds: string[]
			languages: string[]
		}
	) => {
		const { data } = await axios.post(
			`/v2/sites/${siteId}/poi/${poiId}/translate`,
			body
		)
		return data
	},
	ttsGenerate: async (
		siteId: string,
		poiId: string,
		body: {
			quoteMode: boolean
			sitePoiContentIds: string[]
			voiceKeys: string[]
		}
	) => {
		const { data } = await axios.post(
			`/v2/sites/${siteId}/poi/${poiId}/tts`,
			body
		)
		return data
	},
	getVoices: async () => {
		const { data } = await axios.get<Voice[]>('/v1/audio-guides/voices')
		return data
	},
	cloneToTemporary: async (siteId: string, poiId: string) => {
		const { data } = await axios.post(
			`/v2/sites/${siteId}/poi/${poiId}/clone-to-temporary`
		)
		return data as {
			status: string
			message: string
			temporaryContentsCount: number
		}
	},
	approve: async (siteId: string, poiId: string) => {
		const { data } = await axios.post(
			`/v2/sites/${siteId}/poi/${poiId}/approve`
		)
		return data
	}
}
