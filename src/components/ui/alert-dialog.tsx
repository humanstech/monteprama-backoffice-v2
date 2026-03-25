import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import type * as React from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/helpers/utils'

/**
 * Root component for AlertDialog.
 *
 * AlertDialog provides a modal dialog with a warning that requires explicit confirmation
 * or cancellation from the user. Unlike a regular Dialog, AlertDialog
 * focuses attention on a specific action.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <AlertDialog>
 *   <AlertDialogTrigger>Delete</AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
 *       <AlertDialogDescription>Are you sure you want to delete this item?</AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction>Delete</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 *
 * @param props - Component properties
 * @param props.open - Dialog open state
 * @param props.onOpenChange - Callback function when open state changes
 * @param props.children - Child elements
 */
function AlertDialog({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
	return <AlertDialogPrimitive.Root data-slot='alert-dialog' {...props} />
}

/**
 * Trigger component for opening the AlertDialog.
 *
 * Typically used as a button that opens the AlertDialog modal.
 *
 * @component
 *
 * @example
 * <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
 *
 * @param props - Component properties
 * @param props.asChild - If true, the component will format its child element instead of creating a new element
 * @param props.children - Child elements
 */
function AlertDialogTrigger({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return (
		<AlertDialogPrimitive.Trigger
			data-slot='alert-dialog-trigger'
			{...props}
		/>
	)
}

/**
 * Portal component for AlertDialog.
 *
 * Ensures that the AlertDialog content is rendered in a portal, outside the DOM hierarchy,
 * to avoid z-index and overflow issues.
 *
 * @component
 *
 * @param props - Component properties
 * @param props.children - Child elements to be displayed in the portal
 */
function AlertDialogPortal({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
	return (
		<AlertDialogPrimitive.Portal
			data-slot='alert-dialog-portal'
			{...props}
		/>
	)
}

/**
 * Overlay component for AlertDialog.
 *
 * Creates a semi-transparent background behind the modal and provides
 * animation for appearance/disappearance.
 *
 * @component
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 */
function AlertDialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
	return (
		<AlertDialogPrimitive.Overlay
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-overlay data-[state=closed]:animate-out data-[state=open]:animate-in',
				className
			)}
			data-slot='alert-dialog-overlay'
			{...props}
		/>
	)
}

/**
 * Content container for AlertDialog.
 *
 * Displays the main content of the modal with animation and proper positioning.
 * Automatically includes the portal and overlay.
 *
 * @component
 *
 * @example
 * <AlertDialogContent>
 *   <AlertDialogHeader>
 *     <AlertDialogTitle>Warning</AlertDialogTitle>
 *     <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
 *   </AlertDialogHeader>
 *   <AlertDialogFooter>
 *     <AlertDialogCancel>Cancel</AlertDialogCancel>
 *     <AlertDialogAction>Continue</AlertDialogAction>
 *   </AlertDialogFooter>
 * </AlertDialogContent>
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Child elements
 */
function AlertDialogContent({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg',
					className
				)}
				data-slot='alert-dialog-content'
				{...props}
			/>
		</AlertDialogPortal>
	)
}

/**
 * Header component for AlertDialog.
 *
 * Styles the top section of the dialog, typically contains the title and description.
 *
 * @component
 *
 * @example
 * <AlertDialogHeader>
 *   <AlertDialogTitle>Delete File</AlertDialogTitle>
 *   <AlertDialogDescription>The file will be permanently deleted.</AlertDialogDescription>
 * </AlertDialogHeader>
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Child elements
 */
function AlertDialogHeader({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex flex-col gap-2 text-center sm:text-left',
				className
			)}
			data-slot='alert-dialog-header'
			{...props}
		/>
	)
}

/**
 * Footer component for AlertDialog.
 *
 * Styles the bottom section of the dialog, typically contains action buttons.
 * On mobile devices, it displays the primary action button first (at the top),
 * while on desktop it maintains the standard order (primary on the right).
 *
 * @component
 *
 * @example
 * <AlertDialogFooter>
 *   <AlertDialogCancel>Cancel</AlertDialogCancel>
 *   <AlertDialogAction>Confirm</AlertDialogAction>
 * </AlertDialogFooter>
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Child elements
 */
function AlertDialogFooter({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
				className
			)}
			data-slot='alert-dialog-footer'
			{...props}
		/>
	)
}

/**
 * Title component for AlertDialog.
 *
 * Displays the main heading of the dialog.
 *
 * @component
 *
 * @example
 * <AlertDialogTitle>Operation Confirmation</AlertDialogTitle>
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Title text
 */
function AlertDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			className={cn('font-semibold text-lg', className)}
			data-slot='alert-dialog-title'
			{...props}
		/>
	)
}

/**
 * Description component for AlertDialog.
 *
 * Displays additional text explaining the details of the action.
 *
 * @component
 *
 * @example
 * <AlertDialogDescription>
 *   Once deleted, data cannot be recovered.
 *   This operation cannot be undone.
 * </AlertDialogDescription>
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Description text
 */
function AlertDialogDescription({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			className={cn('text-muted-foreground text-sm', className)}
			data-slot='alert-dialog-description'
			{...props}
		/>
	)
}

/**
 * Action button component for AlertDialog.
 *
 * Button that performs the primary action of the dialog (e.g., "Delete", "Confirm", etc.).
 * By default, styled as a primary button.
 *
 * @component
 *
 * @example
 * <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Button text
 * @param props.onClick - Click handler
 */
function AlertDialogAction({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
	return (
		<AlertDialogPrimitive.Action
			className={cn(buttonVariants(), className)}
			{...props}
		/>
	)
}

/**
 * Cancel button component for AlertDialog.
 *
 * Button to close the dialog without performing the primary action.
 * By default, styled as a less prominent button.
 *
 * @component
 *
 * @example
 * <AlertDialogCancel>Cancel</AlertDialogCancel>
 *
 * @param props - Component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Button text
 */
function AlertDialogCancel({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
	return (
		<AlertDialogPrimitive.Cancel
			className={cn(buttonVariants({ variant: 'outline' }), className)}
			{...props}
		/>
	)
}

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel
}
