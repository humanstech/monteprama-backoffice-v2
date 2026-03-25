import { Progress as ProgressPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * A customizable progress bar component with consistent styling.
 *
 * This component extends the Radix UI Progress primitive with consistent styling and
 * behavior that matches the design system. It provides a visual indicator of progress
 * for operations like file uploads, form completion, or any other process that can be
 * measured as a percentage.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Progress value={75} />
 *
 * @example
 * // With custom styling
 * <Progress
 *   value={50}
 *   className="h-4 bg-red-500"
 * />
 *
 * @example
 * // Different height variations
 * <Progress value={60} className="h-0.5" /> // Small
 * <Progress value={60} className="h-1" />   // Medium
 * <Progress value={60} className="h-1.5" /> // Large
 *
 * @example
 * // Stepped progress
 * <div className="flex gap-1 [&>div:not(:first-child)]:rounded-l-none [&>div:not(:last-child)]:rounded-r-none">
 *   {progresses.map((value, index) => (
 *     <Progress key={index} value={value} className="h-0.5" />
 *   ))}
 * </div>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.value - The current progress value (0-100)
 * @param props.props - All other standard Radix UI Progress attributes are supported
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-accent`: Background color of the progress track
 * - `--color-primary`: Color of the progress indicator
 */
function Progress({
	className,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	return (
		<ProgressPrimitive.Root
			className={cn(
				'relative h-2 w-full overflow-hidden rounded-full bg-accent',
				className
			)}
			data-slot='progress'
			{...props}
		>
			<ProgressPrimitive.Indicator
				className='h-full w-full flex-1 bg-primary transition-all'
				data-slot='progress-indicator'
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	)
}

export { Progress }
