import { useParams } from 'react-router'
import type { ZodObject, ZodRawShape } from 'zod'

export const useParsedUrlParams = <T extends ZodRawShape>(
	paramsSchema: ZodObject<T>
) => {
	const params = useParams()
	return paramsSchema.safeParse({ ...params })
}
