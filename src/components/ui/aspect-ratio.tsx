import { AspectRatio as AspectRatioPrimitive } from 'radix-ui'

/**
 * A component that maintains a consistent width-to-height ratio.
 *
 * This component is a wrapper around Radix UI's AspectRatio primitive,
 * allowing you to easily create boxes with a specific aspect ratio.
 *
 * @component
 *
 * @example
 * // Basic usage with 16:9 ratio
 * <AspectRatio ratio={16 / 9}>
 *   <img src="image.jpg" alt="Image" className="h-full w-full object-cover" />
 * </AspectRatio>
 *
 * @example
 * // Square ratio (1:1)
 * <AspectRatio ratio={1 / 1}>
 *   <div className="flex items-center justify-center bg-muted">
 *     <p>1:1</p>
 *   </div>
 * </AspectRatio>
 *
 * @param props - Component props
 * @param props.ratio - The desired aspect ratio (width/height)
 * @param props.className - Additional CSS classes to apply
 * @param props.children - Content to render within the aspect ratio container
 */
function AspectRatio({
	...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
	return <AspectRatioPrimitive.Root data-slot='aspect-ratio' {...props} />
}

export { AspectRatio }
