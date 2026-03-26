import { z } from 'zod'
import { MediaSchema } from '@/features/media/types'
import { PoiContentSchema } from '@/features/poi/types'

export const SitePoiSchema = z.object({
	id: z.string().nullable().optional(),
	siteId: z.string().nullable().optional(),
	qrCode: z.string().nullable().optional(),
	coverId: z.string().nullable().optional(),
	step: z.number().nullable().optional(),
	posX: z.number().nullable().optional(),
	posY: z.number().nullable().optional(),
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	sitePoiContent: z.array(PoiContentSchema).nullable().optional(),
	cover: MediaSchema.nullable().optional()
})
export type SitePoi = z.infer<typeof SitePoiSchema>

export const SiteSchema = z.object({
	id: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	siteContent: PoiContentSchema.nullable().optional(),
	cover: MediaSchema.nullable().optional(),
	medias: z.array(MediaSchema).nullable().optional(),
	pointsOfInterest: z.array(SitePoiSchema).nullable().optional()
})
export type Site = z.infer<typeof SiteSchema>
