import { Fragment } from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'

function AppHeader() {
	const breadcrumbs = useBreadcrumbs()

	return (
		<header className='flex h-16 shrink-0 items-center gap-4 border-b px-4'>
			<SidebarTrigger />
			<Separator className='h-6' orientation='vertical' />
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
									<BreadcrumbLink href={crumb.href}>
										{crumb.label}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	)
}

export { AppHeader }
