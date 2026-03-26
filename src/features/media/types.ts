import { z } from 'zod'

export const MediaSchema = z.object({
	id: z.string(),
	filename: z.string().nullable(),
	url: z.string().nullable(),
	type: z.string().nullable(),
	createdAt: z.string().nullable(),
	updatedAt: z.string().nullable()
})
export type Media = z.infer<typeof MediaSchema>

export const PresignedUrlResponseSchema = z.object({
	urls: z.array(z.string())
})
export type PresignedUrlResponse = z.infer<typeof PresignedUrlResponseSchema>
