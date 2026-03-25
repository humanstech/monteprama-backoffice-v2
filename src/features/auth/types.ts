import { z } from 'zod'

export const User = z.object({
	id: z.string(),
	email: z.string().email(),
	first_name: z.string(),
	last_name: z.string(),
	picture_url: z.string().url().nullable(),
	phone: z.string().nullable(),
	code: z.coerce.number().int(),
	password: z.string()
})
export type User = z.infer<typeof User>

const AuthState = z.object({
	user: User.nullable(),
	accessToken: z.string(),
	refreshToken: z.string()
})
export type AuthState = z.infer<typeof AuthState>
