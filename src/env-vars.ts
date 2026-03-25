import { z } from 'zod'

/* const boolEnvvar = z
    .string()
    .optional()
    .transform(string => string == 'true') */

export const envVars = z
	.object({
		VITE_APP_TITLE: z.string().optional(),
		VITE_API_ENDPOINT: z.string().url()
	})
	.parse(import.meta.env)
