import { useLocation, useParams } from 'react-router'
import { useSite } from '@/features/sites/hooks'
import { useStatues } from '@/features/statues/hooks'

interface BreadcrumbItem {
	label: string
	href?: string
}

const STATIC_SEGMENTS: Record<string, BreadcrumbItem | null> = {
	sites: { label: 'Siti archeologici', href: '/sites' },
	statues: { label: 'Statue', href: '/statues' },
	users: { label: 'Utenti' },
	poi: null, // skip - poiId segment shows the name
	content: { label: 'Contenuti' }
}

function resolveDynamicSegment(
	segment: string,
	path: string,
	params: Record<string, string | undefined>,
	entities: {
		siteName?: string | null
		statueName?: string | null
		poiName?: string | null
	}
): BreadcrumbItem | null {
	if (params.siteId === segment) {
		return { label: entities.siteName ?? 'Sito', href: path }
	}
	if (params.statueId === segment) {
		return {
			label: entities.statueName ?? 'Statua',
			href: `/statues/${segment}/edit`
		}
	}
	if (params.poiId === segment) {
		return { label: entities.poiName ?? 'POI' }
	}
	return null
}

function useBreadcrumbs(): BreadcrumbItem[] {
	const location = useLocation()
	const { pathname } = location
	const params = useParams()

	const { data: site } = useSite(params.siteId ?? '')
	const { data: statues } = useStatues()
	const statue = statues?.find((s) => s.id === params.statueId)
	const poi = site?.pointsOfInterest?.find((p) => p.id === params.poiId)

	const entities = {
		siteName: site?.name,
		statueName: statue?.name,
		poiName: poi?.title ?? poi?.description
	}

	const segments = pathname.split('/').filter(Boolean)
	const crumbs: BreadcrumbItem[] = []

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i]
		const path = `/${segments.slice(0, i + 1).join('/')}`

		if (segment in STATIC_SEGMENTS) {
			const crumb = STATIC_SEGMENTS[segment]
			if (crumb) {
				crumbs.push(crumb)
			}
			continue
		}

		if (segment === 'edit' && !params.statueId) {
			crumbs.push({ label: 'Modifica' })
			continue
		}

		if (segment === 'summary') {
			crumbs.push({ label: 'Riepilogo' })
			continue
		}

		const dynamic = resolveDynamicSegment(segment, path, params, entities)
		if (dynamic) {
			crumbs.push(dynamic)
		}
	}

	return crumbs
}

export { useBreadcrumbs }
