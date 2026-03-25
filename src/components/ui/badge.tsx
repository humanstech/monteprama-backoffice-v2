import { cva, type VariantProps } from 'class-variance-authority'
import { Slot as SlotPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * Badge variants configuration using class-variance-authority.
 *
 * Defines styling for different badge variants including default, secondary,
 * destructive, success, and outline styles.
 */
const badgeVariants = cva(
	'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 font-medium text-sm transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-info text-info-foreground shadow-sm [a&]:hover:bg-primary/90',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
				destructive:
					'border-transparent bg-destructive text-white shadow-sm focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/90',
				success:
					'border-transparent bg-success text-success-foreground shadow-sm focus-visible:ring-success/20 [a&]:hover:bg-success/90',
				outline:
					'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

/**
 * A versatile badge component for displaying status, labels, or categories.
 *
 * This component can be rendered as a span (default) or as any other component
 * when asChild is true, inheriting all the badge styling.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Badge>New</Badge>
 *
 * @example
 * // With different variants
 * <Badge variant="secondary">In Progress</Badge>
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Draft</Badge>
 *
 * @example
 * // With an icon
 * import { CheckIcon } from "@/components/ui/icons"
 *
 * <Badge>
 *   <CheckIcon />
 *   Verified
 * </Badge>
 *
 * @example
 * // As a link
 * <Badge asChild>
 *   <a href="/tags/important">Important</a>
 * </Badge>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.variant - Visual style variant of the badge
 * @param props.asChild - When true, badge will render as its child, passing the badge styles
 * @param props.props - All other standard HTML span attributes are supported
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-info`: Default badge background color
 * - `--color-info-foreground`: Default badge text color
 * - `--color-secondary`: Secondary badge background color
 * - `--color-secondary-foreground`: Secondary badge text color
 * - `--color-destructive`: Destructive badge background color
 * - `--color-success`: Success badge background color
 * - `--color-success-foreground`: Success badge text color
 * - `--color-foreground`: Outline badge text color
 * - `--color-accent`: Outline badge hover background
 * - `--color-accent-foreground`: Outline badge hover text color
 * - `--color-ring`: Focus ring color
 */
function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? SlotPrimitive.Slot : 'span'

	return (
		<Comp
			className={cn(badgeVariants({ variant }), className)}
			data-slot='badge'
			{...props}
		/>
	)
}

export { Badge, badgeVariants }
