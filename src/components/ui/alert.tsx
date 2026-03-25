import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * Configuration for alert component variants using class-variance-authority.
 * Defines styling for different alert types (default, destructive, success).
 *
 * @internal
 */
const alertVariants = cva(
	'relative grid w-full grid-cols-[max-content_1fr] items-start gap-x-2 gap-y-1 rounded-lg border bg-card p-3 text-card-foreground text-sm',
	{
		variants: {
			variant: {
				default:
					'[&>div[data-slot=alert-icon]]:bg-info [&>div[data-slot=alert-icon]]:text-info-foreground',
				destructive:
					'[&>div[data-slot=alert-icon]]:bg-destructive [&>div[data-slot=alert-icon]]:text-destructive-foreground',
				success:
					'[&>div[data-slot=alert-icon]]:bg-success [&>div[data-slot=alert-icon]]:text-success-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

/**
 * Alert component for displaying informational messages with various visual styles.
 *
 * The Alert component serves as the container for the alert pattern and supports
 * different variants to convey the nature of the message (info, error, success).
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Alert>
 *   <AlertIcon>
 *     <InfoIcon />
 *   </AlertIcon>
 *   <AlertTitle>Information</AlertTitle>
 *   <AlertDescription>This is an informational message.</AlertDescription>
 * </Alert>
 *
 * @example
 * // Error alert
 * <Alert variant="destructive">
 *   <AlertIcon>
 *     <AlertTriangleIcon />
 *   </AlertIcon>
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @param props.variant - Visual style of the alert: "default" | "destructive" | "success"
 * @param props.props - All other standard HTML div attributes
 */
function Alert({
	className,
	variant,
	...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
	return (
		<div
			className={cn(alertVariants({ variant }), className)}
			data-slot='alert'
			role='alert'
			{...props}
		/>
	)
}

/**
 * AlertTitle component for displaying the heading of an alert message.
 *
 * This component is designed to be used within the Alert component to provide
 * a concise title for the alert message.
 *
 * @component
 *
 * @example
 * <Alert>
 *   <AlertTitle>Success</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 * </Alert>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @param props.props - All other standard HTML div attributes
 */
function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'col-start-2 line-clamp-1 min-h-4 font-medium leading-none tracking-tight',
				className
			)}
			data-slot='alert-title'
			{...props}
		/>
	)
}

/**
 * AlertDescription component for displaying the detailed content of an alert.
 *
 * This component is designed to be used within the Alert component to provide
 * additional context or explanation for the alert message.
 *
 * @component
 *
 * @example
 * <Alert>
 *   <AlertTitle>Information</AlertTitle>
 *   <AlertDescription>
 *     <p>This is the first line of information.</p>
 *     <p>This is additional context for the alert.</p>
 *   </AlertDescription>
 * </Alert>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @param props.props - All other standard HTML div attributes
 */
function AlertDescription({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
				className
			)}
			data-slot='alert-description'
			{...props}
		/>
	)
}

/**
 * AlertIcon component for displaying an icon within an alert.
 *
 * This component is designed to be used within the Alert component to provide
 * a visual indicator for the type of alert (e.g., info, error, success).
 * The color of the icon background is determined by the Alert variant.
 *
 * @component
 *
 * @example
 * <Alert>
 *   <AlertIcon>
 *     <InfoIcon />
 *   </AlertIcon>
 *   <AlertTitle>Information</AlertTitle>
 * </Alert>
 *
 * @example
 * // With success variant
 * <Alert variant="success">
 *   <AlertIcon>
 *     <CheckIcon />
 *   </AlertIcon>
 *   <AlertTitle>Success</AlertTitle>
 * </Alert>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @param props.props - All other standard HTML div attributes
 */
function AlertIcon({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'row-span-2 flex size-8 items-center justify-center rounded-full [&>svg]:size-4',
				className
			)}
			data-slot='alert-icon'
			{...props}
		/>
	)
}

export { Alert, AlertTitle, AlertDescription, AlertIcon }
