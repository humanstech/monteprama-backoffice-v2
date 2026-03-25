import { cn } from '@/helpers/utils'

/**
 * A customizable skeleton loading component.
 *
 * This component provides a visual placeholder while content is loading,
 * with a subtle animation to indicate loading state to users.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Skeleton className="h-12 w-12" />
 *
 * @example
 * // Skeleton for a text block
 * <Skeleton className="h-4 w-[250px]" />
 *
 * @example
 * // Skeleton for an image
 * <Skeleton className="h-[200px] w-full rounded-lg" />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML div attributes are supported
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-accent`: The background color of the skeleton
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-accent', className)}
			data-slot='skeleton'
			{...props}
		/>
	)
}

export { Skeleton }
