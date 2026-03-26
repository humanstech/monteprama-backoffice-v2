import { useLocation, useParams } from 'react-router'
import { useSite } from '@/features/sites/hooks'
import { useStatues } from '@/features/statues/hooks'

interface BreadcrumbItem {
	label: string
	href?: string
}

function useBreadcrumbs(): BreadcrumbItem[] {
	const { pathname } = useLocation()
	const params = useParams()

	// Get entity names for dynamic segments
	const { data: site } = useSite(params.siteId ?? '')
	const { data: statues } = useStatues()
	const statue = statues?.find((s) => s.id === params.statueId)

	const segments = pathname.split('/').filter(Boolean)
	const crumbs: BreadcrumbItem[] = []

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i]
		const path = `/${segments.slice(0, i + 1).join('/')}`

		switch (segment) {
			case 'sites':
				crumbs.push({ label: 'Siti archeologici', href: '/sites' })
				break
			case 'statues':
				crumbs.push({ label: 'Statue', href: '/statues' })
				break
			case 'users':
				crumbs.push({ label: 'Utenti' })
				break
			case 'poi':
				crumbs.push({ label: 'POI' })
				break
			case 'edit':
				crumbs.push({ label: 'Modifica' })
				break
			case 'content':
				crumbs.push({ label: 'Contenuti' })
				break
			case 'summary':
				crumbs.push({ label: 'Riepilogo' })
				break
			default:
				// Dynamic ID segments - try to resolve names
				if (params.siteId === segment && site) {
					crumbs.push({ label: site.name ?? 'Sito', href: path })
				} else if (params.statueId === segment && statue) {
					crumbs.push({ label: statue.name ?? 'Statua', href: path })
				} else if (params.poiId === segment) {
					crumbs.push({ label: 'POI' })
				}
				break
		}
	}

	return crumbs
}

export { useBreadcrumbs }
