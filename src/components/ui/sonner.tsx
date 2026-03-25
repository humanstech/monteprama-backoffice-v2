import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { AlertCircleIcon, CheckCircleBrokenIcon } from './icons'

/**
 * A customizable toast notification component built on top of Sonner.
 *
 * This component provides a themed toast notification system that integrates with
 * your application's theme and styling. It customizes Sonner's default
 * appearance to match your app's design system using CSS variables.
 *
 * The Toaster component should be included once in your application layout.
 * Then, you can use the toast API from sonner to show notifications from anywhere
 * in your application without needing to pass props or context.
 *
 * @component
 *
 * @example
 * // Basic usage in your app's layout
 * import { Toaster } from "@/components/ui/sonner"
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         {children}
 *         <Toaster />
 *       </body>
 *     </html>
 *   )
 * }
 *
 * @example
 * // Triggering toasts from anywhere in your app
 * import { toast } from "sonner"
 *
 * function MyComponent() {
 *   return (
 *     <Button
 *       onClick={() => toast.success("Operation completed successfully!")}
 *     >
 *       Save
 *     </Button>
 *   )
 * }
 *
 * @example
 * // Using with custom options
 * <Toaster
 *   position="bottom-right"
 *   expand={false}
 *   richColors
 * />
 *
 * @example
 * // Custom toast with title and description
 * toast("Event scheduled", {
 *   description: "Friday, February 10, 2023 at 5:57 PM",
 *   icon: <CalendarIcon className="size-5" />
 * })
 *
 * @example
 * // Toast with action button
 * toast("Profile updated", {
 *   action: {
 *     label: "Undo",
 *     onClick: () => handleUndo()
 *   }
 * })
 *
 * @example
 * // Different toast types
 * // Success toast
 * toast.success("Profile saved successfully")
 *
 * // Error toast
 * toast.error("An error occurred while saving")
 *
 * // Loading toast that updates on completion
 * const toastId = toast.loading("Uploading file...")
 * // Later when operation completes:
 * toast.success("File uploaded", { id: toastId })
 *
 * // Custom promise toast
 * toast.promise(
 *   fetch('/api/data'),
 *   {
 *     loading: 'Loading data...',
 *     success: 'Data loaded successfully',
 *     error: 'Failed to load data'
 *   }
 * )
 *
 * @param props - Component props that extend Sonner's ToasterProps
 * @param props.theme - Theme mode ('light', 'dark', or 'system')
 * @param props.position - Position of toasts on the screen (e.g., 'top-right', 'bottom-center')
 * @param props.expand - Whether toasts should expand to fill the available width
 * @param props.richColors - Whether to use rich colors for different toast types
 * @param props.closeButton - Whether to show a close button on toasts
 * @param props.duration - Default duration in milliseconds before toasts are automatically dismissed
 * @param props.icons - Custom icons for different toast types
 * @param props.toastOptions - Default options applied to all toasts
 * @param props.className - Additional CSS classes to apply to the toaster
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--background`: Background color for toasts
 * - `--foreground`: Text color for toasts
 * - `--border`: Border color for toasts
 * - `--muted-foreground`: Color for toast description text
 * - `--accent`: Background color for hover states on buttons
 * - `--input`: Border color for buttons
 * - `--destructive`: Color for error icons
 * - `--success`: Color for success icons
 * - `--info`: Color for info icons
 */
const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useTheme()

	return (
		<Sonner
			className='toaster group'
			icons={{
				success: (
					<CheckCircleBrokenIcon className='size-5 fill-success' />
				),
				error: <AlertCircleIcon className='size-5 fill-destructive' />,
				warning: props.icons?.warning,
				info: <AlertCircleIcon className='size-5 fill-info' />,
				loading: props.icons?.loading
			}}
			style={
				{
					'--normal-bg': 'var(--background)',
					'--normal-text': 'var(--foreground)',
					'--normal-border': 'var(--border)'
				} as React.CSSProperties
			}
			theme={theme}
			toastOptions={{
				className:
					'[&>button]:!ml-auto [&:has([data-description])]:!items-start',
				classNames: {
					title: '!text-foreground !font-medium !text-sm',
					description: '!text-muted-foreground !text-sm',
					icon: '!w-5 !h-5 !mr-0 !ml-0',
					closeButton: 'hover:!bg-accent !border-input',
					actionButton: '!ml-auto bg-transparent'
				}
			}}
			{...props}
		/>
	)
}

export { Toaster }
