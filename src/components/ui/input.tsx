import React from 'react'

import { cn } from '@/helpers/utils'

/**
 * Base input component with custom Tailwind styling.
 *
 * This is an internal component that provides the core styling and behavior for inputs.
 * It should not be used directly - use the `Input` component instead which provides
 * additional layout features like slots.
 *
 * @internal
 * @component
 *
 * @example
 * // Internal usage only
 * <_Input
 *   type="text"
 *   className="custom-class"
 *   placeholder="Enter text..."
 * />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.type - HTML input type attribute
 * @param props.props - All other standard HTML input attributes
 */
function _Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			className={cn(
				'flex h-11 w-full min-w-0 rounded-lg border bg-background px-3 py-1 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-8.5 file:border-0 file:bg-background file:font-medium file:text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
				'focus-visible:ring-[1px] focus-visible:ring-ring',
				'aria-invalid:border-destructive aria-invalid:bg-destructive-faded',
				className
			)}
			data-slot='input'
			type={type}
			{...props}
		/>
	)
}

interface InputProps extends React.ComponentProps<'input'> {
	/** Content to render in the left side of the input (e.g. icon) */
	startSlot?: React.ReactNode
	/** Content to render in the right side of the input (e.g. action button) */
	endSlot?: React.ReactNode
}

/**
 * A customizable input component with support for start and end slots.
 *
 * This component extends the native HTML input with consistent styling and
 * additional features like the ability to add icons or other elements
 * at the start or end of the input.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Input placeholder="Search..." />
 *
 * @example
 * // With start and end slots
 * import { Search, X } from "@/components/ui/icons"
 *
 * <Input
 *   placeholder="Search..."
 *   startSlot={<Search className="size-4" />}
 *   endSlot={<X className="size-4 cursor-pointer" onClick={handleClear} />}
 * />
 *
 * @example
 * // With validation state
 * <Input
 *   aria-invalid={hasError}
 *   placeholder="Email"
 *   type="email"
 * />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the wrapper div
 * @param props.startSlot - Optional element to render inside the input on the left
 * @param props.endSlot - Optional element to render inside the input on the right
 * @param props.props - All other standard HTML input attributes are supported
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-foreground`: Text color
 * - `--color-muted-foreground`: Placeholder and slot icon color
 * - `--color-background`: Input background
 * - `--color-border`: Border color
 * - `--color-ring`: Focus ring color
 * - `--color-destructive`: Error state color
 * - `--color-destructive-faded`: Error state background
 */
function Input({ className, startSlot, endSlot, ...props }: InputProps) {
	const [startSlotRef, setStartSlotRef] =
		React.useState<HTMLDivElement | null>(null)
	const [endSlotRef, setEndSlotRef] = React.useState<HTMLDivElement | null>(
		null
	)

	return (
		<div className={cn('relative flex items-center', className)}>
			{!!startSlot && (
				<div
					className='absolute left-3 text-muted-foreground'
					ref={setStartSlotRef}
				>
					{startSlot}
				</div>
			)}
			<_Input
				style={{
					//12 is the default padding of the input, 4 is the gap between the slot and the text
					paddingLeft: startSlot
						? `${12 + (startSlotRef?.offsetWidth ?? 0) + 4}px`
						: undefined,
					paddingRight: endSlot
						? `${12 + (endSlotRef?.offsetWidth ?? 0) + 4}px`
						: undefined
				}}
				{...props}
			/>
			{!!endSlot && (
				<div
					className='absolute right-3 text-muted-foreground'
					ref={setEndSlotRef}
				>
					{endSlot}
				</div>
			)}
		</div>
	)
}

export { Input }
