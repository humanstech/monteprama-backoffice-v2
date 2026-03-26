import { z } from 'zod'
import { MediaSchema } from '@/features/media/types'

export const JobStatusSchema = z
	.enum(['not_started', 'in_progress', 'processing', 'completed', 'failed'])
	.nullable()
export type JobStatus = z.infer<typeof JobStatusSchema>

export const PoiContentSchema = z.object({
	id: z.string().nullable().optional(),
	sitePoiId: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	content: z.string().nullable().optional(),
	normalizedContent: z.string().nullable().optional(),
	isSummary: z.boolean().nullable().optional(),
	type: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	voiceKey: z.string().nullable().optional(),
	mediaId: z.unknown().optional(),
	isTemporary: z.boolean().nullable().optional(),
	jobGenerationStatus: JobStatusSchema.optional(),
	jobTranslationStatus: JobStatusSchema.optional(),
	jobTtsStatus: JobStatusSchema.optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
	media: MediaSchema.nullable().optional()
})
export type PoiContent = z.infer<typeof PoiContentSchema>

export const VoiceSchema = z.object({
	id: z.string(),
	key: z.string(),
	voiceId: z.string(),
	isActive: z.boolean(),
	isDefault: z.boolean()
})
export type Voice = z.infer<typeof VoiceSchema>

export type FlowStep =
	| 'textAndMedia'
	| 'generatedTexts'
	| 'translations'
	| 'audio'

export type ContentByLanguage = Record<string, PoiContent[]>
