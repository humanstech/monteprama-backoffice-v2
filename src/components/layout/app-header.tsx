import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Fragment } from 'react'
import { Link } from 'react-router'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'

function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<Button
			onClick={() =>
				setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
			}
			size='icon'
			variant='ghost'
		>
			<Sun className='size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Cambia tema</span>
		</Button>
	)
}

function AppHeader() {
	const breadcrumbs = useBreadcrumbs()

	return (
		<header className='flex h-16 shrink-0 items-center gap-4 border-b px-4'>
			<SidebarTrigger />
			<Breadcrumb className='flex-1'>
				<BreadcrumbList>
					{breadcrumbs.map((crumb, index) => (
						<Fragment key={crumb.label}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								{index === breadcrumbs.length - 1 ||
								!crumb.href ? (
									<BreadcrumbPage>
										{crumb.label}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={crumb.href}>
											{crumb.label}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
			<ThemeToggle />
		</header>
	)
}

export { AppHeader }
