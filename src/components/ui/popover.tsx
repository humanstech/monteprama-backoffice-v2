import { Popover as PopoverPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * Popover container component that manages the popover's open and close behavior.
 *
 * This component wraps the Radix Popover Root to handle its core functionality.
 *
 * @component
 *
 * @example
 * <Popover>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>Content</PopoverContent>
 * </Popover>
 *
 * @param props - Component props
 * @param props.props - All other props are passed to the underlying Radix Popover.Root component
 */
function Popover({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
	return <PopoverPrimitive.Root data-slot='popover' {...props} />
}

/**
 * Popover trigger component that toggles the visibility of the popover content.
 *
 * This component wraps the Radix Popover Trigger to open or close the popover.
 *
 * @component
 *
 * @example
 * <Popover>
 *   <PopoverTrigger>Open</PopoverTrigger>
 * </Popover>
 *
 * @param props - Component props
 * @param props.props - All other props are passed to the underlying Radix Popover.Trigger component
 */
function PopoverTrigger({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
	return <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />
}

/**
 * Popover content component that displays the content inside the popover.
 *
 * This component wraps the Radix Popover Content and provides animation and styling.
 *
 * @component
 *
 * @example
 * <Popover>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <p>Popover content here</p>
 *   </PopoverContent>
 * </Popover>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.align - Alignment of the popover content (default is 'center')
 * @param props.sideOffset - Offset distance from the trigger (default is 4)
 * @param props.props - All other props are passed to the underlying Radix Popover.Content component
 */
function PopoverContent({
	className,
	align = 'center',
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				align={align}
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in',
					className
				)}
				data-slot='popover-content'
				sideOffset={sideOffset}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	)
}

/**
 * Popover anchor component that allows positioning the popover relative to a custom anchor.
 *
 * This component wraps the Radix Popover Anchor to control custom anchoring.
 *
 * @component
 *
 * @example
 * <Popover>
 *   <PopoverAnchor />
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>Content</PopoverContent>
 * </Popover>
 *
 * @param props - Component props
 * @param props.props - All other props are passed to the underlying Radix Popover.Anchor component
 */
function PopoverAnchor({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
	return <PopoverPrimitive.Anchor data-slot='popover-anchor' {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
