import { enUS, it, type Locale } from 'date-fns/locale'
import { format, formatInTimeZone } from 'date-fns-tz'
import i18next from 'i18next'
import { type AppLanguage, DEFAULT_LANGUAGE } from './translations/i18n'

const locales = {
	en: enUS,
	it
} as const satisfies Record<AppLanguage['code'], Locale>

export const formatLocaleDate = (date: string | Date, formatType = 'P') => {
	const currentLang = i18next.language || DEFAULT_LANGUAGE.code
	const locale =
		locales[currentLang as keyof typeof locales] ||
		locales[DEFAULT_LANGUAGE.code]
	return format(new Date(date), formatType, { locale })
}

export const getTimezone = (): string => {
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const formatInTimezone = (date: string | Date, formatType = 'P') => {
	const timezone = getTimezone()
	return formatInTimeZone(new Date(date), timezone, formatType, {
		locale:
			locales[i18next.language as keyof typeof locales] ||
			locales[DEFAULT_LANGUAGE.code]
	})
}
