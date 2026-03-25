/**
 * Shared utilities and constants for i18n scripts
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/*
 * Constants
 */

export const TRANSLATIONS_DIR = path.join(__dirname, '../../src/translations')
export const DEFAULT_LOCALE = 'en'
export const COMMON_NAMESPACE = 'common'

/*
 * File System Utilities
 */

/**
 * Loads a JSON file and returns its contents
 * @param {string} filePath - Path to the JSON file
 * @returns {object|null} - Parsed JSON object or null if error
 */
export function loadJsonFile(filePath) {
	if (!fs.existsSync(filePath)) {
		return null
	}

	try {
		const content = fs.readFileSync(filePath, 'utf-8')
		return JSON.parse(content)
	} catch (error) {
		console.error(`Error parsing JSON file: ${filePath}`)
		console.error(error.message)
		return null
	}
}

/**
 * Writes an object to a JSON file with consistent formatting
 * @param {string} filePath - Path to the JSON file
 * @param {object} data - The data to write
 */
export function writeJsonFile(filePath, data) {
	const content = `${JSON.stringify(data, null, '\t')}\n`
	fs.writeFileSync(filePath, content, 'utf-8')
}

/**
 * Gets all JSON files in a locale directory
 * @param {string} localeDir - Path to the locale directory
 * @param {object} options - Options
 * @param {boolean} options.excludeMissing - Exclude missing.*.json files (default: false, legacy support)
 * @returns {string[]} - Array of JSON filenames
 */
export function getJsonFiles(localeDir, { excludeMissing = false } = {}) {
	if (!fs.existsSync(localeDir)) {
		return []
	}

	return fs
		.readdirSync(localeDir)
		.filter((file) => {
			if (!file.endsWith('.json')) {
				return false
			}
			if (excludeMissing && file.startsWith('missing.')) {
				return false
			}
			return true
		})
		.sort()
}

/**
 * Gets all locale directories (excludes 'missing' folder)
 * @returns {string[]} - Array of locale folder names
 */
export function getLocaleFolders() {
	return fs
		.readdirSync(TRANSLATIONS_DIR)
		.filter((item) => {
			if (item === 'missing') {
				return false
			}
			const itemPath = path.join(TRANSLATIONS_DIR, item)
			return fs.statSync(itemPath).isDirectory()
		})
		.sort()
}

/**
 * Gets the namespace name from a filename
 * @param {string} filename - The JSON filename
 * @returns {string} - The namespace name
 */
export function getNamespace(filename) {
	return filename.replace('.json', '')
}

/*
 * Object Utilities
 */

/**
 * Recursively sorts an object's keys alphabetically
 * @param {object} obj - The object to sort
 * @returns {object} - A new object with sorted keys
 */
export function sortObjectKeys(obj) {
	if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
		return obj
	}

	const sortedKeys = Object.keys(obj).sort((a, b) => a.localeCompare(b))
	const sortedObj = {}

	for (const key of sortedKeys) {
		sortedObj[key] = sortObjectKeys(obj[key])
	}

	return sortedObj
}

/**
 * Checks if two objects are deeply equal (same keys in same order, same values)
 * @param {object} obj1 - First object
 * @param {object} obj2 - Second object
 * @returns {boolean} - True if objects are identical
 */
export function isDeepEqual(obj1, obj2) {
	return JSON.stringify(obj1) === JSON.stringify(obj2)
}

/**
 * Recursively extracts all string values from a nested object
 * @param {object} obj - The object to extract values from
 * @param {string} prefix - Current key prefix for nested keys
 * @returns {Array<{key: string, value: string}>} - Array of key-value pairs
 */
export function extractStrings(obj, prefix = '') {
	const strings = []

	for (const key of Object.keys(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key
		const value = obj[key]

		if (
			value !== null &&
			typeof value === 'object' &&
			!Array.isArray(value)
		) {
			strings.push(...extractStrings(value, fullKey))
		} else if (typeof value === 'string') {
			strings.push({ key: fullKey, value })
		}
	}

	return strings
}

/**
 * Recursively extracts all keys and values from a nested object
 * @param {object} obj - The object to extract from
 * @param {string} prefix - Current key prefix for nested keys
 * @returns {Map<string, string>} - Map of dot-separated key paths to values
 */
export function extractKeysWithValues(obj, prefix = '') {
	const result = new Map()

	for (const key of Object.keys(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key
		const value = obj[key]

		if (
			value !== null &&
			typeof value === 'object' &&
			!Array.isArray(value)
		) {
			for (const [nestedKey, nestedValue] of extractKeysWithValues(
				value,
				fullKey
			)) {
				result.set(nestedKey, nestedValue)
			}
		} else {
			result.set(fullKey, value)
		}
	}

	return result
}

/**
 * Builds a nested object from a flat key-value map
 * @param {Map<string, string>} flatMap - Map of dot-separated keys to values
 * @returns {object} - Nested object structure
 */
export function buildNestedObject(flatMap) {
	const result = {}

	for (const [key, value] of flatMap) {
		const parts = key.split('.')
		let current = result

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i]
			if (!(part in current)) {
				current[part] = {}
			}
			current = current[part]
		}

		current[parts.at(-1)] = value
	}

	return result
}

/*
 * String Utilities
 */

/**
 * Truncates a string to a maximum length
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string with ellipsis if needed
 */
export function truncateString(str, maxLength) {
	if (str.length <= maxLength) {
		return str
	}
	return `${str.substring(0, maxLength - 3)}...`
}

/*
 * Console Utilities
 */

/**
 * Prints a horizontal separator line
 * @param {number} length - Length of the separator (default: 60)
 */
export function printSeparator(length = 60) {
	console.log(`\n${'─'.repeat(length)}`)
}
