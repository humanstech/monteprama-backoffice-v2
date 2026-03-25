import { Accordion as AccordionPrimitive } from 'radix-ui'
import type * as React from 'react'
import { ChevronDownIcon } from '@/components/ui/icons'

import { cn } from '@/helpers/utils'

/**
 * Root accordion component that manages the state of accordion items.
 *
 * This component is a wrapper around Radix UI's Accordion component.
 *
 * @component
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   // Accordion items
 * </Accordion>
 * ```
 *
 * @example
 * ```tsx
 * <Accordion type="multiple">
 *   // Accordion items
 * </Accordion>
 * ```
 *
 * @param props - Component props
 * @param props.type - 'single' (only one item can be open) or 'multiple' (multiple items can be open)
 * @param props.collapsible - When type is 'single', allows closing an open item
 * @param props.defaultValue - Default value(s) for the open items
 * @param props.value - Controlled value(s) for the open items
 * @param props.onValueChange - Callback when the open items change
 */
function Accordion({
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return <AccordionPrimitive.Root data-slot='accordion' {...props} />
}

/**
 * Individual accordion item component.
 *
 * Each AccordionItem should contain an AccordionTrigger and AccordionContent.
 *
 * @component
 *
 * @example
 * ```tsx
 * <AccordionItem value="item-1">
 *   <AccordionTrigger>Section 1</AccordionTrigger>
 *   <AccordionContent>Content for section 1</AccordionContent>
 * </AccordionItem>
 * ```
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.value - Unique identifier for the accordion item
 * @param props.disabled - Whether the accordion item is disabled
 */
function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			className={cn('border-b last:border-b-0', className)}
			data-slot='accordion-item'
			{...props}
		/>
	)
}

type AccordionTriggerProps = React.ComponentProps<
	typeof AccordionPrimitive.Trigger
>

/**
 * Clickable trigger component that toggles an accordion item.
 *
 * This component is wrapped in an AccordionHeader and includes a chevron icon
 * that rotates when the accordion item is open.
 *
 * @component
 *
 * @example
 * ```tsx
 * <AccordionTrigger>Click to expand</AccordionTrigger>
 * ```
 *
 * @example
 * ```tsx
 * <AccordionTrigger className="custom-class">
 *   Section with custom styling
 * </AccordionTrigger>
 * ```
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.children - Content to display as the trigger label
 * @param props.disabled - Whether the trigger is disabled
 */
function AccordionTrigger({
	className,
	children,
	...props
}: AccordionTriggerProps) {
	return (
		<AccordionPrimitive.Header className='flex'>
			<AccordionPrimitive.Trigger
				className={cn(
					'flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					className
				)}
				data-slot='accordion-trigger'
				{...props}
			>
				{children}
				<ChevronDownIcon className='pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200' />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	)
}

/**
 * Content component for an accordion item.
 *
 * This component is animated to slide up/down when toggled.
 *
 * @component
 *
 * @example
 * ```tsx
 * <AccordionContent>
 *   Content that shows when the accordion item is expanded
 * </AccordionContent>
 * ```
 *
 * @example
 * ```tsx
 * <AccordionContent className="custom-content-class">
 *   <p>Custom styled content</p>
 * </AccordionContent>
 * ```
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.children - Content to display when the accordion item is expanded
 * @param props.forceMount - Force mounting the content even when closed (for accessibility)
 */
function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			className='overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
			data-slot='accordion-content'
			{...props}
		>
			<div className={cn('pt-0 pb-4', className)}>{children}</div>
		</AccordionPrimitive.Content>
	)
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
