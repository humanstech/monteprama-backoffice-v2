import { Landmark, LogOut, MapPin, Users } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'
import { authApi } from '@/features/auth/api'
import { useAuthStore } from '@/features/auth/stores/store'

const NAV_ITEMS = [
	{ path: '/sites', label: 'Siti archeologici', icon: MapPin },
	{ path: '/statues', label: 'Statue', icon: Landmark },
	{ path: '/users', label: 'Utenti', icon: Users }
] as const

function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	const handleLogout = async () => {
		try {
			await authApi.logout()
		} finally {
			useAuthStore.getState().reset()
			navigate('/login')
		}
	}

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className='flex items-center justify-center px-4 py-6'>
					<img
						alt="Mont'e Prama"
						className='h-16 w-auto'
						height={64}
						src='/logo.png'
						width={180}
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{NAV_ITEMS.map((item) => (
						<SidebarMenuItem key={item.path}>
							<SidebarMenuButton
								isActive={pathname.startsWith(item.path)}
								onClick={() => navigate(item.path)}
								tooltip={item.label}
							>
								<item.icon />
								<span>{item.label}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={handleLogout}
							tooltip='Esci'
						>
							<LogOut />
							<span>Esci</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

export { AppSidebar }
