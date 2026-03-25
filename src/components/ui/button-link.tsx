import type { VariantProps } from 'class-variance-authority'
import { Link, type LinkProps } from 'react-router'
import { Button, type buttonVariants } from './button'

/**
 * A button component that renders as a link using React Router's Link component.
 *
 * This component combines the styling and behavior of the Button component
 * with the navigation capabilities of React Router's Link. It supports all
 * button variants and sizes while maintaining proper accessibility attributes
 * and disabled state handling.
 *
 * @component
 *
 * @example
 * // Basic usage with default variant
 * <ButtonLink to="/dashboard">Go to Dashboard</ButtonLink>
 *
 * @example
 * // Using different variants and sizes
 * <ButtonLink variant="secondary" size="lg" to="/settings">
 *   Settings
 * </ButtonLink>
 *
 * @example
 * // With disabled state
 * <ButtonLink to="/profile" disabled>
 *   Profile (Disabled)
 * </ButtonLink>
 *
 * @example
 * // With additional Link props
 * <ButtonLink
 *   to="/external"
 *   variant="tertiary"
 *   target="_blank"
 *   rel="noopener noreferrer"
 * >
 *   External Link
 * </ButtonLink>
 *
 * @param props - Component props
 * @param props.variant - The visual style of the button (e.g., 'default', 'primaryError', 'secondary', 'secondaryColor', 'tertiary', 'tertiaryColor', 'link', 'linkColor')
 * @param props.className - Additional CSS classes to apply to the button
 * @param props.children - The content to display inside the button
 * @param props.disabled - Whether the button is disabled. When disabled, prevents navigation and applies disabled styling
 * @param props.to - The destination route (from React Router Link)
 * @param props.props - All other React Router Link props are supported
 */
function ButtonLink({
	variant,
	children,
	disabled,
	size,
	...props
}: LinkProps &
	VariantProps<typeof buttonVariants> & {
		disabled?: boolean
	}) {
	return (
		<Button asChild disabled={disabled} size={size} variant={variant}>
			<Link
				{...props}
				aria-disabled={disabled}
				onClick={(event) => {
					if (disabled) {
						event.preventDefault()
						event.stopPropagation()
					} else {
						props.onClick?.(event)
					}
				}}
				tabIndex={disabled ? -1 : undefined}
			>
				{children}
			</Link>
		</Button>
	)
}

export { ButtonLink }
