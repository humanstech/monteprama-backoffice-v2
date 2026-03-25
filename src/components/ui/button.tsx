import { cva, type VariantProps } from 'class-variance-authority'
import { Slot as SlotPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

const buttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					'bg-brand text-brand-foreground shadow-xs enabled:hover:bg-brand/90',
				primary:
					'bg-primary text-primary-foreground shadow-xs enabled:hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground shadow-xs focus-visible:ring-destructive/20 enabled:hover:bg-destructive/90',
				success:
					'bg-success text-success-foreground shadow-xs enabled:hover:bg-success/90',
				outline:
					'border border-input bg-background text-foreground shadow-xs enabled:hover:bg-accent enabled:hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground shadow-xs enabled:hover:bg-secondary/80',
				ghost: 'text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground',
				link: 'text-primary underline underline-offset-4'
			},
			size: {
				default: 'h-11 px-4 py-2 text-base',
				sm: 'h-9 px-3 py-2 text-sm',
				lg: 'h-12 px-6 py-2 text-base',
				icon: 'size-11'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

/**
 * A customizable button component with different variants and sizes.
 *
 * This component extends the native HTML button with consistent styling
 * defined by `cva` (class-variance-authority). It supports various visual
 * styles (variants) and sizes.
 *
 * @component
 *
 * @example
 * // Basic usage with default variant and size
 * <Button>Click me</Button>
 *
 * @example
 * // Using a different variant and size
 * <Button variant="destructive" size="sm">Delete</Button>
 *
 * @example
 * // As a link using the 'asChild' prop with a Next.js Link
 * import Link from "next/link";
 * <Button asChild>
 *   <Link href="/login">Login</Link>
 * </Button>
 *
 * @example
 * // Icon button
 * import { Mail } from "@/components/ui/icons";
 * <Button variant="outline" size="icon">
 *   <Mail className="size-4" />
 * </Button>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the button
 * @param props.variant - The visual style of the button (e.g., 'default', 'destructive', 'outline')
 * @param props.size - The size of the button (e.g., 'default', 'sm', 'lg', 'icon')
 * @param props.asChild - If true, renders the component as a slot for its children, merging props and behavior.
 * @param props.props - All other standard HTML button attributes are supported
 */
function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? SlotPrimitive.Slot : 'button'

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			data-slot='button'
			{...props}
		/>
	)
}

export { Button, buttonVariants }
