import { Separator as SeparatorPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * A separator component that visually divides content.
 *
 * @component
 *
 * @example
 * // Basic usage with default horizontal orientation
 * <Separator />
 *
 * @example
 * // Using vertical orientation
 * <Separator orientation="vertical" />
 *
 * @example
 * // Horizontal separator, thick variant
 * <Separator className="h-2" />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the separator
 * @param props.orientation - The orientation of the separator ('horizontal' or 'vertical')
 * @param props.decorative - If true, the separator is decorative and does not convey meaning
 * @param props.props - All other standard HTML attributes are supported
 */

function Separator({
	className,
	orientation = 'horizontal',
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	return (
		<SeparatorPrimitive.Root
			className={cn(
				'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
				className
			)}
			data-slot='separator-root'
			decorative={decorative}
			orientation={orientation}
			{...props}
		/>
	)
}

export { Separator }
