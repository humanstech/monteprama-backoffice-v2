import { Switch as SwitchPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/helpers/utils'

/**
 * A customizable switch component based on Radix UI Switch, this component provides a consistent, accessible toggle experience with
 * customizable styling.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Switch />
 *
 * @example
 * // With label (using a form library or manual implementation)
 * <div className="flex items-center space-x-2">
 *   <Switch id="darkMode" />
 *   <label htmlFor="darkMode">Dark Mode</label>
 * </div>
 *
 * @example
 * // With checked state
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 *
 * @example
 * // Disabled state
 * <Switch disabled />
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard switch attributes from Radix UI Switch
 *
 * @cssVariables
 * The component uses these CSS variables from the theme:
 * - `--color-primary`: Background color when checked
 * - `--color-primary-foreground`: Thumb color when checked in dark mode
 * - `--color-background`: Thumb color in light mode
 * - `--color-foreground`: Thumb color when unchecked in dark mode
 * - `--color-input`: Background color when unchecked
 * - `--color-ring`: Focus ring color
 */
function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	return (
		<SwitchPrimitive.Root
			className={cn(
				'peer inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
				className
			)}
			data-slot='switch'
			{...props}
		>
			<SwitchPrimitive.Thumb
				className={cn(
					'pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
				)}
				data-slot='switch-thumb'
			/>
		</SwitchPrimitive.Root>
	)
}

export { Switch }
