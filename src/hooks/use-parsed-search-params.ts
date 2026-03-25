import { useSearchParams } from 'react-router'
import type { ZodObject, ZodRawShape, z } from 'zod'

export type SerializedSearchParam = Record<string, string[] | null>

const urlSearchParamsIterator = (searchValue: URLSearchParams) => {
	const keys: SerializedSearchParam = {}
	for (const key of searchValue.keys()) {
		keys[key] = searchValue.getAll(key)
	}
	return keys
}

export const useParsedSearchParams = <
	T extends readonly string[],
	TSchema extends ZodRawShape
>(
	ParseSchema: ZodObject<TSchema>,
	multiParams?: T
) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const parsedSearchParams = urlSearchParamsIterator(searchParams)

	const remappedSearchParams = Object.fromEntries(
		Object.entries(parsedSearchParams).map(([key, value]) =>
			multiParams?.includes(key) ? [key, value] : [key, value?.[0]]
		)
	)

	const editParams = (editedParams: Partial<z.infer<typeof ParseSchema>>) => {
		const newParams = Object.fromEntries(
			Object.entries({
				...parsedSearchParams,
				...editedParams
			}).filter(([, value]) => value != null)
		) as Record<string, string | string[]>

		setSearchParams(newParams, { replace: true })
	}

	return {
		searchParams: ParseSchema.parse(remappedSearchParams),
		setSearchParams: editParams
	}
}
