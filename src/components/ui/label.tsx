import { Label as LabelPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * A customizable label component built on top of Radix UI's label primitive.
 *
 * This component provides consistent styling and behavior for form labels,
 * with support for disabled states and peer element interactions.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Label>Username</Label>
 *
 * @example
 * // With custom className
 * <Label className="text-lg">Password</Label>
 *
 * @example
 * // Used with form control
 * <div className="group">
 *   <Label>Email</Label>
 *   <Input type="email" disabled />
 * </div>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other props are passed to the underlying Radix Label component
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-foreground`: Text color
 * - `--color-muted`: Disabled state color
 */
function Label({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			className={cn(
				'flex select-none items-center gap-2 font-medium text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
				className
			)}
			data-slot='label'
			{...props}
		/>
	)
}

export { Label }
