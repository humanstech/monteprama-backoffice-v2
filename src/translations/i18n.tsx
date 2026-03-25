import i18next, { type TOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {
	Trans as I18nTrans,
	useTranslation as i18nUseTranslation,
	initReactI18next,
	type TransProps
} from 'react-i18next'
import { objectKeys } from '@/helpers/utils'

// Import all namespace resources from each locale
import { en } from './en/en'
import { it } from './it/it'

/**
 * Resources type - maps language codes to their namespace resources
 */
const resources = {
	en,
	it
} as const

/**
 * Single source of truth for the default language code
 */
const DEFAULT_LANGUAGE_CODE = 'en' as const

type Resources = typeof resources
type DefaultLanguageResources = Resources[typeof DEFAULT_LANGUAGE_CODE]

/**
 * Supported app languages configuration
 */
export interface AppLanguage<Code extends keyof Resources = keyof Resources> {
	label: string
	code: Code
	json: Resources[Code]
}

export const DEFAULT_LANGUAGE = {
	label: 'English (EN)',
	code: DEFAULT_LANGUAGE_CODE,
	json: resources[DEFAULT_LANGUAGE_CODE]
} as const satisfies AppLanguage<typeof DEFAULT_LANGUAGE_CODE>

export const APP_LANGUAGES = [
	DEFAULT_LANGUAGE,
	{ label: 'Italiano (IT)', code: 'it', json: it }
] as const satisfies AppLanguage[]

/**
 * Available namespace names derived from the default language
 */
export type AppNamespace = keyof DefaultLanguageResources

/**
 * All available namespaces as an array
 */
export const APP_NAMESPACES = objectKeys(resources[DEFAULT_LANGUAGE_CODE])

/**
 * Default namespace used when none is specified
 */
export const DEFAULT_NAMESPACE: AppNamespace = 'common'

// Initialize i18next with namespace support
i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		ns: APP_NAMESPACES,
		defaultNS: DEFAULT_NAMESPACE,
		fallbackLng: DEFAULT_LANGUAGE.code,
		debug: false,
		react: {
			useSuspense: false
		},
		supportedLngs: APP_LANGUAGES.map((language) => language.code),
		interpolation: {
			escapeValue: false
		},
		detection: {
			order: ['localStorage', 'navigator'],
			lookupLocalStorage: 'i18nextLng'
		}
	})

export const changeAppLanguage = async (
	nextLanguage: (typeof APP_LANGUAGES)[number]['code']
) => {
	await i18next.changeLanguage(nextLanguage)
}

/*
 * Type utilities for extracting translation keys from namespaces
 */

/**
 * Pluralization suffixes used by i18next
 */
type PluralSuffix = 'zero' | 'one' | 'other'

/**
 * Gender suffixes for gendered translations
 */
type GenderSuffix = 'male' | 'female'

/**
 * All possible suffix combinations:
 * - _zero, _one, _other (plural only)
 * - _male, _female (gender only)
 * - _male_zero, _male_one, _male_other (gendered plural)
 * - _female_zero, _female_one, _female_other (gendered plural)
 */
type TranslationSuffix =
	| `_${GenderSuffix}_${PluralSuffix}`
	| `_${PluralSuffix}`
	| `_${GenderSuffix}`

/**
 * Removes translation suffixes from a key string
 */
type RemoveSuffix<S extends string> = S extends `${infer P}${TranslationSuffix}`
	? P
	: S

/**
 * Flattens nested object keys into dot-separated paths, recursing into each nested object individually
 */
type FlattenObjectKeys<T, Prefix extends string = ''> = {
	[K in keyof T & string]: T[K] extends Record<string, unknown>
		? FlattenObjectKeys<T[K], `${Prefix}${K}.`>
		: RemoveSuffix<`${Prefix}${K}`>
}[keyof T & string]

/**
 * Extract keys from a single namespace
 */
type NamespaceKeys<N extends AppNamespace> = FlattenObjectKeys<
	DefaultLanguageResources[N]
>

/**
 * All translation keys with namespace prefix (e.g., 'common:http_errors.default')
 */
export type TKey = {
	[N in AppNamespace]: `${N}:${NamespaceKeys<N>}`
}[AppNamespace]

/**
 * Type-safe useTranslation hook
 *
 * Returns a translation function that accepts namespaced keys.
 *
 * @returns Translation utilities with type-safe t function
 *
 * @example
 * const { t } = useTranslation()
 * t('common:http_errors.default')
 * t('ui:date_picker.preset_today')
 */
export const useTranslation = () => {
	const translation = i18nUseTranslation()

	return {
		...translation,
		t: translation.t as (key: TKey, options?: TOptions) => string
	}
}

/**
 * Type-safe Trans component for complex translations with JSX
 *
 * @example
 * <Trans i18nKey="common:welcome" values={{ name: 'John' }}>
 *   Welcome <strong>{{name}}</strong>!
 * </Trans>
 */
export const Trans = ({
	i18nKey,
	ns,
	...props
}: Omit<TransProps<string>, 'i18nKey' | 'ns'> & {
	i18nKey: TKey
	ns?: AppNamespace
}) => <I18nTrans {...props} i18nKey={i18nKey as string} ns={ns} />

/**
 * Type-safe i18n instance for direct translations outside of React components
 *
 * @example
 * import i18n from '@/translations/i18n'
 *
 * i18n.t('common:http_errors.default')
 */
const i18n = {
	...i18next,
	t: (key: TKey, options?: TOptions) => i18next.t(key, options)
}

export default i18n
