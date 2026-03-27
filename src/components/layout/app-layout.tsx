import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

function AppLayout() {
	return (
		<SidebarProvider className='h-svh overflow-hidden'>
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<div className='flex min-h-0 flex-1 flex-col overflow-y-auto p-6'>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

export { AppLayout }
