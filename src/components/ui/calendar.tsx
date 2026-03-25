import type * as React from 'react'
import { type ChevronProps, DayPicker } from 'react-day-picker'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/helpers/utils'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

const ChevronComponent = (props: ChevronProps) => {
	if (props.orientation === 'left') {
		return <ChevronLeftIcon className={cn('size-4', props.className)} />
	}
	return <ChevronRightIcon className={cn('size-4', props.className)} />
}

/**
 * A customizable calendar component built on top of `DayPicker` with extended styling and functionality.
 *
 * This component provides a styled calendar with support for various customization options, including
 * custom class names, navigation buttons, and day selection modes (e.g., single, multiple, range).
 *
 * @component
 *
 * @example
 * // Basic usage with default settings
 * <Calendar />
 *
 * @example
 * // Controlled calendar
 * <Calendar mode='single' selected={date} onSelect={setDate} />
 *
 * @example
 * // Customizing class names
 * <Calendar className="p-4 border-2" classNames={{ day: "size-10" }} />
 *
 * @example
 * // Using range selection mode
 * <Calendar mode="range" />
 *
 * @example
 * // Custom navigation icons
 * <Calendar
 *   components={{
 *     IconLeft: ({ className }) => <CustomLeftIcon className={className} />,
 *     IconRight: ({ className }) => <CustomRightIcon className={className} />,
 *   }}
 * />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the calendar container
 * @param props.classNames - Custom class names for specific parts of the calendar (e.g., days, navigation buttons)
 * @param props.showOutsideDays - Whether to show days from the previous/next month in the current month's view (default: true)
 * @param props.mode - The selection mode for the calendar (e.g., 'single', 'multiple', 'range')
 * @param props.selected - The currently selected date(s) in the calendar
 * @param props.onSelect - Callback function triggered when a date is selected
 * @param props.components - Custom components for specific parts of the calendar (e.g., navigation icons)
 * @param props.props - All other props supported by the `DayPicker` component
 */
function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			className={cn('rounded-md border p-3 shadow-sm', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row gap-4',
				month: 'flex flex-col gap-4',
				caption:
					'flex justify-center pt-1 relative items-center w-full',
				caption_label: 'text-sm font-medium',
				nav: 'flex items-center gap-1',
				nav_button: cn(
					buttonVariants({ variant: 'outline' }),
					'size-7 border-border bg-transparent p-0'
				),
				nav_button_previous: 'absolute left-1',
				nav_button_next: 'absolute right-1',
				table: 'w-full border-collapse space-x-1',
				head_row: 'flex',
				head_cell:
					'text-muted-foreground rounded-md w-8 font-normal text-sm',
				row: 'flex w-full mt-2',
				cell: cn(
					'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
					props.mode === 'range'
						? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
						: '[&:has([aria-selected])]:rounded-md'
				),
				day: cn(
					buttonVariants({ variant: 'ghost' }),
					'size-8 p-0 font-normal aria-selected:opacity-100'
				),
				day_range_start: 'day-range-start',
				day_range_end: 'day-range-end',
				day_selected:
					'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground',
				day_today: 'bg-accent text-accent-foreground',
				day_outside: 'day-outside text-muted-foreground',
				day_disabled:
					'cursor-not-allowed text-muted-foreground opacity-50',
				day_range_middle:
					'aria-selected:!bg-accent aria-selected:!text-accent-foreground',
				day_hidden: 'invisible',
				...classNames
			}}
			components={{
				Chevron: ChevronComponent
			}}
			showOutsideDays={showOutsideDays}
			{...props}
		/>
	)
}

export { Calendar }
