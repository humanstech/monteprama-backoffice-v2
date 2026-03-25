/**
 * Missing Translations Generator
 *
 * This script generates missing translation files for each non-default locale.
 * It compares each locale against the default language and outputs files to
 * `src/translations/missing/{locale}.{namespace}.json`.
 *
 * Usage: node scripts/i18n/generate-missing.js
 *
 * Output files are gitignored and should not be committed.
 * They serve as a reference for translators to know what needs translation.
 *
 * Exit codes:
 *   0 - Always exits successfully (informational script)
 */

import fs from 'node:fs'
import path from 'node:path'
import {
	buildNestedObject,
	DEFAULT_LOCALE,
	extractKeysWithValues,
	getJsonFiles,
	getLocaleFolders,
	getNamespace,
	loadJsonFile,
	printSeparator,
	TRANSLATIONS_DIR
} from './utils.js'

const MISSING_DIR = path.join(TRANSLATIONS_DIR, 'missing')

function ensureMissingDir() {
	if (!fs.existsSync(MISSING_DIR)) {
		fs.mkdirSync(MISSING_DIR, { recursive: true })
	}
}

function findMissingKeys(defaultKeys, localeKeys) {
	const missingKeys = new Map()
	for (const [key, value] of defaultKeys) {
		if (!localeKeys.has(key)) {
			missingKeys.set(key, value)
		}
	}
	return missingKeys
}

function handleMissingKeys(missingKeys, missingFilePath, namespace, locale) {
	const missingData = buildNestedObject(missingKeys)
	const content = `${JSON.stringify(missingData, null, '\t')}\n`
	fs.writeFileSync(missingFilePath, content, 'utf-8')
	console.log(
		`   📝 [${namespace}] ${missingKeys.size} missing → ${locale}.${namespace}.json`
	)
}

function handleCompleteNamespace(missingFilePath, namespace, locale) {
	if (fs.existsSync(missingFilePath)) {
		fs.unlinkSync(missingFilePath)
		console.log(
			`   🗑️  [${namespace}] Complete → removed ${locale}.${namespace}.json`
		)
		return true
	}
	console.log(`   ✅ [${namespace}] Complete`)
	return false
}

function processNamespaceFile(
	file,
	defaultLocaleDir,
	localeDir,
	locale,
	stats
) {
	const namespace = getNamespace(file)
	const defaultFilePath = path.join(defaultLocaleDir, file)
	const localeFilePath = path.join(localeDir, file)
	const missingFilePath = path.join(
		MISSING_DIR,
		`${locale}.${namespace}.json`
	)

	const defaultData = loadJsonFile(defaultFilePath)
	const localeData = loadJsonFile(localeFilePath)

	if (!defaultData) {
		console.log(`   ⚠️  [${namespace}] Could not load default file`)
		return
	}

	const defaultKeys = extractKeysWithValues(defaultData)
	const localeKeys = localeData
		? extractKeysWithValues(localeData)
		: new Map()

	const missingKeys = findMissingKeys(defaultKeys, localeKeys)

	if (missingKeys.size > 0) {
		handleMissingKeys(missingKeys, missingFilePath, namespace, locale)
		stats.totalMissing += missingKeys.size
		stats.filesGenerated++
	} else {
		const wasRemoved = handleCompleteNamespace(
			missingFilePath,
			namespace,
			locale
		)
		if (wasRemoved) {
			stats.filesRemoved++
		}
	}
}

function printLocaleSummary(stats) {
	if (stats.totalMissing > 0) {
		console.log(
			`\n   📊 Total: ${stats.totalMissing} missing keys in ${stats.filesGenerated} file(s)`
		)
	} else {
		console.log('\n   ✅ No missing translations')
	}
	if (stats.filesRemoved > 0) {
		console.log(
			`   🗑️  Removed ${stats.filesRemoved} file(s) (now complete)`
		)
	}
}

function processLocale(locale, defaultLocaleDir, defaultFiles) {
	console.log(`\n🌍 Processing locale: ${locale}`)

	const localeDir = path.join(TRANSLATIONS_DIR, locale)
	const stats = {
		totalMissing: 0,
		filesGenerated: 0,
		filesRemoved: 0
	}

	for (const file of defaultFiles) {
		processNamespaceFile(file, defaultLocaleDir, localeDir, locale, stats)
	}

	printLocaleSummary(stats)
}

function validateAndGetLocales() {
	const locales = getLocaleFolders()

	if (!locales.includes(DEFAULT_LOCALE)) {
		console.error(`❌ Error: Default locale '${DEFAULT_LOCALE}' not found`)
		process.exit(1)
	}

	const otherLocales = locales.filter((l) => l !== DEFAULT_LOCALE)

	if (otherLocales.length === 0) {
		console.log('ℹ️  No other locales to compare against')
		process.exit(0)
	}

	return otherLocales
}

function generateMissingTranslations() {
	console.log('🔍 Generating missing translations...\n')

	const otherLocales = validateAndGetLocales()

	const defaultLocaleDir = path.join(TRANSLATIONS_DIR, DEFAULT_LOCALE)
	const defaultFiles = getJsonFiles(defaultLocaleDir, {
		excludeMissing: true
	})

	console.log(`📁 Default locale: ${DEFAULT_LOCALE}`)
	console.log(`📄 Namespace files: ${defaultFiles.join(', ')}\n`)

	ensureMissingDir()

	for (const locale of otherLocales) {
		processLocale(locale, defaultLocaleDir, defaultFiles)
	}

	printSeparator()
	console.log('\n✅ Missing translations generation complete')
	console.log('📂 Output directory: src/translations/missing/\n')
	process.exit(0)
}

generateMissingTranslations()
