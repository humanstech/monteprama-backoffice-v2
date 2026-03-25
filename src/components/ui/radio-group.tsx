import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * Radio group component that provides accessible radio button functionality.
 *
 * This component creates a group container for radio items, allowing users
 * to select a single option from a set of choices.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1" id="option1" />
 *   <RadioGroupItem value="option2" id="option2" />
 * </RadioGroup>
 *
 * @example
 * // With labels
 * <RadioGroup defaultValue="option1">
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option1" id="option1" />
 *     <label htmlFor="option1">Option 1</label>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option2" id="option2" />
 *     <label htmlFor="option2">Option 2</label>
 *   </div>
 * </RadioGroup>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other props are passed to the underlying Radix UI RadioGroup
 */
function RadioGroup({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return (
		<RadioGroupPrimitive.Root
			className={cn('grid gap-2', className)}
			data-slot='radio-group'
			{...props}
		/>
	)
}

/**
 * Individual radio button item within a RadioGroup.
 *
 * This component represents a single selectable radio option that
 * must be used within a RadioGroup component.
 *
 * @component
 *
 * @example
 * // Basic usage (must be within a RadioGroup)
 * <RadioGroupItem value="option1" id="option1" />
 *
 * @example
 * // Disabled state
 * <RadioGroupItem value="option3" id="option3" disabled />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other props are passed to the underlying Radix UI RadioGroup.Item
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-primary`: Selected state color
 * - `--color-ring`: Focus ring color
 * - `--color-destructive`: Error state color
 * - `--color-input`: Background color in dark mode
 */
function RadioGroupItem({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
	return (
		<RadioGroupPrimitive.Item
			className={cn(
				'aspect-square size-5 shrink-0 cursor-pointer rounded-full border text-primary shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
				className
			)}
			data-slot='radio-group-item'
			{...props}
		>
			<RadioGroupPrimitive.Indicator
				className='relative flex items-center justify-center'
				data-slot='radio-group-indicator'
			>
				<div className='absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary' />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	)
}

export { RadioGroup, RadioGroupItem }
