import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'
import { CheckIcon } from './icons'

/**
 * A customizable checkbox component based on Radix UI Checkbox.
 *
 * This component provides a consistent, accessible checkbox experience with
 * customizable styling that works with your design system.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Checkbox />
 *
 * @example
 * // With label (using a form library or manual implementation)
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <label htmlFor="terms">Accept terms and conditions</label>
 * </div>
 *
 * @example
 * // With checked state
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 *
 * @example
 * // With validation state
 * <Checkbox aria-invalid={hasError} />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard checkbox attributes from Radix UI Checkbox
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-primary`: Checked background color
 * - `--color-primary-foreground`: Check icon color when checked
 * - `--color-ring`: Focus ring color
 * - `--color-destructive`: Error state color
 * - `--color-input`: Background color in dark mode
 */
function Checkbox({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				'peer size-5 shrink-0 cursor-pointer rounded-md border shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
				className
			)}
			data-slot='checkbox'
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className='flex items-center justify-center text-current transition-none'
				data-slot='checkbox-indicator'
			>
				<CheckIcon className='size-5' />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

export { Checkbox }
