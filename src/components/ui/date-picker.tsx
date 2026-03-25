import { addDays } from 'date-fns'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { formatLocaleDate } from '@/dates'
import { cn, objectKeys } from '@/helpers/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useTranslation } from '@/translations/i18n'
import { CalendarIcon } from './icons'

const DIGIT_REGEX = /\d/

function isDateRange(value: unknown): value is DateRange {
	return (
		typeof value === 'object' &&
		value !== null &&
		'from' in value &&
		'to' in value
	)
}

function getDateRange(offset: number): DateRange {
	const to = new Date()
	let from: Date

	if (offset === -1) {
		// Yesterday
		from = addDays(to, -1)
		to.setDate(from.getDate())
	} else if (offset === -30) {
		// Last month
		from = new Date(to.getFullYear(), to.getMonth() - 1, 1)
		to.setDate(0) // Last day of the previous month
	} else if (offset === -7) {
		// Last week
		const dayOfWeek = to.getDay()
		to.setDate(to.getDate() - dayOfWeek) // Last Sunday
		from = new Date(to)
		from.setDate(from.getDate() - 6) // Monday of last week
	} else if (offset === -365) {
		// Last year
		from = new Date(to.getFullYear() - 1, 0, 1) // January 1st of last year
		to.setFullYear(to.getFullYear() - 1, 11, 31) // December 31st of last year
	} else {
		// Default behavior
		from = addDays(to, offset)
	}

	return { from, to }
}

const presetsMap = {
	'ui:date_picker.preset_today': 0,
	'ui:date_picker.preset_yesterday': -1,
	'ui:date_picker.preset_last_week': -7,
	'ui:date_picker.preset_last_month': -30,
	'ui:date_picker.preset_last_year': -365
} as const satisfies Record<string, number>

const presets = objectKeys(presetsMap)

interface DatePickerProps {
	selected?: Date | DateRange
	onChange?: (value?: Date | DateRange) => void
	mode?: 'single' | 'range' | 'single-input' | 'range-input'
	showPresets?: boolean
	className?: string
	placeholder?: string
	disabled?: boolean
	numberOfMonths?: number
}

interface CalendarComponentProps {
	className?: string
	currentSelected: Date | DateRange | undefined
	handleChange: (value: Date | DateRange | undefined) => void
	isDesktop: boolean
	numberOfMonths?: number
}

const SingleCalendar = ({
	className,
	currentSelected,
	handleChange,
	isDesktop,
	numberOfMonths
}: CalendarComponentProps) => {
	const dateSelected = currentSelected as Date
	return (
		<Calendar
			className={cn('border-none', className)}
			defaultMonth={dateSelected}
			initialFocus
			mode='single'
			numberOfMonths={isDesktop ? (numberOfMonths ?? 1) : 1}
			onSelect={handleChange}
			selected={dateSelected}
		/>
	)
}

const RangeCalendar = ({
	className,
	currentSelected,
	handleChange,
	isDesktop,
	numberOfMonths
}: CalendarComponentProps) => {
	const rangeSelected = currentSelected as DateRange
	return (
		<Calendar
			className={cn('border-none', className)}
			defaultMonth={rangeSelected?.from}
			initialFocus
			mode='range'
			numberOfMonths={isDesktop ? (numberOfMonths ?? 2) : 1}
			onSelect={handleChange}
			selected={rangeSelected}
		/>
	)
}

/**
 * A versatile date picker component supporting both single-date and date-range selection modes,
 * with optional preset date selections.
 *
 * This component provides a popover-triggered calendar interface for selecting dates.
 * It supports controlled and uncontrolled usage, localization, and is styled with Tailwind CSS.
 * Depending on the `presetsType` prop, the presets are shown either in a dropdown, a sidebar list, or not at all.
 *
 * @component
 *
 * @example
 * // Single date selection with no presets
 * <DatePicker
 *   selected={date}
 *   onChange={setDate}
 *   mode="single"
 *   placeholder="Select a date"
 * />
 *
 * @example
 * // Date range selection
 * <DatePicker
 *   selected={dateRange}
 *   onChange={setDateRange}
 *   mode="range"
 *   placeholder="Select a date range"
 * />
 *
 * @example
 * // Single date with dropdown presets
 * <DatePicker
 *   selected={date}
 *   onChange={setDate}
 *   mode="single"
 *   presetsType="dropdown"
 *   placeholder="Select a date"
 * />
 *
 * @example
 * // Single date with sidebar list presets
 * <DatePicker
 *   selected={date}
 *   onChange={setDate}
 *   mode="single"
 *   presetsType="list"
 *   placeholder="Select a date"
 * />
 *
 * @param props - Component props
 * @param props.selected - The currently selected date or date range
 * @param props.onChange - Callback fired when a date or date range is selected
 * @param props.mode - Selection mode, either 'single' or 'range' (default: 'single')
 * @param props.presetsType - Preset display type: 'dropdown', or 'list'
 * @param props.className - Additional CSS classes for the trigger button
 * @param props.placeholder - Placeholder text shown when no date is selected
 * @param props.disabled - Whether the date picker is disabled
 */
export function DatePicker({
	selected,
	onChange,
	mode = 'single',
	showPresets,
	className,
	placeholder,
	disabled,
	numberOfMonths
}: DatePickerProps) {
	const { t } = useTranslation()
	const isDesktop = useMediaQuery({ breakpoint: 'sm' })
	const [internalValue, setInternalValue] = useState<
		Date | DateRange | undefined
	>(selected)
	const [inputValue, setInputValue] = useState('')
	const isInput = mode === 'single-input' || mode === 'range-input'

	const handleChange = (value: Date | DateRange | undefined) => {
		setInternalValue(value)
		onChange?.(value)

		const format = (date: Date) => {
			const day = String(date.getDate()).padStart(2, '0')
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const year = date.getFullYear()
			return `${day}/${month}/${year}`
		}

		if (isInput && value instanceof Date) {
			setInputValue(format(value))
		} else if (isInput && isDateRange(value)) {
			const fromStr = value.from ? format(value.from) : ''
			const toStr = value.to ? format(value.to) : ''
			setInputValue(toStr ? `${fromStr} - ${toStr}` : fromStr)
		}
	}

	const currentSelected = selected ?? internalValue

	const buttonLabel = (() => {
		const hasSelectedRange =
			mode === 'range' && isDateRange(currentSelected)
		const hasSelectedSingle =
			mode === 'single' && currentSelected instanceof Date

		if (hasSelectedRange) {
			const { from, to } = currentSelected
			if (from && to) {
				return `${formatLocaleDate(from)} - ${formatLocaleDate(to)}`
			}
			if (from) {
				return formatLocaleDate(from)
			}
			return placeholder ? <span>{placeholder}</span> : null
		}

		if (hasSelectedSingle) {
			return formatLocaleDate(currentSelected)
		}

		return placeholder ? <span>{placeholder}</span> : null
	})()

	// Helper: Normalize day value (1-31)
	const normalizeDay = (day: string): string => {
		if (+day > 31) {
			return '31'
		}
		if (day.length === 2 && +day < 1) {
			return '01'
		}
		return day
	}

	// Helper: Normalize month value (1-12)
	const normalizeMonth = (month: string): string => {
		if (+month > 12) {
			return '12'
		}
		if (month.length === 2 && +month < 1) {
			return '01'
		}
		return month
	}

	// Helper: Format day part of date
	const formatDay = (cleaned: string): string => {
		const day = normalizeDay(cleaned.substring(0, 2))
		if (cleaned.length >= 2) {
			return `${day}/`
		}
		return day
	}

	// Helper: Format month part of date
	const formatMonth = (cleaned: string): string => {
		const month = normalizeMonth(cleaned.substring(2, 4))
		if (cleaned.length >= 4) {
			return `${month}/`
		}
		return month
	}

	// Utility function to format a numeric string as a date (dd/mm/yyyy)
	const formatDatePart = (raw: string): string => {
		const cleaned = raw.replace(/[^\d]/g, '')
		let formatted = ''

		if (cleaned.length > 0) {
			formatted += formatDay(cleaned)
		}

		if (cleaned.length > 2) {
			formatted += formatMonth(cleaned)
		}

		if (cleaned.length > 4) {
			formatted += cleaned.substring(4, 8)
		}

		return formatted
	}

	// Convert a formatted string (dd/mm/yyyy) to a Date object
	const parseDate = (formatted: string): Date | undefined => {
		const parts = formatted.split('/')
		if (parts.length !== 3) {
			return undefined
		}

		const [dd, mm, yyyy] = parts.map(Number)
		if (!(dd && mm && yyyy) || yyyy < 1000) {
			return undefined
		}

		return new Date(yyyy, mm - 1, dd)
	}

	// Helper: Handle deletion in input
	const handleDeletion = (value: string): boolean => {
		if (value.length > 10 && value.length <= 13) {
			setInputValue(value.slice(0, 10))
		} else {
			setInputValue(value)
		}
		return true
	}

	// Helper: Auto-add dash separator for range input
	const addDashSeparator = (value: string): string => {
		const lastChar = value.at(-1)
		if (lastChar && DIGIT_REGEX.test(lastChar)) {
			return `${value.slice(0, -1)} - ${lastChar}`
		}
		return `${value} - `
	}

	// Helper: Handle range input formatting
	const handleRangeInput = (value: string, nextValue: string): void => {
		const [startRaw = '', endRaw = ''] = nextValue
			.split('-')
			.map((v) => v.trim())
		const cleanedStart = startRaw.replace(/[^\d]/g, '')
		const cleanedEnd = endRaw.replace(/[^\d]/g, '')

		if (cleanedStart.length > 8 && !value.includes('-')) {
			setInputValue(addDashSeparator(value))
			return
		}

		const formattedStart = formatDatePart(cleanedStart)
		const formattedEnd = cleanedEnd ? formatDatePart(cleanedEnd) : ''

		let displayValue = formattedStart
		if (value.includes('-') || cleanedStart.length === 8) {
			displayValue += ' - '
			if (cleanedEnd.length > 0) {
				displayValue += formattedEnd
			}
		}

		setInputValue(displayValue)

		const startDate =
			cleanedStart.length === 8 ? parseDate(formattedStart) : undefined
		const endDate =
			cleanedEnd.length === 8 ? parseDate(formattedEnd) : undefined

		if (startDate && endDate) {
			handleChange({ from: startDate, to: endDate })
		} else {
			handleChange(undefined)
		}
	}

	// Helper: Handle single date input formatting
	const handleSingleInput = (value: string): void => {
		const cleaned = value.replace(/[^\d]/g, '')
		const formatted = formatDatePart(cleaned)
		setInputValue(formatted)

		if (cleaned.length === 8) {
			const date = parseDate(formatted)
			handleChange(date)
		} else {
			handleChange(undefined)
		}
	}

	const handleInputChange = (value: string) => {
		const isDeleting = value.length < inputValue.length

		if (isDeleting) {
			handleDeletion(value)
			return
		}

		if (mode === 'range-input') {
			handleRangeInput(value, value)
		} else {
			handleSingleInput(value)
		}
	}

	return (
		<Popover>
			{isInput ? (
				<div
					className={cn(
						'flex min-h-9 w-fit min-w-[8rem] cursor-pointer items-center rounded-lg border border-border text-foreground text-sm',
						'hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent',
						className
					)}
				>
					<PopoverTrigger asChild>
						<div className='flex items-center border-border border-r p-2.5'>
							<CalendarIcon className='size-4' />
						</div>
					</PopoverTrigger>
					<input
						className='px-3 py-2 placeholder:text-muted-foreground focus:outline-none'
						onChange={(e) => handleInputChange(e.target.value)}
						placeholder={
							mode === 'single-input'
								? 'dd/mm/yyyy'
								: 'dd/mm/yyyy - dd/mm/yyyy'
						}
						type='text'
						value={inputValue}
					/>
				</div>
			) : (
				<PopoverTrigger asChild>
					<button
						className={cn(
							'flex min-h-9 w-fit min-w-[8rem] cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-foreground text-sm',
							'hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent',
							!currentSelected && 'text-muted-foreground',
							className
						)}
						disabled={disabled}
						type='button'
					>
						<CalendarIcon className='size-4' />
						{buttonLabel}
					</button>
				</PopoverTrigger>
			)}

			{!showPresets && (
				<PopoverContent
					align='start'
					className='w-auto p-0'
					collisionPadding={16}
				>
					{mode === 'single' || mode === 'single-input' ? (
						<SingleCalendar
							currentSelected={currentSelected}
							handleChange={handleChange}
							isDesktop={isDesktop}
							numberOfMonths={numberOfMonths}
						/>
					) : (
						<RangeCalendar
							currentSelected={currentSelected}
							handleChange={handleChange}
							isDesktop={isDesktop}
							numberOfMonths={numberOfMonths}
						/>
					)}
				</PopoverContent>
			)}

			{showPresets && !isInput && (
				<PopoverContent
					align='start'
					className={cn(
						'flex w-auto flex-col gap-2 p-2',
						'md:flex-row md:items-start md:gap-0 md:p-0'
					)}
					collisionPadding={16}
				>
					<div className='flex flex-col gap-4 md:hidden'>
						<Select
							onValueChange={(value) => {
								const offset = Number.parseInt(value, 10)
								if (mode === 'range') {
									handleChange(getDateRange(offset))
								} else {
									handleChange(addDays(new Date(), offset))
								}
							}}
						>
							<SelectTrigger className='w-full'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent position='popper'>
								{presets.map((preset) => (
									<SelectItem
										key={preset}
										value={`${presetsMap[preset]}`}
									>
										{t(preset)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='box-border hidden min-w-[150px] flex-col p-3 md:flex'>
						{presets.map((preset) => (
							<Button
								className='justify-start'
								key={preset}
								onClick={() => {
									const offset = presetsMap[preset]
									if (mode === 'range') {
										handleChange(getDateRange(offset))
									} else {
										handleChange(
											addDays(new Date(), offset)
										)
									}
								}}
								size='sm'
								variant='ghost'
							>
								{t(preset)}
							</Button>
						))}
					</div>

					<div
						className={cn(
							'rounded-none p-0 shadow-none',
							'md:border-border md:border-l'
						)}
					>
						{mode === 'single' ? (
							<SingleCalendar
								className='rounded-none shadow-none'
								currentSelected={currentSelected}
								handleChange={handleChange}
								isDesktop={isDesktop}
								numberOfMonths={numberOfMonths}
							/>
						) : (
							<RangeCalendar
								className='rounded-none shadow-none'
								currentSelected={currentSelected}
								handleChange={handleChange}
								isDesktop={isDesktop}
								numberOfMonths={numberOfMonths}
							/>
						)}
					</div>
				</PopoverContent>
			)}
		</Popover>
	)
}
