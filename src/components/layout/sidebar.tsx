import { Landmark, LogOut, MapPin, Users } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { authApi } from '@/features/auth/api'
import { useAuthStore } from '@/features/auth/stores/store'
import { cn } from '@/helpers/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { SidebarItem } from './sidebar-item'

const NAV_ITEMS = [
	{ path: '/sites', label: 'Siti archeologici', icon: MapPin },
	{ path: '/statues', label: 'Statue', icon: Landmark },
	{ path: '/users', label: 'Utenti', icon: Users }
] as const

function Sidebar() {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const isWide = useMediaQuery({ breakpoint: 'lg' })
	const isExpanded = isWide

	const handleLogout = async () => {
		try {
			await authApi.logout()
		} finally {
			useAuthStore.getState().reset()
			navigate('/login')
		}
	}

	return (
		<aside
			className={cn(
				'flex h-screen flex-col border-r bg-card py-8 transition-all duration-250',
				isExpanded ? 'w-[230px]' : 'w-[72px]'
			)}
		>
			{isExpanded && (
				<div className='px-6 pb-12'>
					<h1 className='font-bold text-lg'>Mont'e Prama</h1>
				</div>
			)}

			<nav className='flex flex-1 flex-col gap-2 px-3'>
				{NAV_ITEMS.map((item) => (
					<SidebarItem
						icon={<item.icon className='size-5' />}
						isExpanded={isExpanded}
						isSelected={pathname.startsWith(item.path)}
						key={item.path}
						label={item.label}
						onClick={() => navigate(item.path)}
					/>
				))}
			</nav>

			<div className='px-3'>
				<SidebarItem
					icon={<LogOut className='size-5' />}
					isExpanded={isExpanded}
					isSelected={false}
					label='Esci'
					onClick={handleLogout}
				/>
			</div>
		</aside>
	)
}

export { Sidebar }
