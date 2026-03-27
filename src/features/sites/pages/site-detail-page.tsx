import { ArrowDown, ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoSitesSection } from '@/features/info-sites/components/info-sites-section'
import { TicketsSection } from '@/features/tickets/components/tickets-section'
import { raise } from '@/helpers/utils'
import { useReorderPois, useSite } from '../hooks'
import type { SitePoi } from '../types'

function SiteDetailPage() {
	const { siteId } = useParams()
	const { data: site, isLoading } = useSite(siteId ?? raise('Missing siteId'))

	if (isLoading) {
		return <Skeleton className='h-[600px]' />
	}

	if (!site) {
		return <p>Sito non trovato</p>
	}

	const sortedPois = [...(site.pointsOfInterest ?? [])].sort(
		(a, b) => (a.step ?? 0) - (b.step ?? 0)
	)

	return (
		<div className='space-y-6'>
			<h1 className='font-bold text-2xl'>{site.name ?? 'Sito'}</h1>

			<Tabs defaultValue='general'>
				<TabsList>
					<TabsTrigger value='general'>Generale</TabsTrigger>
					<TabsTrigger value='poi'>Punti di interesse</TabsTrigger>
					<TabsTrigger value='tickets'>Biglietti</TabsTrigger>
					<TabsTrigger value='info'>Info</TabsTrigger>
				</TabsList>

				<TabsContent className='mt-6' value='general'>
					<GeneralSection site={site} />
				</TabsContent>

				<TabsContent className='mt-6' value='poi'>
					<PoiListSection pois={sortedPois} siteId={siteId ?? ''} />
				</TabsContent>

				<TabsContent className='mt-6' value='tickets'>
					<TicketsSection siteId={siteId ?? ''} />
				</TabsContent>

				<TabsContent className='mt-6' value='info'>
					<InfoSitesSection siteId={siteId ?? ''} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

function GeneralSection({
	site
}: {
	site: NonNullable<ReturnType<typeof useSite>['data']>
}) {
	return (
		<div className='space-y-6'>
			<div className='grid gap-6 lg:grid-cols-2'>
				<div className='space-y-4'>
					<h2 className='font-semibold text-lg'>Cover</h2>
					{site.cover?.url ? (
						<img
							alt={site.name ?? ''}
							className='max-h-[300px] w-auto rounded-lg object-cover'
							height={300}
							loading='lazy'
							src={site.cover.url}
							width={400}
						/>
					) : (
						<div className='flex h-[200px] items-center justify-center rounded-lg bg-muted'>
							<span className='text-muted-foreground'>
								Nessuna cover
							</span>
						</div>
					)}
				</div>
				<div className='space-y-4'>
					<h2 className='font-semibold text-lg'>Galleria</h2>
					<div className='grid grid-cols-3 gap-2'>
						{site.medias?.map((media) => (
							<img
								alt={media.filename ?? ''}
								className='h-24 w-full rounded-md object-cover'
								height={96}
								key={media.id}
								loading='lazy'
								src={media.url ?? ''}
								width={96}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

function PoiListSection({ pois, siteId }: { pois: SitePoi[]; siteId: string }) {
	const navigate = useNavigate()
	const reorder = useReorderPois(siteId)
	const [localPois, setLocalPois] = useState<SitePoi[] | null>(null)

	const displayPois = localPois ?? pois

	const swap = (index: number, direction: 'up' | 'down') => {
		const targetIndex = direction === 'up' ? index - 1 : index + 1
		if (targetIndex < 0 || targetIndex >= displayPois.length) {
			return
		}

		const reordered = [...displayPois]
		const temp = reordered[index]
		reordered[index] = reordered[targetIndex]
		reordered[targetIndex] = temp

		// Assign new step values (1-based)
		const withSteps = reordered.map((poi, i) => ({
			...poi,
			step: i + 1
		}))

		setLocalPois(withSteps)

		// Persist to backend
		const updates = withSteps
			.filter(
				(p): p is SitePoi & { id: string; step: number } =>
					p.id != null && p.step != null
			)
			.map((p) => ({ siteId, id: p.id, step: p.step }))

		reorder.mutate(updates, {
			onSuccess: () => {
				setLocalPois(null)
				toast.success('Ordine aggiornato')
			},
			onError: () => {
				setLocalPois(null)
				toast.error("Errore nell'aggiornamento dell'ordine")
			}
		})
	}

	return (
		<div className='space-y-4'>
			<h2 className='font-semibold text-lg'>
				Punti di interesse ({displayPois.length})
			</h2>
			<div className='space-y-2'>
				{displayPois.map((poi, index) => (
					<div className='flex items-center gap-2' key={poi.id}>
						<div className='flex flex-col gap-1'>
							<Button
								className='size-7'
								disabled={index === 0 || reorder.isPending}
								onClick={() => swap(index, 'up')}
								size='icon'
								variant='ghost'
							>
								<ArrowUp className='size-4' />
							</Button>
							<Button
								className='size-7'
								disabled={
									index === displayPois.length - 1 ||
									reorder.isPending
								}
								onClick={() => swap(index, 'down')}
								size='icon'
								variant='ghost'
							>
								<ArrowDown className='size-4' />
							</Button>
						</div>
						<button
							className='flex flex-1 items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent'
							onClick={() =>
								navigate(`/sites/${siteId}/poi/${poi.id}`)
							}
							type='button'
						>
							<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm'>
								{poi.step ?? '?'}
							</span>
							{poi.cover?.url && (
								<img
									alt=''
									className='size-12 rounded-md object-cover'
									height={48}
									loading='lazy'
									src={poi.cover.url}
									width={48}
								/>
							)}
							<div className='flex-1'>
								<p className='font-medium'>
									{poi.title ??
										poi.description ??
										'POI senza nome'}
								</p>
								{poi.language && (
									<p className='text-muted-foreground text-sm'>
										{poi.language}
									</p>
								)}
							</div>
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default SiteDetailPage
