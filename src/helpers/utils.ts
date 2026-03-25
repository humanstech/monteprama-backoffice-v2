import { isAxiosError } from 'axios'
import { type ClassValue, clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import i18n, { DEFAULT_LANGUAGE } from '@/translations/i18n'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Function that throws an error, it's useful to prevent impossible states in the application.
 * Example: const id = params.id ?? raise('No id provided'), in this case id is a string instead of string | undefined
 * @param error
 */
export const raise = (error: string): never => {
	throw new Error(error)
}

export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
	callback: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	let timeout: ReturnType<typeof setTimeout>

	return (...args: Parameters<T>) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			callback(...args)
		}, delay)
	}
}

type HttpErrorKey = keyof typeof DEFAULT_LANGUAGE.json.common.http_errors

export const httpErrorHandler = (error: unknown) => {
	const isKnownError =
		isAxiosError(error) &&
		error.response?.data?.message &&
		error.response.data.message in DEFAULT_LANGUAGE.json.common.http_errors

	const message =
		isKnownError && error.response
			? i18n.t(
					`common:http_errors.${error.response.data.message as HttpErrorKey}`
				)
			: i18n.t('common:http_errors.default')

	return toast.error(message)
}

export const objectKeys = Object.keys as <T extends object>(
	object: T
) => Array<keyof T>

export const objectValues = Object.values as <T extends object>(
	object: T
) => T[keyof T][]

export const objectEntries = Object.entries as <T extends object>(
	object: T
) => { [K in keyof T]: [K, T[K]] }[keyof T][]

export const objectFromEntries = Object.fromEntries as <
	T extends PropertyKey,
	U
>(
	entries: Iterable<readonly [T, U]>
) => { [K in T]: U }
