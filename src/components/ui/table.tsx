import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/helpers/utils'

const cellSizeVariants = cva('', {
	variants: {
		size: {
			sm: '[&_td]:h-9 [&_td]:p-1.5 [&_th]:h-9 [&_th]:p-1.5',
			default: '[&_td]:h-12 [&_td]:p-2 [&_th]:h-12 [&_th]:p-2',
			lg: '[&_td]:h-16 [&_td]:px-4 [&_td]:py-2 [&_th]:h-16 [&_th]:px-4 [&_th]:py-2'
		}
	},
	defaultVariants: {
		size: 'sm'
	}
})

const borderVariants = cva('w-full table-fixed caption-bottom text-sm', {
	variants: {
		borderType: {
			none: '',
			bottom: '[&_td]:border-border [&_td]:border-b [&_th]:border-border [&_th]:border-b',
			all: '[&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border'
		}
	},
	defaultVariants: {
		borderType: 'bottom'
	}
})

/**
 * A responsive table component with accessible styling.
 *
 * This component provides the container and table element with consistent styling.
 * Use it together with the other Table* components to build accessible, responsive tables.
 *
 * @component
 *
 * @example
 * // Basic usage
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John Doe</TableCell>
 *       <TableCell>john@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML table attributes
 */
function Table({
	className,
	borderType,
	...props
}: VariantProps<typeof borderVariants> & React.ComponentProps<'table'>) {
	return (
		<div
			className='relative h-full w-full overflow-auto'
			data-slot='table-container'
		>
			<table
				className={borderVariants({ borderType, className })}
				data-slot='table'
				{...props}
			/>
		</div>
	)
}

/**
 * Table header component for containing header rows.
 *
 * Use this component to wrap your header rows containing TableHead cells.
 *
 * @component
 *
 * @example
 * <TableHeader>
 *   <TableRow>
 *     <TableHead>Column 1</TableHead>
 *     <TableHead>Column 2</TableHead>
 *   </TableRow>
 * </TableHeader>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML thead attributes
 */
function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
	return (
		<thead
			className={cn('[&_tr]:border-b', className)}
			data-slot='table-header'
			{...props}
		/>
	)
}

/**
 * Table body component for containing data rows.
 *
 * Use this component to wrap your data rows containing TableCell elements.
 *
 * @component
 *
 * @example
 * <TableBody>
 *   <TableRow>
 *     <TableCell>Data 1</TableCell>
 *     <TableCell>Data 2</TableCell>
 *   </TableRow>
 * </TableBody>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML tbody attributes
 */
function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
	return (
		<tbody
			className={cn('[&_tr:last-child]:border-0', className)}
			data-slot='table-body'
			{...props}
		/>
	)
}

/**
 * Table footer component for containing summary rows.
 *
 * Use this component to wrap footer rows that typically contain totals or summaries.
 *
 * @component
 *
 * @example
 * <TableFooter>
 *   <TableRow>
 *     <TableCell>Total</TableCell>
 *     <TableCell>$100.00</TableCell>
 *   </TableRow>
 * </TableFooter>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML tfoot attributes
 */
function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
	return (
		<tfoot
			className={cn('border-t [&>tr]:last:border-b-0', className)}
			data-slot='table-footer'
			{...props}
		/>
	)
}

/**
 * Table row component for containing cells.
 *
 * Each row can be used in header, body, or footer sections of the table.
 * Includes hover states and selected state styling.
 *
 * @component
 *
 * @example
 * <TableRow>
 *   <TableCell>Row data 1</TableCell>
 *   <TableCell>Row data 2</TableCell>
 * </TableRow>
 *
 * @example
 * // With selection state
 * <TableRow data-state="selected">
 *   <TableCell>Selected row</TableCell>
 *   <TableCell>Data</TableCell>
 * </TableRow>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML tr attributes
 */
function TableRow({
	className,
	size,
	...props
}: React.ComponentProps<'tr'> & VariantProps<typeof cellSizeVariants>) {
	return (
		<tr
			className={cn(
				'transition-colors hover:bg-accent data-[state=selected]:bg-muted',
				cellSizeVariants({ size, className })
			)}
			data-slot='table-row'
			{...props}
		/>
	)
}

/**
 * Table header cell component.
 *
 * Use this for column headers in your table. Provides consistent styling
 * for header cells with proper alignment and font weight.
 *
 * @component
 *
 * @example
 * <TableHead>Column Title</TableHead>
 *
 * @example
 * // With custom alignment
 * <TableHead className="text-right">Amount</TableHead>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML th attributes
 */
function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
	return (
		<th
			className={cn(
				'text-left font-medium text-muted-foreground',
				className
			)}
			data-slot='table-head'
			{...props}
		/>
	)
}

/**
 * Table cell component for data.
 *
 * Use this for regular data cells in the table body.
 *
 * @component
 *
 * @example
 * <TableCell>Cell data</TableCell>
 *
 * @example
 * // With custom alignment
 * <TableCell className="text-right">$25.00</TableCell>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML td attributes
 */
function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
	return (
		<td
			className={cn(
				'overflow-hidden text-ellipsis whitespace-nowrap align-middle text-foreground',
				className
			)}
			data-slot='table-cell'
			{...props}
		/>
	)
}

/**
 * Table caption component.
 *
 * Use this to provide a title or summary for the table. The caption is displayed
 * below the table by default.
 *
 * @component
 *
 * @example
 * // Table with caption
 * <Table>
 *   <TableHeader>...</TableHeader>
 *   <TableBody>...</TableBody>
 *   <TableCaption>List of recent transactions</TableCaption>
 * </Table>
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to merge with default styles
 * @param props.props - All other standard HTML caption attributes
 */
function TableCaption({
	className,
	...props
}: React.ComponentProps<'caption'>) {
	return (
		<caption
			className={cn('mt-4 text-muted-foreground text-sm', className)}
			data-slot='table-caption'
			{...props}
		/>
	)
}

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption
}
