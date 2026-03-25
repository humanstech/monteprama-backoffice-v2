import { useLocation } from 'react-router'
import type { ZodObject, ZodRawShape } from 'zod'

export const useParsedLocationState = <T extends ZodRawShape>(
	locationStateSchema: ZodObject<T>
) => {
	const location = useLocation()
	return locationStateSchema.safeParse(location.state)
}
