import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ContentByLanguage, PoiContent } from '@/features/poi/types'
import { statuesApi } from './api'
import type { Statue, StatueRaw, Summary, SummaryRaw } from './types'

function groupContent(contents: PoiContent[]): {
	data: ContentByLanguage
	dataTemporary: ContentByLanguage
	dataPermanent: ContentByLanguage
	allIds: string[]
} {
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

function parseStatue(raw: StatueRaw): Statue {
	const grouped = groupContent(raw.statueContent ?? [])
	return {
		id: raw.id ?? '',
		name: raw.name ?? null,
		version: raw.version ?? null,
		createdAt: raw.createdAt ?? null,
		updatedAt: raw.updatedAt ?? null,
		...grouped,
		cover: raw.cover ?? null,
		medias: raw.medias ?? [],
		selectedLanguage: 'it-IT'
	}
}

function parseSummary(raw: SummaryRaw): Summary {
	const grouped = groupContent(raw.summaryContent ?? [])
	return {
		id: raw.id,
		name: raw.name ?? null,
		...grouped,
		selectedLanguage: 'it-IT'
	}
}

export const statueKeys = {
	all: ['statues'] as const,
	summaries: ['summaries'] as const
}

export function useStatues() {
	return useQuery({
		queryKey: statueKeys.all,
		queryFn: async () => {
			const raw = await statuesApi.getAll()
			return raw.map(parseStatue)
		}
	})
}

export function useSummaries() {
	return useQuery({
		queryKey: statueKeys.summaries,
		queryFn: async () => {
			const raw = await statuesApi.getSummaries()
			return raw ? parseSummary(raw) : null
		}
	})
}

export { groupContent, parseStatue, parseSummary }

// --- Mutation hooks for summary operations ---

export function useUpdateSummaryContent() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			contentId,
			content
		}: {
			contentId: string
			content: string
		}) => statuesApi.updateSummaryContent(contentId, content),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: statueKeys.summaries })
	})
}

export function useGenerateSummaryAltText() {
	return useMutation({
		mutationFn: ({
			summaryId,
			body
		}: {
			summaryId: string
			body: { quoteMode: boolean; summaryContentIds: string[] }
		}) => statuesApi.generateSummaryAltText(summaryId, body)
	})
}

export function useTranslateSummary() {
	return useMutation({
		mutationFn: ({
			summaryId,
			body
		}: {
			summaryId: string
			body: {
				quoteMode: boolean
				summaryContentIds: string[]
				languages: string[]
			}
		}) => statuesApi.translateSummary(summaryId, body)
	})
}

export function useSummaryTts() {
	return useMutation({
		mutationFn: ({
			summaryId,
			body
		}: {
			summaryId: string
			body: {
				quoteMode: boolean
				sitePoiContentIds: string[]
				voiceKeys: string[]
			}
		}) => statuesApi.summaryTts(summaryId, body)
	})
}

export function useCloneSummaryToTemporary() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (summaryId: string) =>
			statuesApi.cloneSummaryToTemporary(summaryId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: statueKeys.summaries })
	})
}

export function useApproveSummary() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (summaryId: string) => statuesApi.approveSummary(summaryId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: statueKeys.summaries })
	})
}

// --- Mutation hooks for statue content operations ---

export function useUpdateStatueContent() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			contentId,
			content
		}: {
			contentId: string
			content: string
		}) => statuesApi.updateStatueContent(contentId, content),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: statueKeys.all })
	})
}

export function useGenerateStatueContent() {
	return useMutation({
		mutationFn: ({
			statueId,
			body
		}: {
			statueId: string
			body: { quoteMode: boolean; statueContentIds: string[] }
		}) => statuesApi.generateStatueContent(statueId, body)
	})
}

export function useTranslateStatueContent() {
	return useMutation({
		mutationFn: ({
			statueId,
			body
		}: {
			statueId: string
			body: {
				quoteMode: boolean
				statueContentIds: string[]
				languages: string[]
			}
		}) => statuesApi.translateStatueContent(statueId, body)
	})
}

export function useStatueContentTts() {
	return useMutation({
		mutationFn: ({
			statueId,
			body
		}: {
			statueId: string
			body: {
				quoteMode: boolean
				statueContentIds: string[]
				voiceKeys: string[]
			}
		}) => statuesApi.statueContentTts(statueId, body)
	})
}

export function useCloneStatueContentToTemporary() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (statueId: string) =>
			statuesApi.cloneStatueContentToTemporary(statueId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: statueKeys.all })
	})
}

export function useApproveStatueContent() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (statueId: string) =>
			statuesApi.approveStatueContent(statueId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: statueKeys.all })
	})
}
