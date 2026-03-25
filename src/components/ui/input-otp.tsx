import { OTPInput, OTPInputContext } from 'input-otp'
import React from 'react'
import { cn } from '@/helpers/utils'
import { MinusIcon } from './icons'

/**
 * A customizable OTP (One-Time Password) input component.
 *
 * This component provides a styled wrapper around the OTPInput component,
 * offering consistent styling and accessibility features.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <InputOTP maxLength={6}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *     <InputOTPSeparator />
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the input
 * @param props.containerClassName - Additional CSS classes to apply to the container
 * @param props.props - All other standard OTPInput props
 */
function InputOTP({
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string
}) {
	return (
		<OTPInput
			className={cn('disabled:cursor-not-allowed', className)}
			containerClassName={cn(
				'flex items-center gap-2 has-disabled:opacity-50',
				containerClassName
			)}
			data-slot='input-otp'
			{...props}
		/>
	)
}

/**
 * A container component for OTP input slots.
 *
 * This component groups individual OTP input slots together and provides
 * consistent spacing between them.
 *
 * @component
 *
 * @example
 * <InputOTPGroup>
 *   <InputOTPSlot index={0} />
 *   <InputOTPSlot index={1} />
 * </InputOTPGroup>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the group
 * @param props.props - All other standard div props
 */
function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('flex items-center gap-2', className)}
			data-slot='input-otp-group'
			{...props}
		/>
	)
}

/**
 * An individual slot component for OTP input.
 *
 * This component represents a single character input slot in the OTP input.
 * It handles the display of entered characters and the caret animation.
 *
 * @component
 *
 * @example
 * <InputOTPSlot index={0} />
 *
 * @param props - Component props
 * @param props.index - The index of this slot in the OTP input
 * @param props.className - Additional CSS classes to apply to the slot
 * @param props.props - All other standard div props
 */
function InputOTPSlot({
	index,
	className,
	...props
}: React.ComponentProps<'div'> & {
	index: number
}) {
	const inputOTPContext = React.useContext(OTPInputContext)
	const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

	return (
		<div
			className={cn(
				'relative flex size-11 items-center justify-center rounded-md border bg-background text-base shadow-xs outline-none transition-all aria-invalid:border-destructive aria-invalid:bg-destructive-faded data-[active=true]:z-10 data-[active=true]:ring data-[active=true]:ring-ring',
				className
			)}
			data-active={isActive}
			data-slot='input-otp-slot'
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
					<div className='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
				</div>
			)}
		</div>
	)
}

/**
 * A separator component for OTP input groups.
 *
 * This component provides a visual separator between groups of OTP input slots.
 * It uses a minus icon to indicate the separation.
 *
 * @component
 *
 * @example
 * <InputOTPGroup>
 *   <InputOTPSlot index={0} />
 *   <InputOTPSlot index={1} />
 *   <InputOTPSeparator />
 *   <InputOTPSlot index={2} />
 *   <InputOTPSlot index={3} />
 * </InputOTPGroup>
 *
 * @param props - Component props
 * @param props.props - All other standard div props
 */
function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
	return (
		<div data-slot='input-otp-separator' {...props}>
			<MinusIcon className='size-5 fill-foreground' />
		</div>
	)
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
