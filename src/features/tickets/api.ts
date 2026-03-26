import axios from '@/axios'
import type {
	TicketOptionCategory,
	TicketOptionResponse,
	TicketOptionResponseRaw
} from './types'

export const ticketsApi = {
	getBySiteId: async (siteId: string) => {
		const { data } = await axios.get<TicketOptionResponseRaw>(
			`/v1/site/${siteId}/ticket_options_categories`,
			{
				params: { responseType: 'extended' }
			}
		)
		// Group by language (same as Flutter TicketOptionResponse.fromJson)
		const grouped: Record<string, TicketOptionCategory[]> = {}
		for (const cat of data.data) {
			const lang = cat.language ?? ''
			if (!grouped[lang]) {
				grouped[lang] = []
			}
			grouped[lang].push(cat)
		}
		return { data: grouped, meta: data.meta } satisfies TicketOptionResponse
	},
	createCategory: async (
		siteId: string,
		body: { name: string; description: string; language: string }
	) => {
		const { data } = await axios.post<TicketOptionCategory>(
			`/v1/site/${siteId}/ticket_options_categories`,
			body
		)
		return data
	},
	deleteCategory: async (siteId: string, categoryId: string) => {
		await axios.delete(
			`/v1/site/${siteId}/ticket_options_categories/${categoryId}`
		)
	},
	updateCategoryNoPrice: async (
		siteId: string,
		categoryId: string,
		withoutPrice: boolean
	) => {
		const { data } = await axios.patch(
			`/v1/site/${siteId}/ticket_options_categories/${categoryId}`,
			{ withoutPrice }
		)
		return data
	},
	createOption: async (
		categoryId: string,
		body: { title: string; price: number; categoryId: string }
	) => {
		const { data } = await axios.post(
			`/v2/ticket-options-categories/${categoryId}/ticket-options`,
			body
		)
		return data
	},
	updateOption: async (
		categoryId: string,
		optionId: string,
		body: { title: string; price: number; categoryId: string }
	) => {
		const { data } = await axios.patch(
			`/v2/ticket-options-categories/${categoryId}/ticket-options/${optionId}`,
			body
		)
		return data
	},
	deleteOption: async (categoryId: string, optionId: string) => {
		await axios.delete(
			`/v2/ticket-options-categories/${categoryId}/ticket-options/${optionId}`
		)
	},
	translate: async (
		siteId: string,
		body: {
			quoteMode: boolean
			sourceLanguage: string
			targetLanguages: string[]
		}
	) => {
		const { data } = await axios.post(
			`/v2/sites/${siteId}/ticket-categories/translate`,
			body
		)
		return data
	}
}
