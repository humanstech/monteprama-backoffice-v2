import axios from '@/axios'
import type { PoiContent } from '@/features/poi/types'
import type { StatueRaw, SummaryRaw } from './types'

export const statuesApi = {
	getAll: async () => {
		const { data } = await axios.get<{ data: StatueRaw[] }>('/v2/statues', {
			params: { responseType: 'extended' }
		})
		return data.data
	},
	getSummaries: async () => {
		const { data } = await axios.get<SummaryRaw[]>('/v1/summaries', {
			params: { responseType: 'extended' }
		})
		return data[0] ?? null
	},
	updateSummaryContent: async (contentId: string, content: string) => {
		const { data } = await axios.patch<PoiContent>(
			`/v1/summary-contents/${contentId}`,
			{ content },
			{
				params: { responseType: 'extended' }
			}
		)
		return data
	},
	updateStatueContent: async (contentId: string, content: string) => {
		const { data } = await axios.patch<PoiContent>(
			`/v1/statue-contents/${contentId}`,
			{ content },
			{
				params: { responseType: 'extended' }
			}
		)
		return data
	},
	generateSummaryAltText: async (
		summaryId: string,
		body: { quoteMode: boolean; summaryContentIds: string[] }
	) => {
		const { data } = await axios.post(
			`/v1/summaries/${summaryId}/generate`,
			body
		)
		return data
	},
	translateSummary: async (
		summaryId: string,
		body: {
			quoteMode: boolean
			summaryContentIds: string[]
			languages: string[]
		}
	) => {
		const { data } = await axios.post(
			`/v1/summaries/${summaryId}/translate`,
			body
		)
		return data
	},
	summaryTts: async (
		summaryId: string,
		body: {
			quoteMode: boolean
			sitePoiContentIds: string[]
			voiceKeys: string[]
		}
	) => {
		const { data } = await axios.post(
			`/v1/summaries/${summaryId}/tts`,
			body
		)
		return data
	},
	cloneSummaryToTemporary: async (summaryId: string) => {
		const { data } = await axios.post(
			`/v1/summaries/${summaryId}/clone-to-temporary`
		)
		return data
	},
	approveSummary: async (summaryId: string) => {
		const { data } = await axios.post(`/v1/summaries/${summaryId}/approve`)
		return data
	},
	// Statue content-specific endpoints
	generateStatueContent: async (
		statueId: string,
		body: { quoteMode: boolean; statueContentIds: string[] }
	) => {
		const { data } = await axios.post(
			`/v2/statues/${statueId}/generate`,
			body
		)
		return data
	},
	translateStatueContent: async (
		statueId: string,
		body: {
			quoteMode: boolean
			statueContentIds: string[]
			languages: string[]
		}
	) => {
		const { data } = await axios.post(
			`/v2/statues/${statueId}/translate`,
			body
		)
		return data
	},
	statueContentTts: async (
		statueId: string,
		body: {
			quoteMode: boolean
			statueContentIds: string[]
			voiceKeys: string[]
		}
	) => {
		const { data } = await axios.post(`/v2/statues/${statueId}/tts`, body)
		return data
	},
	cloneStatueContentToTemporary: async (statueId: string) => {
		const { data } = await axios.post(
			`/v2/statues/${statueId}/clone-to-temporary`
		)
		return data
	},
	approveStatueContent: async (statueId: string) => {
		const { data } = await axios.post(`/v2/statues/${statueId}/approve`)
		return data
	},
	updateStatueCover: async (
		statueId: string,
		body: Record<string, unknown>
	) => {
		await axios.patch(`/v1/statues/${statueId}`, body)
	}
}
