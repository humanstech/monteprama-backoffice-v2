import { z } from 'zod'

export const InfoSiteSchema = z.object({
	id: z.string().nullable().optional(),
	categoryId: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	header: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	position: z.number().nullable().optional(),
	siteId: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
	categoryName: z.string().nullable().optional(),
	categoryButtonText: z.string().nullable().optional()
})
export type InfoSite = z.infer<typeof InfoSiteSchema>

export const InfoSiteCategorySchema = z.object({
	id: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	buttonText: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional()
})
export type InfoSiteCategory = z.infer<typeof InfoSiteCategorySchema>
