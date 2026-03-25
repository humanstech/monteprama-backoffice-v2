/**
 * Duplicate Translation Strings Checker
 *
 * This script scans all translation strings in a locale and identifies duplicates.
 * It helps maintain DRY principles by surfacing strings that could be centralized
 * in the common namespace.
 *
 * Usage: node scripts/i18n/check-duplicates.js [locale]
 *        Default locale is 'en' if not specified
 *
 * Logging rules:
 *   - WARN: Any duplicate string (2+ occurrences)
 *
 * Note: Duplicates are generally not allowed. They are only acceptable when
 * strings have different semantic meanings (e.g., "Nome" meaning "name" of
 * something vs "first name" of a person - these translate differently in
 * other languages).
 *
 * Exit codes:
 *   0 - Script completed (warnings don't cause failure)
 */

import fs from 'node:fs'
import path from 'node:path'
import {
	DEFAULT_LOCALE,
	extractStrings,
	getJsonFiles,
	getNamespace,
	loadJsonFile,
	printSeparator,
	TRANSLATIONS_DIR,
	truncateString
} from './utils.js'

/**
 * Extracts locale from a file path or returns the input if it's already a locale name
 * @param {string} input - Either a locale name (e.g., "en") or a file path (e.g., "src/translations/en/common.json")
 * @returns {string} - The locale name
 */
function extractLocaleFromInput(input) {
	// Check if the argument is a file path (contains path separators)
	if (input.includes(path.sep) || input.includes('/')) {
		// Extract locale from path like "src/translations/en/common.json" -> "en"
		const normalizedPath = input.replace(/\\/g, '/')
		const pathParts = normalizedPath.split('/')
		const translationsIndex = pathParts.indexOf('translations')
		if (
			translationsIndex !== -1 &&
			pathParts.length > translationsIndex + 1
		) {
			return pathParts[translationsIndex + 1]
		}
	}
	return input
}

function checkDuplicateStrings() {
	// Allow specifying locale via command line argument
	// If a file path is provided (e.g., from lint-staged), extract the locale from it
	const locale = extractLocaleFromInput(process.argv[2] || DEFAULT_LOCALE)

	console.log(`🔍 Checking for duplicate strings in locale: ${locale}\n`)

	const localeDir = path.join(TRANSLATIONS_DIR, locale)

	if (!fs.existsSync(localeDir)) {
		console.error(`❌ Error: Locale folder "${locale}" not found`)
		process.exit(1)
	}

	const files = getJsonFiles(localeDir)

	if (files.length === 0) {
		console.log('ℹ️  No JSON files found')
		process.exit(0)
	}

	// Collect all strings with their locations
	// Map: string value -> Array of {namespace, key}
	const stringLocations = new Map()

	for (const file of files) {
		const namespace = getNamespace(file)
		const filePath = path.join(localeDir, file)
		const data = loadJsonFile(filePath)

		if (!data) {
			console.warn(`⚠️  Could not load file: ${file}`)
			continue
		}

		const strings = extractStrings(data)

		for (const { key, value } of strings) {
			if (!stringLocations.has(value)) {
				stringLocations.set(value, [])
			}
			stringLocations.get(value).push({ namespace, key })
		}
	}

	console.log(
		`📊 Analyzed ${files.length} file(s), ${stringLocations.size} unique string(s)\n`
	)

	let warnCount = 0

	// Check for duplicates
	for (const [value, locations] of stringLocations) {
		if (locations.length > 1) {
			warnCount++
			console.warn(`⚠️  WARN: String duplicated ${locations.length} times`)
			console.warn(`   Value: "${truncateString(value, 60)}"`)
			console.warn('   Locations:')
			for (const loc of locations) {
				console.warn(`     - ${loc.namespace}:${loc.key}`)
			}
			console.warn('')
		}
	}

	// Summary
	printSeparator()
	console.log('')
	console.log('📋 Summary:')
	console.log(`   Warnings: ${warnCount}`)
	console.log('')

	if (warnCount > 0) {
		console.log(
			'💡 Tip: Consider consolidating duplicated strings into the common namespace.\n'
		)
	} else {
		console.log('✅ No duplicate strings found!\n')
	}

	process.exit(0)
}

checkDuplicateStrings()
