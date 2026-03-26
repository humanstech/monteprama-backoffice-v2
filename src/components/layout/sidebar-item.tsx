import { cn } from '@/helpers/utils'

interface SidebarItemProps {
	icon: React.ReactNode
	label: string
	isSelected: boolean
	isExpanded: boolean
	onClick: () => void
}

function SidebarItem({
	icon,
	label,
	isSelected,
	isExpanded,
	onClick
}: SidebarItemProps) {
	return (
		<button
			className={cn(
				'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
				isSelected
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
			)}
			onClick={onClick}
			type='button'
		>
			<span className='shrink-0'>{icon}</span>
			{isExpanded && <span className='truncate'>{label}</span>}
		</button>
	)
}

export { SidebarItem }
