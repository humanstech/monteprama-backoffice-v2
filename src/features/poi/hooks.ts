import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { poiApi } from './api'
import type { ContentByLanguage, PoiContent } from './types'

export const poiKeys = {
	contents: (poiId: string) => ['poi-contents', poiId] as const,
	voices: ['voices'] as const
}

function groupPoiContent(contents: PoiContent[]) {
	const data: ContentByLanguage = {}
	const dataTemporary: ContentByLanguage = {}
	const dataPermanent: ContentByLanguage = {}
	const allIds: string[] = []

	for (const content of contents) {
		if (content.id) {
			allIds.push(content.id)
		}
		const lang = content.language ?? ''
		if (!data[lang]) {
			data[lang] = []
		}
		data[lang].push(content)
		if (content.isTemporary) {
			if (!dataTemporary[lang]) {
				dataTemporary[lang] = []
			}
			dataTemporary[lang].push(content)
		} else {
			if (!dataPermanent[lang]) {
				dataPermanent[lang] = []
			}
			dataPermanent[lang].push(content)
		}
	}
	return { data, dataTemporary, dataPermanent, allIds }
}

/**
 * Fetches POI contents. When `polling` is true, refetches every 2s
 * (used after triggering generation/translation/TTS jobs).
 */
export function usePoiContents(poiId: string, polling = false) {
	return useQuery({
		queryKey: poiKeys.contents(poiId),
		queryFn: async () => {
			const response = await poiApi.getAllContents(poiId)
			return groupPoiContent(response.data ?? [])
		},
		enabled: !!poiId,
		refetchInterval: polling ? 2000 : false
	})
}

export function useVoices() {
	return useQuery({
		queryKey: poiKeys.voices,
		queryFn: poiApi.getVoices
	})
}

export function useUpdatePoiContent(poiId: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			contentId,
			content
		}: {
			contentId: string
			content: string
		}) => poiApi.updateContent(contentId, content),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: poiKeys.contents(poiId) })
	})
}

export function useGeneratePoiContent() {
	return useMutation({
		mutationFn: ({
			siteId,
			poiId,
			body
		}: {
			siteId: string
			poiId: string
			body: { quoteMode: boolean; sitePoiContentIds: string[] }
		}) => poiApi.generate(siteId, poiId, body)
	})
}

export function useTranslatePoiContent() {
	return useMutation({
		mutationFn: ({
			siteId,
			poiId,
			body
		}: {
			siteId: string
			poiId: string
			body: {
				quoteMode: boolean
				sitePoiContentIds: string[]
				languages: string[]
			}
		}) => poiApi.translate(siteId, poiId, body)
	})
}

export function useTtsPoiContent() {
	return useMutation({
		mutationFn: ({
			siteId,
			poiId,
			body
		}: {
			siteId: string
			poiId: string
			body: {
				quoteMode: boolean
				sitePoiContentIds: string[]
				voiceKeys: string[]
			}
		}) => poiApi.ttsGenerate(siteId, poiId, body)
	})
}

export function useCloneToTemporary() {
	return useMutation({
		mutationFn: ({ siteId, poiId }: { siteId: string; poiId: string }) =>
			poiApi.cloneToTemporary(siteId, poiId)
	})
}

export function useApprovePoiContent() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ siteId, poiId }: { siteId: string; poiId: string }) =>
			poiApi.approve(siteId, poiId),
		onSuccess: (_, { poiId }) =>
			queryClient.invalidateQueries({ queryKey: poiKeys.contents(poiId) })
	})
}

export { groupPoiContent }
