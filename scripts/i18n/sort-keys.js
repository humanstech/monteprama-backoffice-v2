/**
 * Translation Keys Sorter
 *
 * This script sorts all keys and subkeys alphabetically in translation JSON files.
 * It processes all locale folders and their JSON files, ensuring consistent key ordering.
 *
 * Usage: node scripts/i18n/sort-keys.js
 *
 * Exit codes:
 *   0 - All files processed successfully (with or without changes)
 *   1 - Error occurred during processing
 */

import path from 'node:path'
import {
	getJsonFiles,
	getLocaleFolders,
	isDeepEqual,
	loadJsonFile,
	printSeparator,
	sortObjectKeys,
	TRANSLATIONS_DIR,
	writeJsonFile
} from './utils.js'

function sortTranslationKeys() {
	console.log('🔤 Sorting translation keys alphabetically...\n')

	const locales = getLocaleFolders()

	if (locales.length === 0) {
		console.error('❌ Error: No locale folders found')
		process.exit(1)
	}

	let filesProcessed = 0
	let filesModified = 0
	let errors = 0

	for (const locale of locales) {
		const localeDir = path.join(TRANSLATIONS_DIR, locale)
		const files = getJsonFiles(localeDir)

		console.log(`📁 Processing locale: ${locale}`)

		for (const file of files) {
			const filePath = path.join(localeDir, file)
			const data = loadJsonFile(filePath)

			if (data === null) {
				console.log(`   ❌ [${file}] Failed to load`)
				errors++
				continue
			}

			const sortedData = sortObjectKeys(data)
			filesProcessed++

			if (isDeepEqual(data, sortedData)) {
				console.log(`   ✅ [${file}] Already sorted`)
			} else {
				writeJsonFile(filePath, sortedData)
				console.log(`   ✏️  [${file}] Keys sorted`)
				filesModified++
			}
		}
	}

	printSeparator()
	console.log('')
	console.log('📋 Summary:')
	console.log(`   Files processed: ${filesProcessed}`)
	console.log(`   Files modified: ${filesModified}`)
	if (errors > 0) {
		console.log(`   Errors: ${errors}`)
	}
	console.log('')

	if (errors > 0) {
		console.error('❌ Translation key sorting completed with errors\n')
		process.exit(1)
	}

	if (filesModified > 0) {
		console.log(
			'✅ Translation key sorting COMPLETE - Files have been updated\n'
		)
	} else {
		console.log(
			'✅ Translation key sorting COMPLETE - All files already sorted\n'
		)
	}

	process.exit(0)
}

sortTranslationKeys()
