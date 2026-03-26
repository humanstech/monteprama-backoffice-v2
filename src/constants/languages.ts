export const LANGUAGES = {
	Italiano: 'it-IT',
	Inglese: 'en-US',
	Francese: 'fr-FR',
	Spagnolo: 'es-ES',
	Tedesco: 'de-DE',
	Portoghese: 'pt-BR',
	Giapponese: 'ja-JP',
	Cinese: 'zh-CN',
	Russo: 'ru-RU',
	Olandese: 'nl-NL',
	Arabo: 'ar-SA'
} as const

export type LanguageLabel = keyof typeof LANGUAGES
export type LanguageCode = (typeof LANGUAGES)[LanguageLabel]

export const LANGUAGE_CODE_TO_LABEL = Object.fromEntries(
	Object.entries(LANGUAGES).map(([label, code]) => [code, label])
) as Record<LanguageCode, LanguageLabel>
