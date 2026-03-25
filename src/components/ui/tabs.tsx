import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'
import React from 'react'

import { cn } from '@/helpers/utils'

const tabsListVariants = cva('inline-flex w-fit items-center justify-center', {
	variants: {
		variant: {
			default: 'rounded-lg bg-muted p-1',
			outline: '',
			underline: ''
		}
	},
	defaultVariants: {
		variant: 'default'
	}
})

const tabsTriggerVariants = cva(
	'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 font-medium text-sm transition-all disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'flex-1 rounded-md border border-transparent text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
				outline:
					'flex-1 rounded-md border border-transparent text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground',
				underline:
					'relative flex-1 text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-100 after:bg-secondary after:transition-transform hover:text-foreground data-[state=active]:text-primary data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

type TabsVariant = VariantProps<typeof tabsListVariants>['variant']

const TabsContext = React.createContext<TabsVariant>('default')

/**
 * A set of layered sections of content—known as tab panels—that are displayed one at a time.
 *
 * This component provides a way to organize content into multiple panels that can be switched between.
 * It uses Radix UI's Tabs primitive under the hood and provides consistent styling with the design system.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Tabs defaultValue="account" className="w-[400px]">
 *   <TabsList variant="underline">
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Make changes to your account here.</TabsContent>
 *   <TabsContent value="password">Change your password here.</TabsContent>
 * </Tabs>
 *
 * @param props - Component props
 * @param props.defaultValue - The value of the tab that should be active when initially rendered
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other Radix UI Tabs.Root props are supported
 */
function Tabs({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			className={cn('flex flex-col gap-2', className)}
			data-slot='tabs'
			{...props}
		/>
	)
}

/**
 * A container for the tab triggers.
 *
 * This component wraps the tab triggers and provides consistent styling.
 *
 * @component
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.variant - The variant of the tab list
 * @param props.props - All other Radix UI Tabs.List props are supported
 */
function TabsList({
	className,
	variant,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
	VariantProps<typeof tabsListVariants>) {
	return (
		<TabsContext.Provider value={variant}>
			<TabsPrimitive.List
				className={cn(tabsListVariants({ variant }), className)}
				data-slot='tabs-list'
				{...props}
			/>
		</TabsContext.Provider>
	)
}

/**
 * The button that activates its associated tab content.
 *
 * This component represents a single tab trigger that users can click to switch between different content panels.
 *
 * @component
 *
 * @param props - Component props
 * @param props.value - The value of the tab that this trigger controls
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.variant - The variant of the tab trigger
 * @param props.props - All other Radix UI Tabs.Trigger props are supported
 */
function TabsTrigger({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	const variant = React.useContext(TabsContext)
	return (
		<TabsPrimitive.Trigger
			className={cn(tabsTriggerVariants({ variant }), className)}
			data-slot='tabs-trigger'
			{...props}
		/>
	)
}

/**
 * Contains the content associated with a tab trigger.
 *
 * This component wraps the content that should be shown when its associated tab trigger is active.
 *
 * @component
 *
 * @param props - Component props
 * @param props.value - The value of the tab that this content belongs to
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other Radix UI Tabs.Content props are supported
 */
function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			className={cn('flex-1 outline-none', className)}
			data-slot='tabs-content'
			{...props}
		/>
	)
}

/**
 * A counter component that can be used inside TabsTrigger to display a count.
 *
 * @component
 *
 * @example
 * <TabsTrigger value="account">
 *   Account
 *   <TabsCounter>5</TabsCounter>
 * </TabsTrigger>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.children - The count number to display
 */
function TabsCounter({
	className,
	children,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			className={cn(
				'inline-flex size-5 items-center justify-center rounded-md bg-secondary font-medium text-secondary-foreground text-xs',
				className
			)}
			data-slot='tabs-counter'
			{...props}
		>
			{children}
		</span>
	)
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsCounter }
export type { TabsVariant }
