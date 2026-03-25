import { Tooltip as TooltipPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * Provider component for tooltips with customizable delay duration.
 *
 * Wraps the Radix UI TooltipProvider to provide tooltip functionality
 * throughout the application.
 *
 * @component
 *
 * @example
 * <TooltipProvider delayDuration={200}>
 *   {children}
 * </TooltipProvider>
 *
 * @param props - Component props
 * @param props.delayDuration - Delay in milliseconds before showing tooltips (defaults to 0)
 * @param props.props - Other props passed to the underlying Radix UI provider
 */
function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-slot='tooltip-provider'
			delayDuration={delayDuration}
			{...props}
		/>
	)
}

/**
 * Root tooltip component that provides tooltip functionality.
 *
 * This component automatically wraps its children in a TooltipProvider
 * for convenience when using individual tooltips.
 *
 * @component
 *
 * @example
 * <Tooltip>
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipContent>Tooltip content</TooltipContent>
 * </Tooltip>
 *
 * @param props - Component props inherited from Radix UI TooltipRoot
 */
function Tooltip({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot='tooltip' {...props} />
		</TooltipProvider>
	)
}

/**
 * Trigger element that activates the tooltip when hovered or focused.
 *
 * Use this component to wrap the element that should trigger the tooltip.
 *
 * @component
 *
 * @example
 * <TooltipTrigger>
 *   <Button>Hover me</Button>
 * </TooltipTrigger>
 *
 * @param props - Component props inherited from Radix UI TooltipTrigger
 */
function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
}

/**
 * Content to display inside the tooltip with customizable styling.
 *
 * This component renders the actual tooltip content with animations
 * and positioning based on the trigger element.
 *
 * @component
 *
 * @example
 * <TooltipContent>
 *   This is the tooltip text that appears on hover
 * </TooltipContent>
 *
 * @example
 * <TooltipContent className="custom-class" sideOffset={8}>
 *   Tooltip with custom offset and styling
 * </TooltipContent>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the tooltip
 * @param props.sideOffset - Distance from the trigger element in pixels (defaults to 0)
 * @param props.children - Content to display inside the tooltip
 * @param props.props - Other props passed to the underlying Radix UI component
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-background-inverse`: Background color
 * - `--color-foreground-inverse`: Text color
 */
function TooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				className={cn(
					'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded-md bg-background-inverse px-3 py-1.5 text-foreground-inverse text-xs data-[state=closed]:animate-out',
					className
				)}
				data-slot='tooltip-content'
				sideOffset={sideOffset}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className='z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-sm bg-background-inverse fill-background-inverse' />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
