import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * A customizable textarea component with consistent styling.
 *
 * This component extends the native HTML textarea with consistent styling and
 * behavior that matches the design system. It supports all standard HTML textarea
 * attributes and provides custom styling for different states like focus and validation.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Textarea placeholder="Enter description..." />
 *
 * @example
 * // With validation state
 * <Textarea
 *   aria-invalid={hasError}
 *   placeholder="Enter message"
 * />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML textarea attributes are supported
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-foreground`: Text color
 * - `--color-muted-foreground`: Placeholder color
 * - `--color-background`: Textarea background
 * - `--color-border`: Border color
 * - `--color-ring`: Focus ring color
 * - `--color-destructive`: Error state color
 * - `--color-destructive-faded`: Error state background
 */
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			className={cn(
				'min-h-11 w-full rounded-lg border bg-background px-3 py-2 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
				'focus-visible:ring-[1px] focus-visible:ring-ring',
				'aria-invalid:border-destructive aria-invalid:bg-destructive-faded',
				className
			)}
			data-slot='textarea'
			{...props}
		/>
	)
}

export { Textarea }
