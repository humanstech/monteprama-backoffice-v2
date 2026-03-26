import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

function AppLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<main className='flex min-h-0 flex-1 flex-col overflow-y-auto p-6'>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	)
}

export { AppLayout }
