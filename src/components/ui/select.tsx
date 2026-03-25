/**
 * A customizable select component based on Radix UI Select.
 *
 * This component provides a consistent, accessible select experience with
 * customizable styling that works with your design system. It includes
 * support for groups, labels, and various states (disabled, invalid, etc.).
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 *
 * @example
 * // With label
 * <Select>
 *   <SelectTrigger label="Choose an option">
 *     <SelectValue placeholder="Select an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 *
 * @example
 * // With groups
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select a fruit" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectGroup>
 *       <SelectLabel>Fruits</SelectLabel>
 *       <SelectItem value="apple">Apple</SelectItem>
 *       <SelectItem value="banana">Banana</SelectItem>
 *     </SelectGroup>
 *     <SelectSeparator />
 *     <SelectGroup>
 *       <SelectLabel>Vegetables</SelectLabel>
 *       <SelectItem value="carrot">Carrot</SelectItem>
 *       <SelectItem value="potato">Potato</SelectItem>
 *     </SelectGroup>
 *   </SelectContent>
 * </Select>
 *
 * @subcomponents
 * - SelectTrigger: The button that opens the select dropdown
 * - SelectValue: Displays the selected value or placeholder
 * - SelectContent: The dropdown content container
 * - SelectItem: Individual selectable options
 * - SelectGroup: Groups related options together
 * - SelectLabel: Labels for groups or individual items
 * - SelectSeparator: Visual separator between groups
 * - SelectScrollUpButton: Button to scroll up in long lists
 * - SelectScrollDownButton: Button to scroll down in long lists

 */

import { Select as SelectPrimitive } from 'radix-ui'
import type * as React from 'react'
import { useId } from 'react'
import { CheckIcon, ChevronDownIcon } from '@/components/ui/icons.tsx'
import { Label } from '@/components/ui/label.tsx'
import { cn } from '@/helpers/utils'

function Select({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root data-slot='select' {...props} />
}

function SelectGroup({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return <SelectPrimitive.Group data-slot='select-group' {...props} />
}

function SelectValue({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return <SelectPrimitive.Value data-slot='select-value' {...props} />
}

function SelectTrigger({
	className,
	size = 'default',
	children,
	label,
	classNameWrapper,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: 'sm' | 'default'
	label?: string
	classNameWrapper?: string
}) {
	const id = useId()
	return (
		<div className={cn(classNameWrapper, 'flex flex-col gap-2')}>
			{label && <Label htmlFor={id}>{label}</Label>}
			<SelectPrimitive.Trigger
				className={cn(
					"flex w-fit cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[1px] focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[placeholder]:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
					className
				)}
				data-size={size}
				data-slot='select-trigger'
				id={id}
				{...props}
			>
				{children}
				<SelectPrimitive.Icon asChild>
					<ChevronDownIcon className='size-4 opacity-50' />
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
		</div>
	)
}

function SelectLabel({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			className={cn(
				'flex select-none items-center gap-2 p-2 font-medium text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
				className
			)}
			data-slot='select-label'
			{...props}
		/>
	)
}

function SelectContent({
	className,
	children,
	position = 'popper',
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in',
					position === 'popper' &&
						'data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
					className
				)}
				data-slot='select-content'
				position={position}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						'p-1',
						position === 'popper' &&
							'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			className={cn(
				"!cursor-pointer relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				className
			)}
			data-slot='select-item'
			{...props}
		>
			<span className='absolute right-2 flex size-3.5 items-center justify-center'>
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className='size-4' />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	)
}

function SelectSeparator({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			className={cn(
				'pointer-events-none -mx-1 my-1 h-px bg-border',
				className
			)}
			data-slot='select-separator'
			{...props}
		/>
	)
}

function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			className={cn(
				'flex cursor-default items-center justify-center py-1',
				className
			)}
			data-slot='select-scroll-up-button'
			{...props}
		>
			<ChevronDownIcon className='size-4 rotate-180' />
		</SelectPrimitive.ScrollUpButton>
	)
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			className={cn(
				'flex cursor-default items-center justify-center py-1',
				className
			)}
			data-slot='select-scroll-down-button'
			{...props}
		>
			<ChevronDownIcon className='size-4' />
		</SelectPrimitive.ScrollDownButton>
	)
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue
}
