import { z } from 'zod'

export const TicketOptionSchema = z.object({
	id: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	price: z.number().nullable().optional(),
	language: z.string().nullable().optional(),
	categoryId: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional()
})
export type TicketOption = z.infer<typeof TicketOptionSchema>

export const TicketOptionCategorySchema = z.object({
	id: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	withoutPrice: z.boolean().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
	ticketOptions: z.array(TicketOptionSchema).nullable().optional()
})
export type TicketOptionCategory = z.infer<typeof TicketOptionCategorySchema>

export const TicketOptionResponseSchema = z.object({
	data: z.array(TicketOptionCategorySchema),
	meta: z.object({
		total: z.number().optional(),
		perPage: z.number().optional(),
		currentPage: z.number().optional(),
		lastPage: z.number().optional()
	})
})
export type TicketOptionResponseRaw = z.infer<typeof TicketOptionResponseSchema>

export interface TicketOptionResponse {
	data: Record<string, TicketOptionCategory[]>
	meta: TicketOptionResponseRaw['meta']
}
