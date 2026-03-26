import { z } from 'zod'
import { MediaSchema } from '@/features/media/types'
import { type ContentByLanguage, PoiContentSchema } from '@/features/poi/types'
import { SitePoiSchema } from '@/features/sites/types'

export const StatueSchema = z.object({
	id: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	version: z.number().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
	statueContent: z.array(PoiContentSchema).optional(),
	cover: MediaSchema.nullable().optional(),
	medias: z.array(MediaSchema).nullable().optional(),
	pointsOfInterest: z.array(SitePoiSchema).nullable().optional()
})
export type StatueRaw = z.infer<typeof StatueSchema>

export interface Statue {
	id: string
	name: string | null
	version: number | null
	createdAt: string | null
	updatedAt: string | null
	data: ContentByLanguage
	dataTemporary: ContentByLanguage
	dataPermanent: ContentByLanguage
	allIds: string[]
	cover: z.infer<typeof MediaSchema> | null
	medias: z.infer<typeof MediaSchema>[]
	selectedLanguage: string
}

export const SummarySchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	summaryContent: z.array(PoiContentSchema).optional()
})
export type SummaryRaw = z.infer<typeof SummarySchema>

export interface Summary {
	id: string
	name: string | null
	data: ContentByLanguage
	dataTemporary: ContentByLanguage
	dataPermanent: ContentByLanguage
	allIds: string[]
	selectedLanguage: string
}
