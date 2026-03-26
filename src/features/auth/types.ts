import { z } from 'zod'

export const UserSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email().nullable(),
	isActive: z.boolean().default(false),
	isEditor: z.boolean().default(false),
	isAdmin: z.boolean().default(false),
	createdAt: z.string(),
	updatedAt: z.string()
})
export type User = z.infer<typeof UserSchema>

export const AuthLoginSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
	user: UserSchema.nullable()
})
export type AuthLogin = z.infer<typeof AuthLoginSchema>
