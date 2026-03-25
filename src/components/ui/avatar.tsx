import { Avatar as AvatarPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * Root Avatar component that provides the container for avatar content.
 *
 * This component is built on top of Radix UI's Avatar primitive and provides
 * consistent styling for displaying user avatars with support for images
 * and fallback content.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Avatar>
 *   <AvatarImage src="/user-avatar.png" alt="User" />
 *   <AvatarFallback>JP</AvatarFallback>
 * </Avatar>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other props are passed to the underlying Radix Avatar.Root component
 */
function Avatar({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
	return (
		<AvatarPrimitive.Root
			className={cn(
				'relative flex size-10 shrink-0 overflow-hidden rounded-full',
				className
			)}
			data-slot='avatar'
			{...props}
		/>
	)
}

/**
 * Avatar image component that displays the user's avatar picture.
 *
 * This component handles the image display within the Avatar container.
 * It will trigger the fallback component if the image fails to load.
 *
 * @component
 *
 * @example
 * <Avatar>
 *   <AvatarImage
 *     src="/path/to/image.jpg"
 *     alt="User name"
 *   />
 * </Avatar>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other props are passed to the underlying Radix Avatar.Image component
 */
function AvatarImage({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	return (
		<AvatarPrimitive.Image
			className={cn('aspect-square size-full', className)}
			data-slot='avatar-image'
			{...props}
		/>
	)
}

/**
 * Fallback content to display when the avatar image is not available.
 *
 * This component renders when the image fails to load or isn't provided.
 * It typically displays initials, an icon, or any other fallback content.
 *
 * @component
 *
 * @example
 * <Avatar>
 *   <AvatarImage src="/user.jpg" alt="User" />
 *   <AvatarFallback>JP</AvatarFallback>
 * </Avatar>
 *
 * @example
 * // With an icon
 * import { User } from "lucide-react"
 *
 * <Avatar>
 *   <AvatarFallback>
 *     <User className="size-6" />
 *   </AvatarFallback>
 * </Avatar>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other props are passed to the underlying Radix Avatar.Fallback component
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-muted`: Background color
 * - `--color-muted-foreground`: Text color
 */
function AvatarFallback({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			className={cn(
				"flex size-full items-center justify-center rounded-full border bg-muted font-medium text-base text-muted-foreground [&_svg:not([class*='size-'])]:size-6",
				className
			)}
			data-slot='avatar-fallback'
			{...props}
		/>
	)
}

export { Avatar, AvatarImage, AvatarFallback }
