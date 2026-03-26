import { z } from 'zod'

export const CreateUserSchema = z.object({
	firstName: z.string().min(1, 'Nome obbligatorio'),
	lastName: z.string().min(1, 'Cognome obbligatorio'),
	email: z.string().email('Email non valida'),
	isAdmin: z.boolean().default(false)
})
export type CreateUserInput = z.infer<typeof CreateUserSchema>
